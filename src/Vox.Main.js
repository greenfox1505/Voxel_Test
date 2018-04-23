let simplex = new (require('simplex-noise'))()
// debugger
let THREE = require('three');
let Chunk = require("./World/Chunk")

let FlyCam = require("./FlyCam.js")

let s = 16;
let n = 5;

let material = new THREE.MeshNormalMaterial();


let Monitor = require("./Monitor.js");

let Solid = new (require("./World/WorldGens/Solid"))("helloworld", s)

let myWorld = new (require("./World/World"))({
	generator: (a) => {
		return Solid.generateChunk(a)
	},
	chunkSize: s,
})

myWorld.createStartingArea(n)


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let mat = new THREE.MeshNormalMaterial();

scene.add(myWorld.ThreeObject)


UpdateFlyCam = new FlyCam(camera, renderer.domElement)
camera.position.set(-(s*n)/2,(s*n)/2,-(s*n)/2)
camera.lookAt(s * n / 2, s * n / 2, s * n / 2)

let animate = function () {
	Monitor.begin();
	requestAnimationFrame(animate);
	UpdateFlyCam()
	renderer.render(scene, camera);
	Monitor.end();
};

animate();

let polys = {
    up: new THREE.PlaneGeometry(1, 1, 1), //+z
    down: new THREE.PlaneGeometry(1, 1, 1), //-z
    north: new THREE.PlaneGeometry(1, 1, 1), //+y
    south: new THREE.PlaneGeometry(1, 1, 1), //-y
    west:new THREE.PlaneGeometry(1, 1, 1),//+x
    east:new THREE.PlaneGeometry(1, 1, 1),//-x
}


var plane = new THREE.Mesh( polys.up, material );

