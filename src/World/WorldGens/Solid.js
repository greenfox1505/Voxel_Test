let SimplexNoise = require("simplex-noise")


//hey, this could totally be pushed to a worker thread..., it doesn't depend on anything but itself
class SolidWorldGen {
    constructor(seed, chunkSize, worldGenArgs) {
        this.simplex = new SimplexNoise(seed ? seed : null)
        this.size = chunkSize ? chunkSize : 16
        this.worldGenArgs = worldGenArgs
    }
    generateChunk(cLoc) {
        let chunkArray = [];
        let s = this.size;
        let scale = 32;
        for (let z = 0; z < s; z++) {
            let absZ = z + (cLoc.z * s)
            for (let y = 0; y < s; y++) {
                let absY = y + (cLoc.y * s)
                for (let x = 0; x < s; x++) {
                    let absX = x + (cLoc.x * s)
                    let value = this.simplex.noise3D(absX / scale, absY / scale, absZ / scale);
                    value = value>0?1:0
                    chunkArray[x + y * s + z * s * s] = value;
                }
            }
        }
        return chunkArray
    }

}

module.exports = SolidWorldGen