import logging
from typing import List, Set, Optional
import json

from presentation.schemas.suggestion_requests import SuggestionRequest, Garment
from presentation.schemas.suggestion_responses import SuggestionResponse, Outfit, OutfitGarment
from application.interfaces.weather_provider import WeatherProvider
from infrastructure.state.memory_cache import MemoryCache

logger = logging.getLogger("generate_outfits_usecase")

COLD_TEMP_THRESHOLD = 10.0
WARM_TEMP_THRESHOLD = 25.0
HOT_TEMP_THRESHOLD = 30.0

WARM_INDEX_COLD_MAX = 3.0
WARM_INDEX_MODERATE_MAX = 6.0
WARM_INDEX_HOT_MAX = 2.0

MIN_PREFERENCE_SCORE = -20


def _get_max_warm_index(temperature: Optional[float]) -> float:
    if temperature is None:
        return 10.0
    if temperature >= HOT_TEMP_THRESHOLD:
        return WARM_INDEX_HOT_MAX
    elif temperature >= WARM_TEMP_THRESHOLD:
        return WARM_INDEX_MODERATE_MAX
    elif temperature <= COLD_TEMP_THRESHOLD:
        return WARM_INDEX_COLD_MAX
    else:
        return WARM_INDEX_MODERATE_MAX


def _filter_garments(garments: List[Garment], max_warm_index: float) -> List[Garment]:
    filtered = []
    for g in garments:
        if g.warm_index is not None and g.warm_index > max_warm_index:
            logger.debug("Filtered out by warmth: %s (warm_index=%s > max=%s)", g.uuid, g.warm_index, max_warm_index)
            continue
        if g.score is not None and g.score < MIN_PREFERENCE_SCORE:
            logger.debug("Filtered out by score: %s (score=%s < %s)", g.uuid, g.score, MIN_PREFERENCE_SCORE)
            continue
        filtered.append(g)
    return filtered


def _get_rejected_combinations(request: SuggestionRequest) -> Set[frozenset]:
    rejected = set()
    if request.history and request.history.rejections:
        for rejection in request.history.rejections:
            if rejection.garments:
                rejected.add(frozenset(rejection.garments))
    return rejected


def _is_combination_rejected(outfit_garment_uuids: List[str], rejected_combos: Set[frozenset]) -> bool:
    return frozenset(outfit_garment_uuids) in rejected_combos


def _translate(name: str, category: str) -> str:
    translations = MemoryCache.get("name_translations", {})
    mapping = translations.get(category, {}) if isinstance(translations, dict) else {}
    return mapping.get(name, name)


def _build_wardrobe_table(garments: List[Garment]) -> str:
    header = f"{'ID':<4} {'Type':<16} {'Color':<16} {'Style':<16} {'Brand':<16} {'Warmth':<7} {'Score':<6}"
    rows = [header]
    rows.append("-" * len(header))
    for i, g in enumerate(garments, start=1):
        rows.append(
            f"{str(i):<4} "
            f"{(_translate(g.type or '?', 'categories')):<16.16} "
            f"{(_translate(g.color or '?', 'colors')):<16.16} "
            f"{(_translate(g.style or '?', 'styles')):<16.16} "
            f"{(g.brand or '?'):<16.16} "
            f"{str(g.warm_index or '?'):<7} "
            f"{str(g.score) if g.score is not None else '?':<6}"
        )
    return "\n".join(rows)


def _build_prompt(
    garment_list_str: str,
    preferences_context: str,
    rejections_context: str,
    temperature: Optional[float],
    expected: int,
) -> str:
    temp_line = f"{temperature:.1f}\u00b0C" if temperature is not None else "unknown"

    sections = [
        "=== WEATHER ===",
        f"Temperature: {temp_line}",
        "",
        "=== YOUR WARDROBE ===",
        f"Each garment has an ID (use it in your response), type, color, style, brand, warmth index, and preference score.",
        garment_list_str,
    ]

    if preferences_context and preferences_context != "No specific preferences":
        sections.append("")
        sections.append("=== YOUR PREFERENCES ===")
        sections.append("Higher absolute score = stronger preference (positive) or aversion (negative).")
        sections.append(preferences_context)

    if rejections_context:
        sections.append("")
        sections.append("=== PREVIOUSLY REJECTED ===")
        sections.append(rejections_context)

    example_outfits = []
    for e in range(expected):
        base = e * 3 + 1
        example_outfits.append(f'{{"garment_ids": ["{base}", "{base+1}", "{base+2}"]}}')
    example = '{"outfits": [' + ", ".join(example_outfits) + "]}"
    sections.extend([
        "",
        "=== TASK ===",
        f"You MUST create exactly {expected} different outfit suggestions using exactly 3 garments each.",
        "Rules:",
        "- Make each outfit sensible for a normal person to wear, given the context provided.",
        "- Combine garments of different types: typically one upper-body + one lower-body + one complement (shoes, outerwear, accessories).",
        "- A one-piece garment (dress, suit, jumpsuit) can replace upper+lower.",
        "- Do NOT suggest 3 of the same type (e.g. 3 accessories, 3 tops, or 3 pants).",
        "- Consider warmth index against the temperature.",
        "- Prefer garments with higher scores. Avoid those with very negative scores.",
        "",
        f'Return ONLY valid JSON with exactly {expected} outfits. Example format: {example}',
    ])

    return "\n".join(sections)


async def generate_outfits(
    llm,
    request: SuggestionRequest,
    weather_provider: Optional[WeatherProvider] = None,
    preferences_context: Optional[str] = None,
    rejections_context: Optional[str] = None,
) -> SuggestionResponse:
    logger.info("Starting outfit generation for %d garments, expecting %d outfits",
                len(request.garments), request.expected_outfits or 3)

    expected = request.expected_outfits or 3
    garments = request.garments

    # --- Deterministic filtering ---
    temperature = None
    if weather_provider and request.user_location:
        temperature = await weather_provider.get_temperature(
            request.user_location.latitude,
            request.user_location.longitude
        )
        logger.info("Retrieved temperature: %s\u00b0C", temperature)

    max_warm_index = _get_max_warm_index(temperature)
    filtered = _filter_garments(garments, max_warm_index)
    logger.info("Filtered garments: %d -> %d (warmth max=%.1f, score min=%d)",
                len(garments), len(filtered), max_warm_index, MIN_PREFERENCE_SCORE)

    if not filtered:
        logger.warning("No garments after filtering")
        return SuggestionResponse(outfits=[])

    if not llm:
        logger.warning("No LLM provider available")
        return SuggestionResponse(outfits=[])

    # --- LLM generation ---
    rejected_combos = _get_rejected_combinations(request)

    id_to_uuid = {}
    garment_list_for_table = []
    for i, g in enumerate(filtered, start=1):
        simple_id = str(i)
        id_to_uuid[simple_id] = g.uuid
        garment_list_for_table.append(g)

    table_str = _build_wardrobe_table(garment_list_for_table)
    prompt = _build_prompt(
        table_str,
        preferences_context or "",
        rejections_context or "",
        temperature,
        expected,
    )

    try:
        result = await llm.generate(prompt, temperature=0.5, max_tokens=512)
        if result and isinstance(result, dict) and "text" in result:
            text = result.get("text", "")
            json_str = None

            if "```json" in text:
                start = text.rfind("```json") + len("```json")
                end = text.find("```", start)
                if end > start:
                    json_str = text[start:end].strip()

            if json_str is None:
                pos = text.rfind('{"outfits"')
                if pos >= 0:
                    brace_count = 0
                    for i in range(pos, len(text)):
                        if text[i] == "{":
                            brace_count += 1
                        elif text[i] == "}":
                            brace_count -= 1
                            if brace_count == 0:
                                json_str = text[pos:i + 1]
                                break

            if json_str:
                try:
                    llm_outfits = json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning("Failed to parse LLM JSON: %s", json_str[:200])
                    return SuggestionResponse(outfits=[])

                llm_list = llm_outfits.get("outfits", [])
                outfits = []
                seen = set()

                for llm_outfit in llm_list:
                    if len(outfits) >= expected:
                        break
                    simple_ids = llm_outfit.get("garment_ids", [])
                    uuids = [id_to_uuid.get(sid) for sid in simple_ids]
                    uuids = [u for u in uuids if u is not None]

                    if len(uuids) != 3:
                        continue

                    combo_key = frozenset(uuids)
                    if combo_key in seen or _is_combination_rejected(uuids, rejected_combos):
                        continue

                    seen.add(combo_key)
                    garment_objs = [next(g for g in filtered if g.uuid == u) for u in uuids]
                    outfits.append(Outfit(garments_list=[OutfitGarment(uuid=g.uuid) for g in garment_objs]))
                    logger.info("Generated outfit %d: %s", len(outfits), uuids)

                logger.info("LLM produced %d outfits (requested %d)", len(outfits), expected)
                return SuggestionResponse(outfits=outfits)
            else:
                logger.warning("No JSON found in LLM output: %s", text[:200])

    except Exception as exc:
        logger.warning("LLM generation failed: %s", exc)

    return SuggestionResponse(outfits=[])
