let mcMesh = require("./mcMesh.json")
let THREE = require('three')
/**
 * @this {Chunk}
 */
function GeometryGenerator() {
    //TODO: clean up old geometry if it exists!
    if (this.engine.threeGeo != null) { throw "GEO ALREADY EXISTS!" }

    this.engine.threeGeo = new THREE.BufferGeometry();
    let verts = []

    let lCoord = new THREE.Vector3()//todo aabb looping object!

    for (let x = 0; x < (this.size-1); x++) {
        lCoord.x = x;
        for (let y = 0; y < (this.size-1); y++) {
            lCoord.y = y;
            for (let z = 0; z < (this.size-1); z++) {
                lCoord.z = z;
                let tris = mcMesh[marchingNeighbors.bind(this)(lCoord,1)]
                for (let i = 0; i < tris.length; i = i + 3) {
                    verts[verts.length] = tris[i] + x
                    verts[verts.length] = tris[i + 1] + y
                    verts[verts.length] = tris[i + 2] + z

                }
            }
        }
    }
    let geoVerts = new Float32Array(verts);
    this.engine.threeGeo.addAttribute('position', new THREE.BufferAttribute(geoVerts, 3));
    this.engine.threeMesh = new THREE.Mesh(this.engine.threeGeo, this.world.mats.stone)
    this.engine.threeMesh.position.copy(
        this.gCoord
    )

    this.world.object.add(this.engine.threeMesh)

}



function marchingNeighbors(lCoord, block) {
    let x = lCoord.x
    let y = lCoord.y
    let z = lCoord.z
    let output = 0;
    //there is a non-branching way to write this...
    if (block == this.xyzToBlock(x, y, z)) {
        output = output | 1
    }
    if (block == this.xyzToBlock(x + 1, y, z)) {
        output = output | 2
    }
    if (block == this.xyzToBlock(x + 1, y, z + 1)) {
        output = output | 4
    }
    if (block == this.xyzToBlock(x, y, z + 1)) {
        output = output | 8
    }
    if (block == this.xyzToBlock(x, y + 1, z)) {
        output = output | 16
    }
    if (block == this.xyzToBlock(x + 1, y + 1, z)) {
        output = output | 32
    }
    if (block == this.xyzToBlock(x + 1, y + 1, z + 1)) {
        output = output | 64
    }
    if (block == this.xyzToBlock(x, y + 1, z + 1)) {
        output = output | 128
    }
    return output
}

module.exports = GeometryGenerator;
