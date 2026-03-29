"""
Test reference images and generate comparison report.
Runs the /process-garments endpoint on multiple reference images.
"""

import base64
import json
from pathlib import Path
from datetime import datetime
from fastapi.testclient import TestClient
from app.application import create_app

def decode_image_info(img_b64: str):
    """Extract image type and size from base64 data."""
    raw = base64.b64decode(img_b64)
    
    # Detect format by magic bytes
    if raw[:8] == b'\x89PNG\r\n\x1a\n':
        fmt = 'PNG'
    elif raw[:2] == b'\xff\xd8':
        fmt = 'JPEG'
    else:
        fmt = 'UNKNOWN'
    
    return {'format': fmt, 'size_bytes': len(raw), 'b64_length': len(img_b64)}

def test_image(client, image_path: Path):
    """Test a single image via /process-garments endpoint."""
    print(f"\n{'='*70}")
    print(f"Testing: {image_path.name}")
    print('='*70)
    
    result = {
        'image': image_path.name,
        'timestamp': datetime.now().isoformat(),
        'status_code': None,
        'garments_count': 0,
        'garments': [],
        'error': None,
    }
    
    try:
        with image_path.open('rb') as f:
            resp = client.post(
                '/process-garments',
                files={'image': (image_path.name, f, 'image/jpeg')}
            )
        
        result['status_code'] = resp.status_code
        
        if resp.status_code != 200:
            payload = resp.json()
            result['error'] = payload
            print(f"❌ Error (HTTP {resp.status_code}): {json.dumps(payload, ensure_ascii=False)[:500]}")
        else:
            payload = resp.json()
            garments = payload.get('garments', [])
            result['garments_count'] = len(garments)
            
            for i, garment in enumerate(garments):
                labels = garment.get('labels', {})
                category = labels.get('category', {}).get('label', 'unknown')
                color = labels.get('color', {}).get('label', 'unknown')
                conf = garment.get('detection_confidence', 0)
                img_b64 = garment.get('image_base64', '')
                
                img_info = decode_image_info(img_b64)
                
                garment_entry = {
                    'index': i,
                    'category': category,
                    'color': color,
                    'confidence': round(conf, 4),
                    'image_format': img_info['format'],
                    'image_size_bytes': img_info['size_bytes'],
                }
                
                result['garments'].append(garment_entry)
                
                status = '✅' if conf >= 0.95 else '⚠️'
                print(f"  {status} [{i}] {category:12} | color: {color:10} | conf: {conf:.4f}")
            
            print(f"\n✅ Success: {result['garments_count']} garments detected")
    
    except Exception as e:
        result['error'] = str(e)
        print(f"❌ Exception: {e}")
    
    return result

def main():
    """Test all reference images and generate report."""
    
    # Initialize
    app = create_app()
    
    reference_images = [
        Path('example.jpg'),
        Path('example2.jpg'),
    ]
    
    results = {
        'timestamp': datetime.now().isoformat(),
        'total_images': len(reference_images),
        'images': [],
    }
    
    # Test each image using proper context manager
    with TestClient(app) as client:
        for img_path in reference_images:
            if img_path.exists():
                result = test_image(client, img_path)
                results['images'].append(result)
            else:
                print(f"\n⚠️  Image not found: {img_path}")
    
    # Save results
    output_dir = Path('debug_output')
    output_dir.mkdir(exist_ok=True)
    
    results_file = output_dir / 'test-results.json'
    with results_file.open('w') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*70}")
    print(f"📋 Results saved to: {results_file}")
    print('='*70)
    
    # Summary
    print(f"\n📊 Summary:")
    for img_result in results['images']:
        status = '✅' if img_result['status_code'] == 200 else '❌'
        print(f"  {status} {img_result['image']:15} → {img_result['garments_count']} garments")
    
    return results

if __name__ == '__main__':
    main()
