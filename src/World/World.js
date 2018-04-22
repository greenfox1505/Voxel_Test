/**
 * World.js
 * Manages all chunks. Manages scene graph.
 * Maybe it will do some other things here...
 */

let THREE = require('three');


let chunkSize = 16




class World {
    constructor(args) {
        this.seed = args.seed ? args.seed : "helloWorld";
        if(args.generator == null){
            throw "No generator here"
        }else{
            this.generator = args.generator 
        }
        this.saveData = args.saveData ? args.saveData : {};

        this.chunks = {}
        this.scene = new THREE.Scene();

    }
    spawnChunk(cX,cY,cZ){// #TODO : idk, maybe these should be vectors....
        let chunkName = cX + "." + cY + "." + cZ;
        chhunk
    }
    clearChunk(cX,cY,cZ){

    }

}

