let Chunk = require("./Chunk")

let config = {
    chunkSize: 16
}


class World {
    constructor() {
        this.chunks = {}
    }
    createSpawnPoint() {
        this.chunks["0,0,0"] = new Chunk({
            world: this,
            name: "0,0,0",
            normalCoord: new THREE.Vector3(0, 0, 0),
            size: config.chunkSize
        })
        this.chunks["0,0,0"].generate(3);
    }
    getChunkCoord(wCoord) {
        return new THREE.Vector3(wCoord.x, wCoord.y, wCoord.z).divideScalar(config.chunkSize).floor()
    }
    getBlock(wCoord) {
        let cCoord = getChunkCoord(wCoord)
        return this.chunks[cCoord.x + "," + coord.y + "," + coord.z]
        .getBlock(
            new THREE.Vector3(
                wCoord.x % config.chunkSize, 
                wCoord.y % config.chunkSize, 
                wCoord.z % config.chunkSize)
            )
    }
    requestChunk(name, stage) {
        var that = this;
        return new Promise((res, rej) => {
            if (this.chunks[name].stage == stage) {
                res(this.chunks[name])
            } else {
                // this.chunks.
            }
        })
    }
}