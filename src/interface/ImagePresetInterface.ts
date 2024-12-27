export interface Filters {
    /**
             * Converts image into grayscale
             * @type boolean
             */
    grayscale?   :   {
        value   :   boolean,
    },

    /**
     * Produce the "negative" of the image
     * @type boolean
     */
    invert?      :   {
        value   :   boolean
    },

    /**
     * Luminance multiplier, adjust brightness as multiplicative
     * @type number | Float32Array
     */
    brightness?  :   {
        value   :   number
    },

    /**
     * Saturation multiplier
     * @type number | Float32Array
     */
    saturation?  :   {
        value   :   number
    },

    /**
     * Rotates hue in degree
     * @type number
     */
    hue?         :   {
        value   :   number
    },

    /**
     * Luminance addition, adjust brightness as additive
     */
    lightness?   :   {
        value   :   number
    },

    /**
     * Adjust image level with linear method: a * input + b
     * The value indicates *a*, while *b* will be left 0 as the offset
     * @type number | Float32Array
     */
    contrast?    :   {
        value   :   number | number[]
    },

    /**
     * Adjust image level with linear method: a * input + b
     * @type number | Float32Array
     * where *a* indicates the value, while *b* left 0
     */
    exposure?    :   {
        value   :   number | number[]
    },

    /**
     * Any pixel value greater than or equal to "threshold" will be set to 255, otherwise 0
     * @type threshold: number, grayscale: boolean
     */
    threshold?   :   {
        threshold   :   number,
        grayscale   :   boolean
    },

    /**
     * Tint the image, ignoring alpha channel
     * r : red, 0 - 255
     * g : green, 0 - 255,
     * b : blue, 0 - 255
     */
    tint?        :   {
        r   :   number,
        g   :   number,
        b   :   number
    }
}

export interface FilterPreset {
    name    :   string,
    filters :   Filters
}