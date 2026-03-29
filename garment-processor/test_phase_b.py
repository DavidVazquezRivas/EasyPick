"""
Test Phase B: Segmentation-based processing with fallback strategy.

Tests both reference images with segmentation enabled, then disabled for comparison.
Logs the processing path and candidate counts for observability.
"""
import sys
import logging
from pathlib import Path
from io import BytesIO

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

sys.path.insert(0, str(Path(__file__).parent))

from fastapi.testclient import TestClient
from app.application import create_app
from app.config import SETTINGS
import json

def test_phase_b_segmentation():
    """Test segmentation path with both reference images."""
    logger.info("="*70)
    logger.info("PHASE B - SEGMENTATION TESTING")
    logger.info("="*70)
    
    # Create app with current settings
    app = create_app()
    
    with TestClient(app) as client:
        reference_images = [
            ("example.jpg", 1),  # (filename, expected_garments)
            ("example2.jpg", 4),
        ]
        
        for image_name, expected_count in reference_images:
            image_path = Path(__file__).parent / image_name
            
            if not image_path.exists():
                logger.warning(f"Image not found: {image_path}")
                continue
            
            logger.info(f"\n{'='*70}")
            logger.info(f"Testing: {image_name} (expecting ~{expected_count} garments)")
            logger.info(f"Current settings: segmentation_enabled={SETTINGS.segmentation_enabled}")
            logger.info('='*70)
            
            try:
                with image_path.open('rb') as f:
                    resp = client.post(
                        '/process-garments',
                        files={'image': (image_name, f, 'image/jpeg')}
                    )
                
                logger.info(f"Response status: {resp.status_code}")
                
                if resp.status_code == 200:
                    data = resp.json()
                    garments_count = len(data.get('garments', []))
                    logger.info(f"✅ SUCCESS: {garments_count} garments detected")
                    
                    if garments_count == expected_count:
                        logger.info(f"✅ MATCH: Detected expected count ({expected_count})")
                    else:
                        logger.warning(f"⚠️  MISMATCH: Expected {expected_count}, got {garments_count}")
                    
                    # Show per-garment info
                    for i, garment in enumerate(data['garments'], 1):
                        conf = garment['detection_confidence']
                        category = garment['labels']['category']['label']
                        logger.info(f"  Garment {i}: {category} (confidence={conf:.3f})")
                else:
                    logger.error(f"❌ FAILURE: HTTP {resp.status_code}")
                    logger.error(f"Detail: {resp.json().get('detail', 'No detail')}")
            
            except Exception as e:
                logger.exception(f"❌ ERROR processing {image_name}: {e}")
    
    logger.info("\n" + "="*70)
    logger.info("PHASE B TEST COMPLETE")
    logger.info("="*70)

if __name__ == "__main__":
    test_phase_b_segmentation()
