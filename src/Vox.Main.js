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
	generator: (a)=>{
		return Solid.generateChunk(a)
	},
	chunkSize:s,

})

myWorld.createStartingArea()


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let mat = new THREE.MeshNormalMaterial();

scene.add(myWorld.ThreeObject)

// for (let z = 0; z < n; z++) {
// 	for (let x = 0; x < n; x++) {
// 		for (let y = 0; y < n; y++) {
// 			let blocks = Surface.generateChunk(x, y, z);
// 			let c = new Chunk({
// 				blocks: blocks,
// 				size: s,
// 				material: mat,
// 				cLoc: { x: x, y: y, z: z }
// 			})
// 			//hChunk({ loc: new THREE.Vector2(x, y) })
// 			scene.add(c.mesh)
// 		}
// 	}
// }

UpdateFlyCam = new FlyCam(camera, renderer.domElement)
camera.position.set(-s * n, s * n, -s * n)
camera.lookAt(s * n / 2, s * n / 2, s * n / 2)

let animate = function () {
	Monitor.begin();
	requestAnimationFrame(animate);
	UpdateFlyCam()
	renderer.render(scene, camera);
	Monitor.end();
};

animate();



