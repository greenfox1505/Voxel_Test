
/**
 * World.js
 * Manages all chunks. Manages scene graph.
 * Maybe it will do some other things here...
 */

let THREE = require('three');


let Chunk = require("./Chunk")

let asdf = new THREE.MeshNormalMaterial()


class World {
    /**
     * @param {Function} args.generator
     * @param {object} [args.saveData={}]
     * @param {number} args.chunkSize
     */
    constructor(args) {
        //this.seed = args.seed ? args.seed : "helloWorld";
        if (args.generator == null) {
            throw "No generator here"
        } else {
            this.generator = args.generator
        }
        this.chunkSize = args.chunkSize
        this.chunks = {}
        this.ThreeObject = new THREE.Object3D();
    }
    createStartingArea(n) {
        let cCoord = new THREE.Vector3();
        for (let x = 0; x < n; x++) {
            cCoord.x = x
            for (let y = 0; y < n; y++) {
                cCoord.y = y
                for (let z = 0; z < n; z++) {
                    cCoord.z = z
                    this.spawnChunk(cCoord);
                }
            }
        }
        for(let i in this.chunks){
            this.chunks[i].generateMesh
        }
    }

    /**
     * @param {THREE.Vector3} cCoord 
     */
    spawnChunk(cCoord) {
        let chunkName = cCoord.x + "." + cCoord.y + "." + cCoord.z;
        let blocks = this.generator(cCoord);
        this.chunks[chunkName] = new Chunk({name:chunkName, blocks: blocks, material: asdf, cLoc: cCoord , world:this})
        this.ThreeObject.add(this.chunks[chunkName].mesh)


        return this.chunks[chunkName]
    }
    clearChunk(cX, cY, cZ) {

    }

}

module.exports = World;