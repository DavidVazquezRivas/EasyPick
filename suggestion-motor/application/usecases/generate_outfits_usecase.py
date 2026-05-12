import logging
from typing import List, Set, Optional
import json

from presentation.schemas.suggestion_requests import SuggestionRequest, Garment
from presentation.schemas.suggestion_responses import SuggestionResponse, Outfit, OutfitGarment
from application.interfaces.weather_provider import WeatherProvider

logger = logging.getLogger("generate_outfits_usecase")

# Temperature thresholds for warm_index filtering
COLD_TEMP_THRESHOLD = 10.0  # celsius; if below, prefer lower warm_index
WARM_TEMP_THRESHOLD = 25.0  # celsius; if above, prefer higher warm_index
HOT_TEMP_THRESHOLD = 30.0   # celsius; if above, strongly prefer low warm_index

# Warm index limits based on temperature
WARM_INDEX_COLD_MAX = 3.0    # Max warm_index when cold
WARM_INDEX_MODERATE_MAX = 6.0  # Max warm_index when moderate
WARM_INDEX_HOT_MAX = 2.0     # Max warm_index when hot


def _get_max_warm_index(temperature: Optional[float]) -> float:
    """Determine max acceptable warm_index based on temperature."""
    if temperature is None:
        return 10.0  # No constraint if temp unknown
    if temperature >= HOT_TEMP_THRESHOLD:
        return WARM_INDEX_HOT_MAX
    elif temperature >= WARM_TEMP_THRESHOLD:
        return WARM_INDEX_MODERATE_MAX
    elif temperature <= COLD_TEMP_THRESHOLD:
        return WARM_INDEX_COLD_MAX
    else:
        # Interpolate between moderate and cold
        return WARM_INDEX_MODERATE_MAX


def _filter_garments_by_temperature(garments: List[Garment], max_warm_index: float) -> List[Garment]:
    """Filter garments to exclude those that are too warm for the current temperature."""
    filtered = []
    for g in garments:
        if g.warm_index is not None and g.warm_index <= max_warm_index:
            filtered.append(g)
        elif g.warm_index is None:
            # Include garments with unknown warm_index
            filtered.append(g)
    return filtered


def _get_rejected_combinations(request: SuggestionRequest) -> Set[frozenset]:
    """Extract rejected outfit combinations as frozensets for O(1) lookup."""
    rejected = set()
    if request.history and request.history.rejections:
        for rejection in request.history.rejections:
            if rejection.garments:
                rejected.add(frozenset(rejection.garments))
    return rejected


def _is_combination_rejected(outfit_garment_uuids: List[str], rejected_combos: Set[frozenset]) -> bool:
    """Check if a combination of garments was previously rejected."""
    return frozenset(outfit_garment_uuids) in rejected_combos


async def generate_outfits(llm, request: SuggestionRequest, weather_provider: Optional[WeatherProvider] = None) -> SuggestionResponse:
    """Generate outfit suggestions combining deterministic filtering and LLM enhancement."""
    logger.info("Starting outfit generation for %d garments, expecting %d outfits", 
                len(request.garments), request.expected_outfits or 3)

    expected = request.expected_outfits or 3
    garments = request.garments
    rejected_combos = _get_rejected_combinations(request)

    # Phase 1: Deterministic pre-processing
    # 1.1 Get temperature to filter by warm_index
    temperature = None
    if weather_provider and request.user_location:
        temperature = await weather_provider.get_temperature(
            request.user_location.latitude,
            request.user_location.longitude
        )
        logger.info("Retrieved temperature: %s°C", temperature)

    max_warm_index = _get_max_warm_index(temperature)
    logger.info("Max acceptable warm_index: %.2f for temp %.1f°C", max_warm_index, temperature or -1)

    # 1.2 Filter by warm_index
    filtered_garments = _filter_garments_by_temperature(garments, max_warm_index)
    logger.info("Filtered garments: %d -> %d after warm_index check", len(garments), len(filtered_garments))

    # 1.3 Generate deterministic outfits, skipping rejected combinations
    outfits = []
    idx = 0
    attempt = 0
    max_attempts = len(filtered_garments) * 2

    while len(outfits) < expected and attempt < max_attempts:
        if idx + 3 > len(filtered_garments):
            idx = 0
        if idx == 0 and len(outfits) > 0:
            attempt += 1

        slice_g = filtered_garments[idx: idx + 3]
        if len(slice_g) < 3:
            # Not enough garments left; break
            break

        outfit_uuids = [g.uuid for g in slice_g]
        if not _is_combination_rejected(outfit_uuids, rejected_combos):
            outfits.append(Outfit(garments_list=[OutfitGarment(uuid=g.uuid) for g in slice_g]))
            logger.info("Generated outfit %d: %s", len(outfits), outfit_uuids)

        idx += 1

    # Phase 2: If we don't have enough outfits, call LLM to generate more
    if len(outfits) < expected and llm:
        garment_list_str = json.dumps([{"uuid": g.uuid, "type": g.type, "warm_index": g.warm_index} for g in filtered_garments[:50]])
        prompt = f"""You are an expert fashion stylist. Generate {expected - len(outfits)} outfit suggestions.
Garments available: {garment_list_str}
Temperature: {temperature}°C
Return valid JSON with structure: {{"outfits": [{{"garment_uuids": ["uuid1", "uuid2", "uuid3"]}}]}}
Ensure each outfit has exactly 3 garments from the provided list."""

        try:
            result = await llm.generate(prompt, temperature=0.4, max_tokens=512)
            if result and isinstance(result, dict) and "text" in result:
                # Try to parse LLM output as JSON
                text = result.get("text", "")
                # Simple extraction: look for JSON structure
                try:
                    json_start = text.find("{")
                    json_end = text.rfind("}") + 1
                    if json_start >= 0 and json_end > json_start:
                        json_str = text[json_start:json_end]
                        llm_outfits = json.loads(json_str)
                        llm_list = llm_outfits.get("outfits", [])
                        for llm_outfit in llm_list:
                            uuids = llm_outfit.get("garment_uuids", [])
                            if len(uuids) == 3 and all(any(g.uuid == u for g in filtered_garments) for u in uuids):
                                if not _is_combination_rejected(uuids, rejected_combos):
                                    garment_objs = [next(g for g in filtered_garments if g.uuid == u) for u in uuids]
                                    outfits.append(Outfit(garments_list=[OutfitGarment(uuid=g.uuid) for g in garment_objs]))
                                    logger.info("Generated LLM outfit %d: %s", len(outfits), uuids)
                                    if len(outfits) >= expected:
                                        break
                except json.JSONDecodeError:
                    logger.warning("Failed to parse LLM JSON output")
        except Exception as exc:
            logger.warning("LLM generation failed: %s", exc)

    # Phase 3: Return response
    logger.info("Returning %d outfits (requested %d)", len(outfits), expected)
    return SuggestionResponse(outfits=outfits)
