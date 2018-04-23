let THREE = require('three');


let loader = new THREE.JSONLoader();


class Chunk {
    /**
     * @param {number[]} args.blocks
     * @param {number} args.size
     * @param {THREE.Material} args.material
     * @param {THREE.Vector3} args.cLoc
     * @param {World} args.world
     */
    constructor(args) {
        if(args.name) this.name = args.name; else throw "A chunk with no name"
        if (args.blocks) this.blocks = args.blocks; else throw "BadBlocks"
        if (args.size) this.size = args.size;
        else if( args.world){ this.size = args.world.chunkSize}
        else throw "No World or Size"

        // if(args.neighbors){
        //     this.neighbors = args.neighbors
        // }
        // else{
        //     throw "No Neighbors Defined"
        // }

        this.geometry = this.createGeometry(this.blocks)
        // debugger
        this.mesh = new THREE.Mesh(this.geometry, args.material);
        if (args.cLoc) {
            this.mesh.position.copy(args.cLoc);
            this.cLoc = this.mesh.position.clone();
            this.mesh.position.multiplyScalar(this.size);
        } else {
            throw "NO LOCATION!"
        }
    }
    cordToIndex(x, y, z) {
        if (x < 0 | y < 0 | z < 0 | x >= this.size | y >= this.size | z >= this.size) {
            return null
        }
        return x + (y * this.size) + (z * this.size * this.size)
    }
    cordToBlock(x, y, z) {
        //if outside chunk, return other chunk!
        if (x < 0 | y < 0 | z < 0 | x >= this.size | y >= this.size | z >= this.size) {
            return null
        }
        let index = x + (y * this.size) + (z * this.size * this.size)
        // debugger
        return this.blocks[index]
    }
    /**
     * @param {THREE.Vector3} vect 
     * @returns {number}
     */
    static vectorToIndex(vect) {
        return vect.x + vect.y * s + vect.z * (s * s)
    }
    /**
     * 
     * @param {number} index
     * @returns {THREE.Vector3} 
     */
    static indexToVector(index) {
        return new THREE.Vector3(
            index % this.size,
            ((index / this.size) | 0) % this.size,
            ((index / (this.size * this.size)) | 0) % this.size)
    }
    checkNeighbors(x, y, z) {
        // debugger
        if (this.cordToBlock(x - 1, y, z) && this.cordToBlock(x + 1, y, z) &&
            this.cordToBlock(x, y - 1, z) && this.cordToBlock(x, y + 1, z) &&
            this.cordToBlock(x, y, z - 1) && this.cordToBlock(x, y, z + 1)) {
            return false
        }
        else return true
    }


    /**
     * @param {number[]} blocks 
     * @returns {THREE.Geometry}
     */
    createGeometry(blocks) {
        let start = Date.now()
        let box = new THREE.CubeGeometry(1, 1, 1);
        let outputGeo = new THREE.Geometry();
        // outputGeo.merge(box)
        //todo only create geomtry for visable sides
        let displacement = new THREE.Matrix4()
        for (let z = 0; z < this.size; z++) {
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    if (this.cordToBlock(x, y, z) == 1 && this.checkNeighbors(x, y, z)) {
                        displacement.makeTranslation(x - (this.size / 2), y - (this.size / 2), z - (this.size / 2))
                        outputGeo.merge(box, displacement)
                    }
                }
            }
        }
        let dt = Date.now() - start
        totalTime += dt
        n++
        console.log("time: ", dt, "avg: ", totalTime / n)

        
        // console.log()
        // console.log(outputGeo)
        
        return outputGeo;
    }

}
let n = 0;
let totalTime = 0;

module.exports = Chunk