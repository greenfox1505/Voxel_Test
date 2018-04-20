
let simplex = new (require('simplex-noise'))()
// debugger
let THREE = require('three');
let Chunk = require("./chunk.js")

let FlyCam = require("./FlyCam.js")

let s = 16;
var material = new THREE.MeshNormalMaterial();

/**
 * @param {int} s 
 * @returns {Chunk}
 */
function testBlockSize(s) {
	let blocks = []

	function indexToVector(index) {
		return new THREE.Vector3(
			index % s,
			((index / s) | 0) % s,
			((index / (s * s)) | 0) % s)

	}

	for (let i = 0; i < (s * s * s); i++) {
		let coord = indexToVector(i)
		if (coord.length() <= (s)) {
			blocks[i] = 1;
		}
		else {
			blocks[i] = 0
		}

	}
	return new Chunk({
		blocks: blocks, size: s, material: new THREE.MeshNormalMaterial(),
	});
}

function proceduralChunk(args) {
	let loc = args.loc
	let blocks = []; for (let i = 0; i < (s * s * s); i++) { blocks[i] = 0 }
	// debugger
	for (let i = 0; i < s; i++) {
		for (let j = 0; j < s; j++) {
			let t = 32
			let h = (simplex.noise2D((i + loc.x*s)/t,(j + loc.y*s)/t) +1 )* (s/2) 
			for(let k =0; k < h ; k++){
				blocks[i + k*s + j*s*s ] = 1;

			}
		}
	}

	let c = new Chunk({
		blocks: blocks, size: s, material: new THREE.MeshNormalMaterial(),
	})
	c.mesh.position.x += args.loc.x * s
	c.mesh.position.z += args.loc.y * s
	return c;
}

function hChunk(args) {
	let loc = args.loc
	let blocks = []; for (let i = 0; i < (s * s * s); i++) { blocks[i] = 0 }
	// debugger
	for (let i = 0; i < s; i++) {
		for (let j = 0; j < s; j++) {
			let h = ((Math.sin((j + (args.loc.y*s))/4  )+1)*(s/2)) | 0 
			for(let k =0; k < h ; k++){
				blocks[i + k*s + j*s*s ] = 1;

			}
		}
	}

	let c = new Chunk({
		blocks: blocks, size: s, material: new THREE.MeshNormalMaterial(),
	})
	c.mesh.position.x += args.loc.x * s
	c.mesh.position.z += args.loc.y * s
	return c;
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// let block = testBlockSize(s)
// scene.add(block.mesh)

var n = 6
for (var y = -4.5; y < 5; y++) {
	for (var x = -4.5; x < 4; x++) {
		let a = proceduralChunk({ loc: new THREE.Vector2(x, y) })
		scene.add(a.mesh)
	}
}

UpdateFlyCam = new FlyCam(camera, renderer.domElement)
camera.position.set(55,25,75)
camera.lookAt(0, 0, 0)

var animate = function () {
	requestAnimationFrame(animate);
	UpdateFlyCam()

	// cube.rotation.x += 0.03;
	// cube.rotation.y += 0.003;


	renderer.render(scene, camera);
};

animate();


// document.body.onkeydown = function (e) {
// 	if (e.key == "q") {
// 		s = s - 1
// 		cube.geometry = testBlockSize(s).geometry
// 	}
// 	if (e.key == "w") {
// 		s = s + 1
// 		cube.geometry = testBlockSize(s).geometry
// 	}
// 	camera.position.z = (s * 1.5)
// }



