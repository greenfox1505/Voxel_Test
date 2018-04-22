let SimplexNoise = require("simplex-noise")

class SurfaceWorldGen {
    constructor(seed, chunkSize) {
        this.simplex = new SimplexNoise(seed ? seed : null)
        this.size = chunkSize ? chunkSize : 16
    }
    generateChunk(cX, cY, cZ) {
        let chunkArray = [];
        let s = this.size;
        let scale = 32;
        for (let z = 0; z < s; z++) {
            for (let x = 0; x < s; x++) {
                let absZ = z + (cZ * s)
                let absX = x + (cX * s)
                let surfaceHight = (this.simplex.noise2D(absX / scale, absZ / scale) +1)*8
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


// function mc(seed) {


//     let loc = args.loc
//     let blocks = []; for (let i = 0; i < (s * s * s); i++) { blocks[i] = 0 }
//     // debugger
//     for (let i = 0; i < s; i++) {
//         for (let j = 0; j < s; j++) {
//             let t = 32
//             let h = (simplex.noise2D((i + loc.x * s) / t, (j + loc.y * s) / t) + 1) * (s / 2)
//             for (let k = 0; k < h; k++) {
//                 blocks[i + k * s + j * s * s] = 1;

//             }
//         }
//     }

//     let c = new Chunk({
//         blocks: blocks, size: s, material: new THREE.MeshNormalMaterial(),
//     })
//     c.mesh.position.x += args.loc.x * s
//     c.mesh.position.z += args.loc.y * s
//     return c;
// }
