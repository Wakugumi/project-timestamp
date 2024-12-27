import fs from 'fs';
import sharp from 'sharp';
import { ImageUtility } from '../../../src/utility/ImageUtility'; // Update with the correct path to your class
import { Filters } from '../../../src/interface/ImagePresetInterface';
const path = require('path')

describe('ImageUtility Tests', () => {
  const testImagePath = './tests/unit/utility/test-images/sample.jpg'; // Path to the sample image
  const outputDir = './tests/unit/utility/test-images/output/'; // Directory to save test outputs
  let imageUtility = new ImageUtility();
  let config : Filters;

  beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    
  });

  it('should apply some filters correctly', async () => {
    
    config = {
      contrast: {
          value: 1.8
        },
      brightness: {
        value: 1.2
      },
      exposure: {
        value: 1.2
      }
    }
    await imageUtility.applyFilter(testImagePath, config, outputDir, "test_image.jpg");

    const metadata = await sharp(path.join(outputDir, 'test_image.jpg')).metadata();
    expect(metadata).toBeDefined();
  });


  afterAll(() => {
  });
});
