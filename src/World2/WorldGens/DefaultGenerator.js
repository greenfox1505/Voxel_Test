let THREE = require("three")
let SimplexNoise = require('simplex-noise')

let prop = {
    stone: {
        freq: 16
    }
}

function Terrain(rnd) {
    /**@type {SimplexNoise} */
    //    let stone = rnd.stone
    // console.log("Generating Terrain for " + this.name)
    let lCoord = new THREE.Vector3();
    for (let x = 0; x < this.size; x++) {
        lCoord.x = x;
        for (let y = 0; y < this.size; y++) {
            lCoord.y = y;
            for (let z = 0; z < this.size; z++) {
                lCoord.z = z;
                let block = ((rnd.stone(x, y, z) + 1) | 0)
                if (block == 0) {
                    block = ((rnd.grass(x, y, z) + 1) | 0)
                }
                this.setBlock(lCoord, block)
            }
        }
    }
}

function Structures(rnd) {
    // console.error("TODO: Generating Structures for " + this.name)
}

function Load(seed) {
    let rnd = {
        stone: SeededSimplex(seed + "stone", 16),
        dirt: SeededSimplex(seed + "dirt", 16)
    }

    return function DefaultGenerator(stage) {
        switch (stage) {
            case 1:
                Terrain.bind(this)(rnd)
                break;
            case 2:
                Structures.bind(this)(rnd)
                break;
            case 3:
                //3rd pass, prep for rendering
                this.refreshGeo()
                break;
            default:
                throw "There is no Stage" + stage + "generation!"
                break;
        }

        this.stage = stage
    }

}

module.exports = Load;



let seed = "HelloWorld"


function SeededSimplex(seed, freq) {
    let noise = new SimplexNoise(seed)
    return function (x, y, z) {
        return noise.noise3D(x / freq, y / freq, z / freq)
    }
}