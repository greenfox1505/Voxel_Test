let THREE = require('three');
let Chunk = require("./chunk.js")

let FlyCam = require("./FlyCam.js")

let s = 16;
var material = new THREE.MeshNormalMaterial();

/**
 * 
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

	return new Chunk(blocks, s, material);
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let n = 5
for (let i = 0; i < n; i++) {
	for (let j = 0; j < n; j++) {
		for (let k = 0; k < n; k++) {
			let block = testBlockSize(s)
			block.mesh.position.x = s * i
			block.mesh.position.z = s * j
			block.mesh.position.y = s * k
			scene.add(block.mesh)
		}
	}
}
camera.position.z = (s * 1.5)

UpdateFlyCam = new FlyCam(camera, renderer.domElement)

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



