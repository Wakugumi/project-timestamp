import sharp from 'sharp'
import { FilterPreset, Filters } from '../interface/ImagePresetInterface';

export class ImageUtility {


    /**
     * object of functions to apply filters
     * @param image as Sharp object
     * @param filters as Filters interface
     * @return image as Sharp object
     */
    static filters : any = {
        grayscale: (image: sharp.Sharp, filters: Filters) => (
            filters?.grayscale?.value ? image.grayscale() : image
        ),
        invert: (image: sharp.Sharp, filters: Filters) => (
            filters?.invert?.value ? image.negate() : image
        ),
        brightness: (image: sharp.Sharp, filters: Filters) => (
            (   filters.brightness !== undefined) ? image.modulate({ brightness: filters.brightness?.value }) : image
        ),
        saturation: (image: sharp.Sharp, filters: Filters) => (
            (filters.saturation !== undefined) ? image.modulate({ saturation: filters.saturation?.value }) : image
        ),
        hue: (image: sharp.Sharp, filters: Filters) => (
            (filters.hue !== undefined) ? image.modulate({ hue: filters.hue?.value }) : image
        ),
        lightness: (image: sharp.Sharp, filters: Filters) => (
            (filters.lightness !== undefined) ? image.modulate({ lightness: filters.lightness?.value }) : image
        ),
        contrast: (image: sharp.Sharp, filters: Filters) => (
            (filters.contrast !== undefined) ? image.linear(filters.contrast?.value, 0) : image
        ),
        exposure: (image: sharp.Sharp, filters: Filters) => (
            (filters.exposure !== undefined) ? image.linear(filters.exposure?.value, 0) : image
        ),
        threshold: (image: sharp.Sharp, filters: Filters) => (
            (filters.threshold !== undefined) ? image.threshold(filters.threshold?.threshold, {grayscale: filters.threshold?.grayscale}) : image 
        ),
        tint: (image: sharp.Sharp, filters: Filters) => (
            (filters.tint !== undefined) ?
            image.tint({
                r: filters.tint?.r,
                g: filters.tint?.g,
                b: filters.tint?.b
            })
            : image
        )
    }
    
    /**
     * apply filters sequentially to an image from ImageUtility.filters static object
     * the filterConfig can only contain values that meant to be applied, else ignored if not defined
     * @param imagePath string, the path of the image source
     * @param filterConfig Filters interface
     * @param outputPath string, path for image output as file
     * @param fileName string, provide name of the output file (with file extension)
     */
    async applyFilter(imagePath: string, filterConfig: Filters, outputPath: string, fileName: string): Promise<void> {
        let processedImage = sharp(imagePath);

        for( const [name, value] of Object.entries(ImageUtility.filters)) {
            processedImage = ImageUtility.filters[name](
                processedImage,
                filterConfig
            )
        }


        const fs = require('fs');
        const path = require('path');

        if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true }); // Ensure the directory is created
        }

        const outputDir = path.join(outputPath, fileName);


        await processedImage.toFile(outputDir);
    }

}