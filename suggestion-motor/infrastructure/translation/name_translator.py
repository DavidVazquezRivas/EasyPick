import logging
from typing import Dict, Optional

from infrastructure.state.memory_cache import MemoryCache

logger = logging.getLogger("name_translator")

_HARDCODED_TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "categories": {
        "Sudaderas": "Hoodies",
        "Ropa interior": "Underwear",
        "Deporte": "Sports",
        "Accesorios": "Accessories",
        "Vestidos": "Dresses",
        "Faldas": "Skirts",
        "Trajes": "Suits",
        "Ropa de baño": "Swimwear",
        "Pijamas": "Pajamas",
        "Abrigos": "Coats",
        "Tops": "Tops",
        "Camisas": "Shirts",
        "Blusas": "Blouses",
        "Polos": "Polo Shirts",
        "Chándales": "Tracksuits",
        "Leggings": "Leggings",
        "Shorts": "Shorts",
        "Vaqueros": "Jeans",
        "Jerséis": "Sweaters",
    },
    "styles": {
        "Casual": "Casual",
        "Smart Casual": "Smart Casual",
        "Formal / Business": "Formal / Business",
        "Deportivo / Athleisure": "Sports / Athleisure",
        "Streetwear": "Streetwear",
        "Minimalista": "Minimalist",
        "Vintage / Retro": "Vintage / Retro",
        "Bohemio (Boho)": "Bohemian (Boho)",
        "Preppy": "Preppy",
        "Grunge": "Grunge",
        "Loungewear (Estar por casa)": "Loungewear",
        "Fiesta / Noche": "Party / Night",
        "Urbano": "Urban",
        "Y2K": "Y2K",
    },
    "colors": {
        "Blanco": "White",
        "Azul Denim": "Denim Blue",
        "Negro": "Black",
        "Gris Claro": "Light Gray",
        "Gris Oscuro": "Dark Gray",
        "Azul Marino": "Navy Blue",
        "Azul Claro": "Light Blue",
        "Turquesa": "Turquoise",
        "Rojo": "Red",
        "Burdeos / Vino": "Burgundy / Wine",
        "Verde Esmeralda": "Emerald Green",
        "Verde Oliva": "Olive Green",
        "Amarillo": "Yellow",
        "Mostaza": "Mustard",
        "Naranja": "Orange",
        "Marrón": "Brown",
        "Beige": "Beige",
        "Caqui": "Khaki",
        "Rosa Pastel": "Pastel Pink",
        "Fucsia": "Fuchsia",
        "Morado": "Purple",
        "Lila": "Lilac",
    },
}


def load_translations() -> None:
    MemoryCache.set("name_translations", _HARDCODED_TRANSLATIONS)
    logger.info("Hardcoded translations loaded: categories=%d, styles=%d, colors=%d",
                len(_HARDCODED_TRANSLATIONS["categories"]),
                len(_HARDCODED_TRANSLATIONS["styles"]),
                len(_HARDCODED_TRANSLATIONS["colors"]))
    for key in ("categories", "styles", "colors"):
        mapping = _HARDCODED_TRANSLATIONS[key]
        if mapping:
            logger.info("--- %s translation ---", key.upper())
            for original, translated in mapping.items():
                logger.info("  %s -> %s", original, translated)


async def translate_config_names(llm) -> None:
    load_translations()
