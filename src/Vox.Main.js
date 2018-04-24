let simplex = new (require('simplex-noise'))()
// debugger
let THREE = require('three');
let Chunk = require("./World/Chunk")

let FlyCam = require("./FlyCam.js")

let s = 16;
let n = 8;



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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


scene.add(myWorld.ThreeObject)


UpdateFlyCam = new FlyCam(camera, renderer.domElement)
camera.position.copy( {x: 18, y: 45, z: 17})
camera.lookAt(s * n / 2, s * n / 2, s * n / 2)

var amb = new THREE.AmbientLight(0x404040); // soft white light
scene.add(amb);

var light = new THREE.PointLight( 0xFFD1B2, 1, 100 );
light.position.copy( {x: 18, y: 45, z: 17})	
light.castShadow = true;
scene.add( light );



let x = 0;
let animate = function () {
	Monitor.begin();
	requestAnimationFrame(animate);
	UpdateFlyCam()
	light.position.z = Math.sin((x++)/1000)*30 + 15
	renderer.render(scene, camera);
	Monitor.end();
};

animate();
