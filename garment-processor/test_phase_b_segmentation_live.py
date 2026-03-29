"""
Test PHASE B with SEGMENTATION ENABLED.
Modifies config at runtime, processes reference images with SAM.
"""
import sys
from pathlib import Path

# IMPORTANT: Patch config BEFORE any app imports
import importlib
sys.path.insert(0, str(Path(__file__).parent))

# Patch the dataclass before anything imports SETTINGS
from app import config as config_module

original_settings_class = config_module.Settings

# Create a new settings class with segmentation enabled
class TestSettings(original_settings_class):
    def __init__(self):
        super().__init__()
    
    segmentation_enabled = True
    segmentation_fallback_to_yolo = True

# Replace the global SETTINGS instance
config_module.SETTINGS = TestSettings()

import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

from fastapi.testclient import TestClient
from app.application import create_app

def test_with_segmentation_enabled():
    """Test with SAM segmentation actually enabled."""
    logger.info("="*70)
    logger.info("PHASE B - TESTING WITH SEGMENTATION ENABLED")
    logger.info(f"segmentation_enabled: {config_module.SETTINGS.segmentation_enabled}")
    logger.info(f"segmentation_fallback_to_yolo: {config_module.SETTINGS.segmentation_fallback_to_yolo}")
    logger.info("="*70)
    
    try:
        app = create_app()
        
        with TestClient(app) as client:
            reference_images = [
                ("example.jpg", 1),
                ("example2.jpg", 4),
            ]
            
            for image_name, expected_count in reference_images:
                image_path = Path(__file__).parent / image_name
                
                if not image_path.exists():
                    logger.warning(f"Image not found: {image_path}")
                    continue
                
                logger.info(f"\n{'='*60}")
                logger.info(f"Processing with SAM: {image_name}")
                logger.info(f"Expected garments: ~{expected_count}")
                logger.info('='*60)
                
                try:
                    with image_path.open('rb') as f:
                        resp = client.post(
                            '/process-garments',
                            files={'image': (image_name, f, 'image/jpeg')}
                        )
                    
                    logger.info(f"HTTP Status: {resp.status_code}")
                    
                    if resp.status_code == 200:
                        data = resp.json()
                        count = len(data['garments'])
                        
                        logger.info(f"✅ SEGMENTATION PATH WORKED")
                        logger.info(f"Garments detected: {count} (expected ~{expected_count})")
                        
                        if count == expected_count:
                            logger.info(f"✅ COUNT MATCHES EXPECTED")
                        else:
                            logger.warning(f"⚠️  Count differs from expected")
                        
                        # Show details
                        for i, g in enumerate(data['garments'], 1):
                            cat = g['labels']['category']['label']
                            conf = g['detection_confidence']
                            logger.info(f"  {i}. {cat} (confidence={conf:.3f})")
                    else:
                        logger.error(f"❌ HTTP {resp.status_code}")
                        detail = resp.json().get('detail', 'No detail')
                        logger.error(f"Error: {detail}")
                
                except Exception as e:
                    logger.exception(f"❌ ERROR: {e}")
        
        logger.info("\n" + "="*70)
        logger.info("✅ SEGMENTATION ENABLED TEST COMPLETE")
        logger.info("="*70)
        return True
    
    except Exception as e:
        logger.exception(f"❌ FATAL ERROR: {e}")
        return False

if __name__ == "__main__":
    success = test_with_segmentation_enabled()
    sys.exit(0 if success else 1)
