let THREE = require("three")

let all = []

let container = document.createElement("div")
container.setAttribute("class", "info")
document.body.appendChild(container)

const down = new THREE.Vector3(0, -1, 0)
const forward = new THREE.Vector3(0, 0, 1)

class TrackObject {
	/**
	 * 
	 * @param {string} name 
	 * @param {THREE.Object3D} OBJ 
	 * @param {THREE.Scene} world 
	 */
	constructor(name, OBJ, world) {
		this.name = name
		this.obj = OBJ
		this.downRay = new THREE.Raycaster(OBJ.position, down )
		this.forRay = new THREE.Raycaster(OBJ.position )
		all.push(this)
		this.world = world
	}
	update() {
		let downObjs = this.downRay.intersectObjects(this.world.children,true)
		this.forRay.setFromCamera({x:0,y:0},this.obj);
		let forRay = 		this.forRay.intersectObjects(this.world.children,true)

//		let forwardObjs = 

		if(downObjs.length != 0 ){
			// debugger
		}
		return {
			name: this.name,
			pos: {
				x: this.obj.position.x | 0,
				y: this.obj.position.y | 0,
				z: this.obj.position.z | 0,
			},
			downRay:downObjs.length?downObjs[0].distance:null ,
			forRay:forRay.length?forRay[0].distance:null 
		}
	}
}

module.exports = TrackObject

function track() {
	if(document.debugger){
		debugger
		document.debugger = null
	}
	container.innerHTML = ""
	for (let i in all) {
		let out = "<p>" + JSON.stringify(all[i].update()) + "</p>"
		container.innerHTML = container.innerHTML + out

	}
	requestAnimationFrame(track)
}
requestAnimationFrame(track)
