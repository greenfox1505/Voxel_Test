let SimplexNoise = require("simplex-noise")


//hey, this could totally be pushed to a worker thread..., it doesn't depend on anything but itselfd
//edit: it could, but there is no reason. this noise function is very fast. world gen doesn't use that much time
class SurfaceWorldGen {
    constructor(seed, chunkSize,worldGenArgs) {
        this.simplex = new SimplexNoise(seed ? seed : null)
        this.size = chunkSize ? chunkSize : 16
        this.worldGenArgs = worldGenArgs
    }
    generateChunk(cX, cY, cZ) {
        let chunkArray = [];
        let s = this.size;
        let scale = 32;
        for (let z = 0; z < s; z++) {
            let absZ = z + (cZ * s)
            for (let x = 0; x < s; x++) {
                let absX = x + (cX * s)
                let surfaceHight = (this.simplex.noise2D(absX / scale, absZ / scale) )*8
                for (let y = 0; y < s; y++) {
                    let absY = y + (cY * s)
                    let blockType = 1;
                    if (absY > surfaceHight) {
                        blockType = 0
                    }
                    chunkArray[x + y * s + z * s * s] = blockType;
                }
            }
        }
        return chunkArray;
    }

}

module.exports = SurfaceWorldGen