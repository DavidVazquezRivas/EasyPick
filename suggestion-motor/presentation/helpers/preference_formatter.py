"""Helper to format preferences for LLM prompting."""

from typing import Dict, List, Optional
from presentation.schemas.suggestion_requests import SuggestionContextRequest


def format_preferences_for_prompt(request: SuggestionContextRequest) -> str:
    """Format user preferences into a readable string for LLM context.
    
    Args:
        request: The suggestion context request with preferences
        
    Returns:
        Formatted preference string for inclusion in LLM prompt
    """
    parts = []
    
    if request.color_preferences:
        color_ids = [str(item.id) for item in request.color_preferences]
        color_str = ", ".join(color_ids[:5])  # Limitar a 5 para evitar token bloat
        parts.append(f"Preferred colors: {color_str}")
    
    if request.brand_preferences:
        brand_ids = [str(item.id) for item in request.brand_preferences]
        brand_str = ", ".join(brand_ids[:5])
        parts.append(f"Preferred brands: {brand_str}")
    
    if request.category_preferences:
        category_ids = [str(item.id) for item in request.category_preferences]
        category_str = ", ".join(category_ids[:5])
        parts.append(f"Preferred categories: {category_str}")
    
    if request.style_preferences:
        style_ids = [str(item.id) for item in request.style_preferences]
        style_str = ", ".join(style_ids[:5])
        parts.append(f"Preferred styles: {style_str}")
    
    return " | ".join(parts) if parts else "No specific preferences provided"


def format_rejected_combinations_for_prompt(garment_ids_by_outfit: List[List[str]]) -> str:
    """Format rejected outfit combinations into a readable string for LLM context.
    
    Args:
        garment_ids_by_outfit: List of outfit combinations to avoid
        
    Returns:
        Formatted rejection string for inclusion in LLM prompt
    """
    if not garment_ids_by_outfit:
        return ""
    
    # Limit to first 5 rejected combos to avoid token bloat
    combos = [f"[{', '.join(combo[:3])}]" for combo in garment_ids_by_outfit[:5]]
    return f"Avoid previous combinations: {', '.join(combos)}"
