let THREE = require('three');
let Chunk = require("./chunk.js")


let s = 16;
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

	let myChunk = new Chunk(blocks, s)
	return myChunk;
}
let myChunk = testBlockSize(s)

console.log(myChunk)

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// var geometry = new THREE.BoxGeometry(1, 1, 1);
var geometry = myChunk.geometry
var material = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = (s*1.5)

var animate = function () {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.03;
	cube.rotation.y += 0.003;


	renderer.render(scene, camera);
};

animate();


document.body.onkeydown = function (e) {
	if(e.key == "q"){
		s = s - 1
		cube.geometry = testBlockSize(s).geometry
	}
	if(e.key == "w"){
		s = s + 1
		cube.geometry = testBlockSize(s).geometry
	}
	camera.position.z = (s*1.5)
}

