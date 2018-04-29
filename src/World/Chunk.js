let THREE = require('three');

let MCTris = require("./mcMesh.json")

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

        this.geometry = this.createGeometry2()
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
    marchingNeighbors(x, y, z) {
        var output = 0
        if (this.cordToBlock(x, y, z)) {
            output = output | 1
        }
        if (this.cordToBlock(x + 1, y, z)) {
            output = output | 2
        }
        if (this.cordToBlock(x + 1, y, z + 1)) {
            output = output | 4
        }
        if (this.cordToBlock(x, y, z + 1)) {
            output = output | 8
        }

        if (this.cordToBlock(x, y + 1, z)) {
            output = output | 16
        }
        if (this.cordToBlock(x + 1, y + 1, z)) {
            output = output | 32
        }
        if (this.cordToBlock(x + 1, y + 1, z + 1)) {
            output = output | 64
        }
        if (this.cordToBlock(x, y + 1, z + 1)) {
            output = output | 128
        }
        return output
    }
    createGeometry2() {
        let geometry = new THREE.BufferGeometry();
        console.time("MC Geo Test")
        let vertexes = []
        let normals = []
        for (let z = 0; z < this.size - 1; z++) {
            for (let y = 0; y < this.size - 1; y++) {
                for (let x = 0; x < this.size - 1; x++) {
                    let elem = MCTris[ this.marchingNeighbors(x,y,z)]
                    let tris = elem[0]
                    let norm = elem[1]
                    for(let i = 0 ; i < tris.length ; i = i+3){
                        vertexes[vertexes.length] = tris[i]+x
                        vertexes[vertexes.length] = tris[i+1]+y
                        vertexes[vertexes.length] = tris[i+2]+z
                        normals[normals.length] = norm[i]
                        normals[normals.length] = norm[i+1]
                        normals[normals.length] = norm[i+2]
                        
                    }
                }
            }
        }
        // debugger
        var geoVerts = new Float32Array( vertexes );
        var geoNorms = new Float32Array( normals );
        
        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.addAttribute( 'position', new THREE.BufferAttribute( geoVerts, 3 ) );
        // geometry.addAttribute( 'normal', new THREE.BufferAttribute( geoNorms, 3 ) );
        
        console.timeEnd("MC Geo Test")
        return geometry
    }

    /**
     * @param {number[]} blocks 
     * @returns {THREE.Geometry}
     */
    createGeometry() {
        let blocks = this.blocks
        let start = Date.now()
        let holderGeo = new THREE.Geometry();
        // outputGeo.merge(box)
        //todo only create geomtry for visable sides
        let displacement = new THREE.Matrix4();
        for (let z = 0; z < this.size; z++) {
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    let thisBlock = this.cordToBlock(x, y, z);
                    if (thisBlock) {
                        displacement.makeTranslation(x, y, z)
                        if (this.cordToBlock(x, y + 1, z) == 0) {
                            holderGeo.merge(polys.up, displacement)
                        }
                        if (this.cordToBlock(x, y - 1, z) == 0) {
                            holderGeo.merge(polys.down, displacement)
                        }
                        if (this.cordToBlock(x - 1, y, z) == 0) {
                            holderGeo.merge(polys.east, displacement)
                        }
                        if (this.cordToBlock(x + 1, y, z) == 0) {
                            holderGeo.merge(polys.west, displacement)
                        }
                        if (this.cordToBlock(x, y, z + 1) == 0) {
                            holderGeo.merge(polys.north, displacement)
                        }
                        if (this.cordToBlock(x, y, z - 1) == 0) {
                            holderGeo.merge(polys.south, displacement)
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
        let outputGeo = new THREE.BufferGeometry().fromGeometry(holderGeo)
        holderGeo.dispose()
        return outputGeo;
    }

}
let n = 0;
let totalTime = 0;

module.exports = Chunk