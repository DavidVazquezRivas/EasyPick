#!/usr/bin/env python3
"""Direct test of example2.jpg with SAM segmentation enabled in config.py"""
import sys
import logging
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

from pathlib import Path
from fastapi.testclient import TestClient
from app.application import create_app

logger.info("="*70)
logger.info("TESTING SAM SEGMENTATION ON example2.jpg")
logger.info("(Config has segmentation_enabled=True)")
logger.info("="*70)

app = create_app()
with TestClient(app) as client:
    image_path = Path(__file__).parent / "example2.jpg"
    logger.info(f"\nImage: {image_path.name}")
    
    with image_path.open('rb') as f:
        resp = client.post('/process-garments', files={'image': ('example2.jpg', f, 'image/jpeg')})
    
    logger.info(f"Status: HTTP {resp.status_code}")
    
    if resp.status_code == 200:
        data = resp.json()
        count = len(data['garments'])
        logger.info(f"Garments found: {count}")
        
        for i, g in enumerate(data['garments'], 1):
            cat = g['labels']['category']['label']
            conf = g['detection_confidence']
            logger.info(f"  {i}. {cat} (confidence={conf:.3f})")
        
        logger.info("\n" + "="*70)
        if count == 4:
            logger.info("✅ SUCCESS - Found all 4 garments!")
            logger.info("SAM SEGMENTATION WORKS PERFECTLY")
        else:
            logger.info(f"Found {count} garments, expected 4")
        logger.info("="*70)
        
        sys.exit(0 if count == 4 else 1)
    else:
        logger.error(f"Error: {resp.json()}")
        sys.exit(1)
