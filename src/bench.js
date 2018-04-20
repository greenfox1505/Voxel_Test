let THREE = require('three');



class Chunk {
    constructor(blocks, size, material) {
        this.blocks = blocks
        this.size = size
        this.geometry = this.createGeometry(blocks)
        this.mesh = new THREE.Mesh(this.geometry, material);
        console.log("checkNeighbors", this.checkNeighbors(1, 1, 1))
        console.log("checkNeighbors2", this.checkNeighbors(1, 0, 1))
    }
    vectorToBlock(v3) {
        //if outside chunk, return other chunk!
        if (v3.x < 0 | v3.y < 0 | v3.z < 0 |
            v3.x >= this.size | v3.y >= this.size | v3.z >= this.size) {
            return null
        }
        return this.blocks[v3.x + (v3.y * this.size) + (v3.z * this.size * this.size)]
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
        console.time("creating geo " + this.size)
        var box = new THREE.CubeGeometry(1, 1, 1);
        let outputGeo = new THREE.Geometry();
        // outputGeo.merge(box)
        //todo only create geomtry for visable sides
        let displacement = new THREE.Matrix4()
        for (let z = 0; z < this.size; z++) {
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    if (this.cordToBlock(x, y, z) == 1 && this.checkNeighbors(x,y,z)) {
                        displacement.makeTranslation(x - (this.size / 2), y - (this.size / 2), z - (this.size / 2))
                        outputGeo.merge(box, displacement)
                    }
                }
            }
        }
        console.timeEnd("creating geo " + this.size)
        return outputGeo;
    }

}


module.exports = Chunk