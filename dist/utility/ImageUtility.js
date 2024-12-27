"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUtility = void 0;
const sharp_1 = __importDefault(require("sharp"));
class ImageUtility {
    /**
     * apply filters sequentially to an image from ImageUtility.filters static object
     * the filterConfig can only contain values that meant to be applied, else ignored if not defined
     * @param imagePath string, the path of the image source
     * @param filterConfig Filters interface
     * @param outputPath string, path for image output as file
     * @param fileName string, provide name of the output file (with file extension)
     */
    applyFilter(imagePath, filterConfig, outputPath, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            let processedImage = (0, sharp_1.default)(imagePath);
            for (const [name, value] of Object.entries(ImageUtility.filters)) {
                processedImage = ImageUtility.filters[name](processedImage, filterConfig);
            }
            const fs = require('fs');
            const path = require('path');
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true }); // Ensure the directory is created
            }
            const outputDir = path.join(outputPath, fileName);
            yield processedImage.toFile(outputDir);
        });
    }
}
exports.ImageUtility = ImageUtility;
/**
 * object of functions to apply filters
 * @param image as Sharp object
 * @param filters as Filters interface
 * @return image as Sharp object
 */
ImageUtility.filters = {
    grayscale: (image, filters) => {
        var _a;
        return (((_a = filters === null || filters === void 0 ? void 0 : filters.grayscale) === null || _a === void 0 ? void 0 : _a.value) ? image.grayscale() : image);
    },
    invert: (image, filters) => {
        var _a;
        return (((_a = filters === null || filters === void 0 ? void 0 : filters.invert) === null || _a === void 0 ? void 0 : _a.value) ? image.negate() : image);
    },
    brightness: (image, filters) => {
        var _a;
        return ((filters.brightness !== undefined) ? image.modulate({ brightness: (_a = filters.brightness) === null || _a === void 0 ? void 0 : _a.value }) : image);
    },
    saturation: (image, filters) => {
        var _a;
        return ((filters.saturation !== undefined) ? image.modulate({ saturation: (_a = filters.saturation) === null || _a === void 0 ? void 0 : _a.value }) : image);
    },
    hue: (image, filters) => {
        var _a;
        return ((filters.hue !== undefined) ? image.modulate({ hue: (_a = filters.hue) === null || _a === void 0 ? void 0 : _a.value }) : image);
    },
    lightness: (image, filters) => {
        var _a;
        return ((filters.lightness !== undefined) ? image.modulate({ lightness: (_a = filters.lightness) === null || _a === void 0 ? void 0 : _a.value }) : image);
    },
    contrast: (image, filters) => {
        var _a;
        return ((filters.contrast !== undefined) ? image.linear((_a = filters.contrast) === null || _a === void 0 ? void 0 : _a.value, 0) : image);
    },
    exposure: (image, filters) => {
        var _a;
        return ((filters.exposure !== undefined) ? image.linear((_a = filters.exposure) === null || _a === void 0 ? void 0 : _a.value, 0) : image);
    },
    threshold: (image, filters) => {
        var _a, _b;
        return ((filters.threshold !== undefined) ? image.threshold((_a = filters.threshold) === null || _a === void 0 ? void 0 : _a.threshold, { grayscale: (_b = filters.threshold) === null || _b === void 0 ? void 0 : _b.grayscale }) : image);
    },
    tint: (image, filters) => {
        var _a, _b, _c;
        return ((filters.tint !== undefined) ?
            image.tint({
                r: (_a = filters.tint) === null || _a === void 0 ? void 0 : _a.r,
                g: (_b = filters.tint) === null || _b === void 0 ? void 0 : _b.g,
                b: (_c = filters.tint) === null || _c === void 0 ? void 0 : _c.b
            })
            : image);
    }
};
