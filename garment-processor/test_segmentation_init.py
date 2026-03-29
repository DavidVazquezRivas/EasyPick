"""Quick verification that segmentation service initializes."""
import sys
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

def test_segmentation_init():
    """Test if SAM can be initialized without error."""
    try:
        logger.info("Attempting to import SamSegmentationService...")
        from app.services.segmentation_service import SamSegmentationService
        
        logger.info("Creating default SAM instance...")
        segmenter = SamSegmentationService.create_default()
        
        logger.info("✅ SEGMENTATION SERVICE INITIALIZED SUCCESSFULLY")
        logger.info(f"Service type: {type(segmenter)}")
        logger.info(f"Processor: {segmenter._mask_pipeline}")
        
        return True
    except Exception as e:
        logger.error(f"❌ SEGMENTATION SERVICE INITIALIZATION FAILED")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error message: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_segmentation_init()
    sys.exit(0 if success else 1)
