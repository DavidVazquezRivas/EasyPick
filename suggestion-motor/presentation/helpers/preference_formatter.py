"""Helper to format preferences for LLM prompting."""

from typing import Dict, List

from presentation.schemas.suggestion_requests import SuggestionContextRequest
from infrastructure.state.memory_cache import MemoryCache


def _build_uuid_name_map(configs: dict, key: str) -> Dict[str, str]:
    try:
        items = configs.get("data", {}).get(key, [])
        return {item["id"]: item.get("name", item.get("id", "unknown")) for item in items}
    except Exception:
        return {}


def _translate_name(name: str, category: str) -> str:
    translations = MemoryCache.get("name_translations", {})
    mapping = translations.get(category, {}) if isinstance(translations, dict) else {}
    return mapping.get(name, name)


def _format_preference_list(pref_items, uuid_name_map: Dict[str, str], translate_key: str, label: str, limit: int = 8) -> str:
    scored = [
        (_translate_name(uuid_name_map.get(str(item.id), str(item.id)), translate_key), item.score)
        for item in pref_items
        if item.score is not None
    ]
    if not scored:
        return ""
    scored.sort(key=lambda x: abs(x[1]), reverse=True)
    lines = [f"{label}:"]
    for name, score in scored[:limit]:
        lines.append(f"  {name} ({score:+.0f})")
    return "\n".join(lines)


def format_preferences_for_prompt(request: SuggestionContextRequest) -> str:
    configs = MemoryCache.get("garment_configurations") or {}

    color_map = _build_uuid_name_map(configs, "colors")
    brand_map = _build_uuid_name_map(configs, "brands")
    category_map = _build_uuid_name_map(configs, "categories")
    style_map = _build_uuid_name_map(configs, "styles")

    sections = []
    for pref_items, uuid_map, translate_key, label in [
        (request.color_preferences, color_map, "colors", "Favorite colors"),
        (request.brand_preferences, brand_map, "brands", "Favorite brands"),
        (request.category_preferences, category_map, "categories", "Favorite categories"),
        (request.style_preferences, style_map, "styles", "Favorite styles"),
    ]:
        s = _format_preference_list(pref_items, uuid_map, translate_key, label)
        if s:
            sections.append(s)

    return "\n\n".join(sections) if sections else "No specific preferences"


def format_rejected_combinations_for_prompt(garment_ids_by_outfit: List[List[str]]) -> str:
    if not garment_ids_by_outfit:
        return ""
    combos = [f"[{', '.join(combo[:3])}]" for combo in garment_ids_by_outfit[:5]]
    return f"Avoid repeating: {', '.join(combos)}"
