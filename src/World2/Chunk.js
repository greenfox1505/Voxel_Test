let THREE = require("three")
let GeometryGenerator = require("./GeometryGenerator")



class Chunk {
    /**
     * 
     * @param {object} args 
     * @param {World} args.world 
     */
    constructor(args) {
        this.size = args.size
        this.size2 = args.size * args.size//speed saving member

        this.name = args.name
        this.cCoord = args.cCoord
        this.world = args.world
        this.generator = args.generator
        this.stage = 0;
        this.blocks = [];
        this.gCoord = args.cCoord.clone().multiplyScalar(args.size)
        //I feel like maybe there is a better way to map this...
        for (let i = 0; i < (args.size * args.size * args.size); i++) { this.blocks[i] = null }

        this.refreshGeo = GeometryGenerator;

        this.engine = {
            threeGeo: null,
            cannonGeo: null,
            threeMesh: null
        }

    }
    xyzToBlock(x, y, z) {
        //I didn't think I'd need it, but this does make Marching Cubes faster
        //this needs hit detection for outside of block
        if (x >= this.size | y >= this.size | z >= this.size) {
            let a = this.gCoord.clone().add({x:x,y:y,z:z})
            return this.world.getBlock(a)
            // console.error("coord to block hit detection needed!")
            // return 0;
        }
        let index = x * this.size2 + y * this.size + z;
        return this.blocks[index]
    }
    //maybe I need a veriation of this method that's "safe" who gets it's neighboors?
    getBlock(lCoord) {
        this.world.reporting.warning("todo detect outside!")
        return this.blocks[lCoord.x * this.size2 + lCoord.y * this.size + lCoord.z]
    }
    setBlock(lCoord, block) {
        try {
            this.world.reporting.warning("todo detect outside!")
            this.world.reporting.warning("mark for regeneration!")
            return this.blocks[lCoord.x * this.size2 + lCoord.y * this.size + lCoord.z] = block
        } catch (e) {
            debugger
        }
    }
    generate(stage) {
        /**@type {THREE.Vector3} */
        let cCoord = this.cCoord
        if (stage < 1) {
            throw "Stage CANNOT be less than One!"
        }
        return new Promise((res, rej) => {
            try {
                if (this.stage >= stage) {
                    res(this)
                }
                else if (stage == 1) {
                    this.generator(stage).then(res(this))//.catch(rej)
                } else {
                    let neighborhood = []
                    for (let x of [-1, 0, 1]) {
                        for (let y of [-1, 0, 1]) {
                            for (let z of [-1, 0, 1]) {
                                let neighbor = cCoord.clone()
                                neighbor.x += x;
                                neighbor.y += y;
                                neighbor.z += z;
                                neighborhood.push(
                                    this.world.requestChunk(neighbor, stage - 1)
                                )
                            }
                        }
                    }
                    Promise.all(neighborhood).then(this.generator(stage)).then(res(this))
                }
            }
            catch(e){
                rej(e)
            }
        })
    }
}

module.exports = Chunk;

