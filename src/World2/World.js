let THREE = require("three")
let Chunk = require("./Chunk")

let LoadWorldGen = require("./WorldGens/DefaultGenerator")

let config = {
    chunkSize: 16
}


let V3 = THREE.Vector3




class World {
    constructor(args) {
        this.chunks = {}
        this.seed = args.seed
        this.generator = LoadWorldGen(args.seed)
        this.object = new THREE.Object3D()
        this.reporting = {
            warning : (message)=>{
                // debugger
            }
        }
    }
    createSpawnPoint(size) {
        let AllChunks = []
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    AllChunks.push(this.requestChunk(new V3(x, y, z), 3))
                }
            }
        }
        return Promise.all(AllChunks)
    }
    getChunkCoord(wCoord) {
        return new V3(
            (wCoord.x / config.chunkSize) | 0,
            (wCoord.y / config.chunkSize) | 0,
            (wCoord.z / config.chunkSize) | 0
        )
    }
    getBlock(wCoord) {
        let cCoord = this.getChunkCoord(wCoord)
        let chunkName = cCoord.x + "," + cCoord.y + "," + cCoord.z
        if (this.chunks[chunkName] != null) {
            return this.chunks[chunkName].getBlock(
                new V3(
                    wCoord.x % config.chunkSize,
                    wCoord.y % config.chunkSize,
                    wCoord.z % config.chunkSize)
            )
        }
    }
    setBlock(wCoord, block) {
        let cCoord = getChunkCoord(wCoord)
        let chunkName = cCoord.x + "," + coord.y + "," + coord.z
        if (this.chunks[chunkName] != null) {
            return this.chunks[chunkName].setBlock(
                new V3(
                    wCoord.x % config.chunkSize,
                    wCoord.y % config.chunkSize,
                    wCoord.z % config.chunkSize), block
            )
        }
    }
    requestChunk(cCoord, stage) {
        let name = cCoord.x + "," + cCoord.y + "," + cCoord.z
        return new Promise((res, rej) => {
            try {
                if (this.chunks[name] == null) {
                    this.chunks[name] = new Chunk({
                        world: this,
                        generator: this.generator,
                        cCoord: cCoord,
                        size: config.chunkSize,
                        name: name,
                    })
                    this.chunks[name].generate(stage).then(res).catch(rej);
                } else if (this.chunks[name].stage == stage) {
                    res(this.chunks[name])
                } else {
                    this.chunks[name].generate(stage).then(res).catch(rej);
                }
            }
            catch (e) {
                rej(e)
            }
        })
    }
}

module.exports = World;

World.prototype.mats = {
    // stone: new THREE.MeshStandardMaterial({
    //     color: 0xffffd1,
    //     metalness: 0.7,
    //     roughness: 0.7,
    //     flatShading: true
    // })
    stone: new THREE.MeshNormalMaterial({
        flatShading: true
    })
};

