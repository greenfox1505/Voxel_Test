console.time("FirstFrame"); let f = () => { console.timeEnd("FirstFrame") }


let simplex = new (require('simplex-noise'))()
// debugger
let THREE = require('three');
let Chunk = require("./World/Chunk")

let WASD_Mouse = require("./WASD_Mouse")
let CharacterController = require("./CharacterController")

//let TrackObject = require("./TrackObject")

let size = 16;
let cunksCubed = 8;



console.log("target block count:" + (Math.pow(size * cunksCubed, 3)))


let Monitor = require("./Monitor.js");

let Solid = new (require("./World/WorldGens/Solid"))("helloworld", size)

let myWorld = new (require("./World/World"))({
	generator: function (a) {
		return Solid.generateChunk(a)
	},
	chunkSize: size,
})

myWorld.createStartingArea(cunksCubed)


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// let wasd_mouse = new WASD_Mouse(document.body)
// wasd_mouse.addListener(WASD_Mouse.Fly(camera, {
// 	speed: 0.01,
// 	sensitivity: 0.005,
// 	sprint: 5
// }))

let renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


scene.add(myWorld.ThreeObject)


// UpdateFlyCam = FlyCam(camera, renderer.domElement)
// new TrackObject("Camera", camera, scene)
camera.position.set(28, 46, 21)

var amb = new THREE.AmbientLight(0x404040); // soft white light
scene.add(amb);

var lightColor = 0xFFD1B2

var light = new THREE.PointLight(lightColor, 1, 100);
light.position.copy({ x: 18, y: 45, z: 17 })
light.castShadow = true;
scene.add(light);

let ball = new THREE.SphereGeometry(0.25, 16, 8)
let colorMat = new THREE.MeshBasicMaterial({ color: lightColor })
let lightbulb = new THREE.Mesh(ball, colorMat)
light.add(lightbulb)

let x = 0;

let boxShape = new THREE.CubeGeometry(1, 2, 1);
let playerMat = new THREE.MeshBasicMaterial({ color: 0x0000FF })
let player = new THREE.Mesh(boxShape, playerMat)
scene.add(player)
player.position.copy({ x: 11, y: 45, z: 25 })


let wasd_mouse = new WASD_Mouse(document.body)
// wasd_mouse.addListener(WASD_Mouse.Fly(player, {
// 	sprint: 5,
// 	speed: 1,
// 	sensitivity: 0.01
// }))

let pawn = new CharacterController(player, myWorld)
wasd_mouse.addListener(pawn.createHandle({
	sprint: 5,
	speed: 8,
	
	sensitivity: 0.01,
	mode: "noclip"
}))

let animate = function () {
	f(); f = () => { }

	Monitor.begin();
	requestAnimationFrame(animate);
	wasd_mouse.tick(16 / 1000)
	camera.position.copy(player.position);
	camera.rotation.copy(player.rotation)
	// camera.lookAt(player.position);
	renderer.render(scene, camera);
	Monitor.end();
};

animate();
