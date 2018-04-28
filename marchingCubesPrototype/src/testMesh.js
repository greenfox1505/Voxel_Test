let THREE = require("three")

let mcElem = []

function vRotY90(vertexIndex) {
    return [1, 2, 3, 0, 5, 6, 7, 4][vertexIndex]
}
function vRotX90(vertexIndex) {
    return [3, 2, 6, 7, 0, 1, 5, 4][vertexIndex]
}
function eRotY90(edgeIndex) {
    return [1, 2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8][edgeIndex]
}
function eRotX90(edgeIndex) {
    return [2, 10, 6, 11, 0, 9, 4, 8, 3, 1, 5, 7][edgeIndex]
}
// function eRotX90() {
//     return [2, 10,]
// }
//I don't need a zrotation

class MarchingCubeElement {
    constructor(vertIndex, pos) {
        this.vertIndex = vertIndex
        this.pos = pos
        if (pos % 3) { throw "Tris Arg must be multipul of 3" }
        this.trisCount = pos.length / 3

        this.index = 0
        for (let i in vertIndex) {
            this.index = this.index | v[vertIndex[i]].i
            // debugger
        }
    }
    invert(){
        let vertIndex = []
        for( let i = 0; i < 8; i ++){
            if(this.vertIndex.indexOf(i) == -1){
                vertIndex.push(i)
            }
        }
        let pos = []; 
        for(let i =0; i < this.pos.length; i = i+3){
            pos.push(this.pos[i+2])
            pos.push(this.pos[i+1])
            pos.push(this.pos[i])
        }
        return new MarchingCubeElement(vertIndex, pos)
    }
    rotateY() {
        let vertIndex = []
        for (let i of this.vertIndex) {
            vertIndex.push(vRotY90(i))
        }
        let pos = []
        for (let i of this.pos) {
            pos.push(eRotY90(i))
        }
        return new MarchingCubeElement(vertIndex, pos)
    }
    rotateX() {
        let vertIndex = []
        for (let i of this.vertIndex) {
            vertIndex.push(vRotX90(i))
        }
        let pos = []
        for (let i of this.pos) {
            pos.push(eRotX90(i))
        }
        return new MarchingCubeElement(vertIndex, pos)
    }
    getTri(i) {
        i = i * 3;
        return [
            e[this.pos[i]].x, e[this.pos[i]].y, e[this.pos[i]].z,
            e[this.pos[i + 1]].x, e[this.pos[i + 1]].y, e[this.pos[i + 1]].z,
            e[this.pos[i + 2]].x, e[this.pos[i + 2]].y, e[this.pos[i + 2]].z,
        ]
    }
    toGeo() {
        var output = new THREE.BufferGeometry();
        var vertices = []
        for (let i = 0; i < this.trisCount; i++) {
            this.getTri(i).map((e, j) => {
                vertices.push(e)//this seems wonky...   
            })
        }
        // deb  ugger
        var position = new Float32Array(vertices)

        output.addAttribute('position', new THREE.BufferAttribute(position, 3));
        return output
    }

}

let v = [
    new THREE.Vector3(0, 0, 0),//v0
    new THREE.Vector3(1, 0, 0),//v1
    new THREE.Vector3(1, 0, 1),//v2
    new THREE.Vector3(0, 0, 1),//v3
    new THREE.Vector3(0, 1, 0),//v4
    new THREE.Vector3(1, 1, 0),//v5
    new THREE.Vector3(1, 1, 1),//v6
    new THREE.Vector3(0, 1, 1),//v7
].map((vect, i) => { vect.i = Math.pow(2, i); return vect })
let e = [
    new THREE.Vector3(1, 0, 0),//e0 
    new THREE.Vector3(2, 0, 1),//e1 
    new THREE.Vector3(1, 0, 2),//e2 
    new THREE.Vector3(0, 0, 1),//e3 
    new THREE.Vector3(1, 2, 0),//e4 
    new THREE.Vector3(2, 2, 1),//e5 
    new THREE.Vector3(1, 2, 2),//e6 
    new THREE.Vector3(0, 2, 1),//e7 
    new THREE.Vector3(0, 1, 0),//e8 
    new THREE.Vector3(2, 1, 0),//e9 
    new THREE.Vector3(2, 1, 2),//e10 
    new THREE.Vector3(0, 1, 2),//e11
].map((vect, i) => { vect.multiplyScalar(0.5); vect.i = Math.pow(2, i); return vect })

// debugger
let atomics = [
    new MarchingCubeElement([], []), 
    new MarchingCubeElement([0], [0, 8, 3]), 
    new MarchingCubeElement([0, 1], [9, 8, 3, 1, 9, 3])
]

function addMCube(element){
    if(mcElem[element.index] == null){
        console.log("adding " + element.index, element)
        mcElem[element.index] = element        
    }
}

function AllYs(input) {
    addMCube(input);//stupid
    addMCube(input.rotateY())
    addMCube(input.rotateY().rotateY())
    addMCube(input.rotateY().rotateY().rotateY())
}
function AllXYs(input){
    AllYs(input);//stupid
    AllYs(input.rotateX())
    AllYs(input.rotateX().rotateX())
    AllYs(input.rotateX().rotateX().rotateX())
       
}

for (let i of atomics) {
    AllXYs(i)
    
    AllXYs(i.invert() )
    debugger
}

// FillElem(mcElem[v[0].i])


blue = new THREE.MeshBasicMaterial({ color: 0x0000ff })
yellow = new THREE.MeshBasicMaterial({ color: 0xffff00 })
green = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
red = new THREE.MeshBasicMaterial({ color: 0xff0000 })
vertexBox = new THREE.BoxGeometry(0.1, 0.1, 0.1);
edgeCenter = new THREE.SphereGeometry(0.05);

function mcVis(index) {
    let output = new THREE.Object3D();
    for (i in v) {
        let color = v[i].i & index ? green : red
        let vCorner = new THREE.Mesh(vertexBox, color);
        vCorner.position.copy(v[i]).sub({ x: 0.5, y: 0.5, z: 0.5 })
        output.add(vCorner)
    }
    // for (i in e) {
    //     let vEdge = new THREE.Mesh(edgeCenter, blue);
    //     vEdge.position.copy(e[i]).sub({ x: 0.5, y: 0.5, z: 0.5 })
    //     output.add(vEdge)
    // }
    // debugger
    if (mcElem[index]) {
        var poly1 = new THREE.Mesh(mcElem[index].toGeo(), yellow)
        poly1.position.subScalar(.5)
        output.add(poly1)
    }

    return output
}

exports.mcVis = mcVis;