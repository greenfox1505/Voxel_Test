let THREE = require('three');



let polys = {
    up: new THREE.PlaneGeometry(1, 1, 1), //+y
    down: new THREE.PlaneGeometry(1, 1, 1), //-y
    north: new THREE.PlaneGeometry(1, 1, 1), //+z
    south: new THREE.PlaneGeometry(1, 1, 1), //-z
    west: new THREE.PlaneGeometry(1, 1, 1),//+x //this seems backword, shouldn't east be +x?
    east: new THREE.PlaneGeometry(1, 1, 1),//-x
}
polys.north.translate(0, 0, 0.5)
polys.up.rotateX(-Math.PI / 2).translate(0, 0.5, 0)
polys.down.rotateX(Math.PI / 2).translate(0, -0.5, 0)
polys.south.rotateY(Math.PI).translate(0, 0, -0.5)
polys.west.rotateY(Math.PI / 2).translate(0.5, 0, 0)
polys.east.rotateY(-Math.PI / 2).translate(-0.5, 0, 0)


class Chunk {
    /**
     * @param {number[]} args.blocks
     * @param {number} args.size
     * @param {THREE.Material} args.material
     * @param {THREE.Vector3} args.cLoc
     * @param {World} args.world
     */
    constructor(args) {
        // debugger
        if (args.name) this.name = args.name; else throw "A chunk with no name"
        if (args.blocks) this.blocks = args.blocks; else throw "BadBlocks"
        if (args.size) this.size = args.size;
        else if (args.world) { this.size = args.world.chunkSize; this.world = args.world }
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
        // debugger
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        if (args.cLoc) {
            this.mesh.position.copy(args.cLoc);
            this.cLoc = this.mesh.position.clone();
            this.mesh.position.multiplyScalar(this.size);
        } else {
            throw "NO LOCATION!"
        }
    }
    //if this isn't used for a while, imma delete it.
    // cordToIndex(x, y, z) {
    //     if (x < 0 | y < 0 | z < 0 | x >= this.size | y >= this.size | z >= this.size) {
    //         return null
    //     }
    //     return x + (y * this.size) + (z * this.size * this.size)
    // }
    cordToBlock(x, y, z) {
        //if outside chunk, return other chunk!
        if (x < 0 | y < 0 | z < 0 | x >= this.size | y >= this.size | z >= this.size) {
            return 0
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
                    let thisBlock = this.cordToBlock(x, y, z);
                    if (thisBlock) {
                        displacement.makeTranslation(x, y, z)
                        if (this.cordToBlock(x, y + 1, z) == 0) {
                            outputGeo.merge(polys.up, displacement)
                        }
                        if (this.cordToBlock(x, y - 1, z) == 0) {
                            outputGeo.merge(polys.down, displacement)
                        }
                        if (this.cordToBlock(x - 1, y, z) == 0) {
                            outputGeo.merge(polys.east, displacement)
                        }
                        if (this.cordToBlock(x + 1, y, z) == 0) {
                            outputGeo.merge(polys.west, displacement)
                        }
                        if (this.cordToBlock(x, y, z + 1) == 0) {
                            outputGeo.merge(polys.north, displacement)
                        }
                        if (this.cordToBlock(x, y, z - 1) == 0) {
                            outputGeo.merge(polys.south, displacement)
                        }
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