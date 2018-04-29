let THREE = require("three")

let mcElem = []

function vRotY90(vertexIndex) {
    return [1, 2, 3, 0, 5, 6, 7, 4][vertexIndex]
}
function vRotX90(vertexIndex) {
    return [3, 2, 6, 7, 0, 1, 5, 4][vertexIndex]
}
function vMirror(vertexIndex) {
    return [1, 0, 3, 2, 5, 4, 7, 6][vertexIndex]
}
function eRotY90(edgeIndex) {
    return [1, 2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8][edgeIndex]
}
function eRotX90(edgeIndex) {
    return [2, 10, 6, 11, 0, 9, 4, 8, 3, 1, 5, 7][edgeIndex]
}
function eMirror(edgeIndex) {
    return [0, 3, 2, 1, 4, 7, 6, 5, 9, 8, 11, 10][edgeIndex]
}

function nRotY90(normalIndex) {
    return [4, 5, 2, 3, 1, 0][normalIndex]
}
function nRotX90(normalIndex) {
    return [0, 1, 5, 4, 2, 3][normalIndex]
}
function nMirror(normalIndex) {
    return [1, 0, 2, 3, 4, 5][normalIndex]
}
function nInvert(normalIndex) {
    return [1, 0, 3, 2, 5, 4][normalIndex]
}

class MarchingCubeElement {
    constructor(vertIndex, pos, normal, primitive, nameString) {
        this.vertIndex = vertIndex
        this.pos = pos
        this.normals = normal ? normal : []
        if (pos % 3) { throw "Tris Arg must be multipul of 3" }
        this.trisCount = pos.length / 3

        this.index = 0
        for (let i in vertIndex) {
            this.index = this.index | v[vertIndex[i]].i
        }
        this.primitive = primitive;
        if (nameString) {
            this.nameString = nameString
        } else {
            this.nameString = primitive
        }
    }
    invert() {
        let vertIndex = []
        for (let i = 0; i < 8; i++) {
            if (this.vertIndex.indexOf(i) == -1) {
                vertIndex.push(i)
            }
        }
        let pos = [];
        for (let i = 0; i < this.pos.length; i = i + 3) {
            pos.push(this.pos[i + 2])
            pos.push(this.pos[i + 1])
            pos.push(this.pos[i])
        }

        let normal = []
        for (let i = 0; i < this.normals.length; i = i + 3) {
            normal.push(nInvert(this.normals[i + 2]))
            normal.push(nInvert(this.normals[i + 1]))
            normal.push(nInvert(this.normals[i]))
        }
        return new MarchingCubeElement(vertIndex, pos, normal, this.primitive, this.nameString + " invert")
    }
    mirror() {
        let vertIndex = []
        for (let i of this.vertIndex) {
            vertIndex.push(vMirror(i))
        }
        let pos = []
        for (let i = 0; i < this.pos.length; i = i + 3) {
            pos.push(eMirror(this.pos[i + 2]))
            pos.push(eMirror(this.pos[i + 1]))
            pos.push(eMirror(this.pos[i]))
        }
        let normal = []
        for (let i = 0; i < this.normals.length; i = i + 3) {
            normal.push(nMirror(this.normals[i + 2]))
            normal.push(nMirror(this.normals[i + 1]))
            normal.push(nMirror(this.normals[i]))
        }
        // debugger
        return new MarchingCubeElement(vertIndex, pos, normal, this.primitive, this.nameString + " mirror")
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
        let normal = []
        for (let i of this.normals) {
            normal.push(nRotY90(i))
        }
        return new MarchingCubeElement(vertIndex, pos, normal, this.primitive, this.nameString + " rotY")
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
        let normal = []
        for (let i of this.normals) {
            normal.push(nRotX90(i))
        }
        return new MarchingCubeElement(vertIndex, pos, normal, this.primitive, this.nameString + " rotX")
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
        let output = new THREE.BufferGeometry();
        let vertices = []
        for (let i = 0; i < this.trisCount; i++) {
            this.getTri(i).map((e, j) => {
                vertices.push(e)//this seems wonky...   
            })
        }
        let normalVerts = []
        for (let i = 0; i < this.normals.length; i++) {
            normalVerts.push(n[this.normals[i]].x)
            normalVerts.push(n[this.normals[i]].y)
            normalVerts.push(n[this.normals[i]].z)
        }

        let position = new Float32Array(vertices)
        let normal = new Float32Array(normalVerts)
        // debugger
        output.addAttribute('position', new THREE.BufferAttribute(position, 3));
        output.addAttribute('normal', new THREE.BufferAttribute(normal, 3));
        return output
    }
    export() {
        // debugger
        let output = {
            pos: [],
            norm: []
        }
        if (this.pos.length != this.normals.length) {
            throw "Positions length must equal normal length!"
        }
        for (let i = 0; i < this.pos.length; i++) {
            output.pos.push(e[this.pos[i]].x, e[this.pos[i]].y, e[this.pos[i]].z)
        }
        for (let i = 0; i < this.normals.length; i++) {
            output.norm.push(n[this.normals[i]].x, n[this.normals[i]].y, n[this.normals[i]].z)
        }
        return output;
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

let n = [
    new THREE.Vector3(1, 0, 0),//n0
    new THREE.Vector3(-1, 0, 0),//n1
    new THREE.Vector3(0, 1, 0),//n2
    new THREE.Vector3(0, -1, 0),//n3
    new THREE.Vector3(0, 0, 1),//n4
    new THREE.Vector3(0, 0, -1),//n5
]

// debugger
let atomics = [
    new MarchingCubeElement([], [], [], 0),
    new MarchingCubeElement([0], [0, 8, 3], [0, 2, 4], 1),
    new MarchingCubeElement([0, 1], [9, 8, 3, 1, 9, 3], [2, 2, 4, 4, 2, 4], 2),
    new MarchingCubeElement([0, 5], [0, 8, 3, 5, 4, 9], [0, 2, 4, 4, 1, 3], 3),
    new MarchingCubeElement([1, 2, 3], [10, 9, 11, 9, 0, 3, 3, 11, 9], [2, 2, 2, 2, 1, 5, 5, 2, 2], 4),

    new MarchingCubeElement([0, 1, 2, 3], [8, 10, 9, 8, 11, 10], [2, 2, 2, 2, 2, 2], 5),
    new MarchingCubeElement([1, 2, 3, 4], [10, 9, 11, 9, 0, 3, 3, 11, 9, 4, 7, 8], [2, 2, 2, 2, 1, 5, 5, 2, 2, 0, 4, 3], 6),
    new MarchingCubeElement([0, 5, 2, 7], [0, 8, 3, 5, 4, 9, 1, 2, 10, 7, 6, 11], [0, 2, 4, 4, 1, 3, 5, 1, 2, 5, 0, 3], 7),
    new MarchingCubeElement([0, 2, 3, 7], [0, 10, 1, 0, 6, 10, 6, 0, 8, 8, 7, 6], [0, 2, 5, 0, 0, 2, 0, 0, 2, 2, 5, 0], 8),
    new MarchingCubeElement([1, 2, 3, 7], [0, 10, 9, 0, 3, 7, 0, 7, 10, 10, 7, 6], [1, 2, 2, 1, 5, 5, 1, 5, 2, 2, 5, 0], 9),

    new MarchingCubeElement([0, 6], [0, 8, 3, 6, 5, 10], [0, 2, 4, 1, 5, 3], 10),
    new MarchingCubeElement([0, 1, 6], [9, 8, 3, 1, 9, 3, 6, 5, 10], [2, 2, 4, 4, 2, 4, 1, 5, 3], 11),
    new MarchingCubeElement([1, 6, 4], [0, 1, 9, 4, 7, 8, 5, 10, 6], [1, 4, 2, 0, 4, 3, 5, 3, 1], 12),
    new MarchingCubeElement([0, 4, 2, 6], [0, 4, 3, 3, 4, 7, 2, 6, 5, 2, 5, 1], [0, 0, 4, 4, 0, 4, 1, 1, 5, 1, 5, 5], 13),
    new MarchingCubeElement([0, 2, 3, 6], [8, 11, 0, 0, 11, 5, 0, 5, 1, 11, 6, 5], [2, 2, 0, 0, 2, 5, 0, 5, 5, 2, 1, 5], 14),//I'm pretty sure this is the same as #9....
]

function indexCheck(e, x, y) {
    let i = (x - 1) + (y - 1) * 16
    if (e.index == i) { return true; }
    return false;
}


function addMCube(element) {
    if (mcElem[element.index] == null) {
        // // debugger
        // // console.log("adding " + element.index, element)
        // if (indexCheck(element, 15, 3) |
        //     indexCheck(element, 14, 5) |
        //     indexCheck(element, 5, 8) |
        //     indexCheck(element, 8, 2) |
        //     indexCheck(element, 9, 15) |
        //     indexCheck(element, 2, 14)) {
        // }
        // else {
        //     console.log(element.index % 16 + 1, ((element.index / 16) | 0) + 1, element.nameString)
        //     debugger
        // }
        mcElem[element.index] = element
    }
}

function AllYs(input) {
    addMCube(input);//stupid
    addMCube(input.rotateY())//redudant
    addMCube(input.rotateY().rotateY())
    addMCube(input.rotateY().rotateY().rotateY())
}
function AllXYs(input) {
    AllYs(input);//stupid
    AllYs(input.rotateX())
    AllYs(input.rotateX().rotateX())
    AllYs(input.rotateX().rotateX().rotateX())

}

// console.time("populating MC list")
for (let i of atomics) {
    AllXYs(i)
    AllXYs(i.rotateY())
    AllXYs(i.invert())
    AllXYs(i.rotateY().invert())
    AllXYs(i.mirror())
    AllXYs(i.invert().mirror())
}
// console.timeEnd("populating MC list")

// FillElem(mcElem[v[0].i])

let normal = new THREE.MeshNormalMaterial()

let yellow = new THREE.MeshBasicMaterial({ color: 0xffff00 })
let blue = new THREE.MeshBasicMaterial({ color: 0x0000ff })
let green = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
let red = new THREE.MeshBasicMaterial({ color: 0xff0000 })

let whiteLine = new THREE.LineBasicMaterial({ color: 0xffffff })

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

        let geo = mcElem[index].toGeo()
        let poly1 = new THREE.Mesh(geo, normal)
        poly1.position.subScalar(.5)
        output.add(poly1)

        let edges = new THREE.EdgesGeometry(geo);
        let line = new THREE.LineSegments(edges, whiteLine);

        let normals = new THREE.VertexNormalsHelper(poly1, 0.5, 0x00ff00, 2);
        normals.position.x = -5

        output.add(normals)
        poly1.add(line);




    }
    else {
        debugger
        let x = index % 16
        let y = (index / 16) | 0

        console.log("missing index " + index, { x: x + 1, y: y + 1 })

    }

    return output
}


exports.mcVis = mcVis;

function ExportMarchingCubes() {
    let output = []
    for (let i in mcElem) {
        let temp = mcElem[i].export();

        output[i] = [temp.pos, temp.norm]
        // console.log(output[i])
    }
    return output
}
exports.ExportMarchingCubes = ExportMarchingCubes

if (require.main === module) {
    console.log(JSON.stringify(ExportMarchingCubes()))
}
