let f = () => { console.timeEnd("Load To First Frame") }; console.time("Load To First Frame")

let THREE = require("three")

console.time("createSpawn")
let World = require("./World2/World")
let myWorld = new World({
	seed: "Test Args!"
})

myWorld.createSpawnPoint(4).then((e) => {
	console.timeEnd("createSpawn")
}).catch((e)=>{
debugger
})

let wasd_mouse = new (require("./WASD_Mouse"))(document.body)
let CharacterController = require("./CharacterController")


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



let pawn = new CharacterController(camera, myWorld)
wasd_mouse.addListener(pawn.createHandle({
	sprint: 5,
	speed: 8,
	sensitivity: 0.01,
	mode: "noclip"
}))



scene.add(myWorld.object)



var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// camera.position.z = 5;

// var animate = function () {
// 	requestAnimationFrame(animate);

// 	cube.rotation.x += 0.1;
// 	cube.rotation.y += 0.1;

// 	renderer.render(scene, camera);
// };

// animate();





let animate = function () {
	myWorld
	// debugger
	requestAnimationFrame(animate);
	wasd_mouse.tick(16 / 1000)
	// camera.position.copy(player.position);
	// camera.rotation.copy(player.rotation)
	// camera.lookAt(player.position);
	renderer.render(scene, camera);
	f(); f = () => { }
};

animate();
