let THREE = require('three');



class Chunk {
    constructor(blocks, size) {
        this.blocks = blocks
        this.size = size
        this.geometry = this.createGeometry(blocks)
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
        return this.blocks[
            x + (y * this.size) + (z * this.size * this.size)
        ]

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
    /**
     * 
     * @param {number[]} blocks 
     * @returns {THREE.Geometry}
     */
    createGeometry(blocks) {
        var box = new THREE.CubeGeometry(1, 1, 1);
        let outputGeo = new THREE.Geometry();
        // outputGeo.merge(box)
        //todo only create geomtry for visable sides
        let displacement = new THREE.Matrix4()
        for (let z = 0; z < this.size; z++) {
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    if (this.cordToBlock(x, y, z) == 1) {
                        displacement.makeTranslation(x-(this.size/2),y-(this.size/2),z-(this.size/2))
                        outputGeo.merge(box, displacement)
                    }
                }
            }
        }
        return outputGeo;
    }

}


module.exports = Chunk