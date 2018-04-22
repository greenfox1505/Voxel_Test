let simplex = new (require('simplex-noise'))()
// debugger
let THREE = require('three');
let Chunk = require("./World/Chunk")

let FlyCam = require("./FlyCam.js")

let s = 16;
var material = new THREE.MeshNormalMaterial();


let Monitor = require("./Monitor.js");

let Surface = new (require("./World/WorldGens/Surface"))("helloWorld",16)


// function hChunk(args) {
// 	let loc = args.loc
// 	let blocks = []; for (let i = 0; i < (s * s * s); i++) { blocks[i] = 0 }
// 	// debugger
// 	for (let i = 0; i < s; i++) {
// 		for (let j = 0; j < s; j++) {
// 			let t = 32
// 			let h = (simplex.noise2D((i + loc.x*s)/t,(j + loc.y*s)/t) +1 )* (s/2) 
// 			for(let k =0; k < h ; k++){
// 				blocks[i + k*s + j*s*s ] = 1;

// 			}
// 		}
// 	}

// 	let c = new Chunk({
// 		blocks: blocks, size: s, material: new THREE.MeshNormalMaterial(),
// 	})
// 	c.mesh.position.x += args.loc.x * s
// 	c.mesh.position.z += args.loc.y * s
// 	return c;
// }


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var n = 6
let mat = new THREE.MeshNormalMaterial();
for (var z = 0; z < 5; z++) {
	for (var x = 0; x < 5; x++) {
		let blocks = Surface.generateChunk(x,0,z);
		let c = new Chunk({
			blocks:blocks ,
			size:16,
			material: mat,
			location: {x:x*s,y:0,z:z*s}
		})
		//hChunk({ loc: new THREE.Vector2(x, y) })
		scene.add(c.mesh)
	}
}

UpdateFlyCam = new FlyCam(camera, renderer.domElement)
camera.position.set(55,25,75)
camera.lookAt(0, 0, 0)

var animate = function () {
	Monitor.begin();
	requestAnimationFrame(animate);
	UpdateFlyCam()
	renderer.render(scene, camera);
	Monitor.end();
};

animate();



