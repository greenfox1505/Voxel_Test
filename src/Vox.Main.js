let simplex = new (require('simplex-noise'))()
// debugger
let THREE = require('three');
let Chunk = require("./World/Chunk")

let FlyCam = require("./FlyCam.js")

let s = 16;
var material = new THREE.MeshNormalMaterial();


let Monitor = require("./Monitor.js");

let Surface = new (require("./World/WorldGens/Solid"))(null, 16)


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var n = 5	
let mat = new THREE.MeshNormalMaterial();
for (var z = 0; z < n; z++) {
	for (var x = 0; x < n; x++) {
		for (var y = -1; y <= 1; y++) {
			let blocks = Surface.generateChunk(x, y, z);
			let c = new Chunk({
				blocks: blocks,
				size: 16,
				material: mat,
				location: { x: x * s, y: y*s, z: z * s }
			})
			//hChunk({ loc: new THREE.Vector2(x, y) })
			scene.add(c.mesh)
		}
	}
}

UpdateFlyCam = new FlyCam(camera, renderer.domElement)
camera.position.set(0,32,0)
let p  =Math.pow(s,n/2)
camera.lookAt(p, 0, p)

var animate = function () {
	Monitor.begin();
	requestAnimationFrame(animate);
	UpdateFlyCam()
	renderer.render(scene, camera);
	Monitor.end();
};

animate();



