let simplex = new (require('simplex-noise'))()
// debugger
let THREE = require('three');
let Chunk = require("./World/Chunk")

let WASD_Mouse = require("./WASD_Mouse")
// let FlyCam = require("./FlyCam.js")

let TrackObject = require("./TrackObject")

let s = 16;
let n = 8;



console.log("target block count:" + (Math.pow(s * n, 3)))


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

let wasd_mouse = new WASD_Mouse(document.body)
wasd_mouse.addListener(WASD_Mouse.Fly(camera, {
	speed: 0.01,
	sensitivity: 0.005,
	sprint: 5
}))

let renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


scene.add(myWorld.ThreeObject)


// UpdateFlyCam = FlyCam(camera, renderer.domElement)
new TrackObject("Camera", camera, scene)
camera.position.set(5.710485311777327, 47.89856260921998, 50.649956633218565)
camera.rotation.set(-0.6407963267948963, -0.7331853071796124, -3.7353756219504284e-17, "ZYX"
)

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



let animate = function () {
	Monitor.begin();
	requestAnimationFrame(animate);
	wasd_mouse.tick(16)
	// UpdateFlyCam()
	//light.position.z = Math.sin((x++) / 25) * 30 + 15
	renderer.render(scene, camera);
	Monitor.end();
};

animate();
