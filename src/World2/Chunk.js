let THREE = require("three")

class Chunk {
    constructor(args){
        this.world = args.world
        this.generator = args.generator
        this.stage = 0;
        this.blocks = []; 
        //I feel like maybe there is a better way to map this...
        for( let i = 0; i < (args.size*args.size*args.size); i++){this.blocks[i] = null}
    }
    get stage(){
        return this.stage
    }
    getBlock(localCoord){

    }
    generate(stage){
        return new Promise((res,rej)=>{
            //request neighbors stage = n-1
            //generate stage = n for this chunk
        })
    }
}

module.exports = Chunk;
