let THREE = require("three")
/**
 * 
 * @param {THREE.Camera} camera 
 * @param {HTMLElement} dom
 */
function FlyCam(camera, dom) {
	sensitivity = 0.005
	speed = 0.1
	let rX = 0;
	let rY = 0;
	dom.onclick = function () {
		if (document.pointerLockElement != dom) {
			dom.requestPointerLock()
		}
		else {
		}
	}

	let spike = {
		x: 10, y: 10
	}
	dom.onmousemove = function (e) {
		// debugger
		//"spike" this is a fix for this bug:
		//https://stackoverflow.com/questions/47985847/javascript-mouseevent-movementx-and-movementy-large-spikes
		if (Math.abs(Math.abs(e.movementX) - Math.abs(spike.x)) > (spike.x * 10)) {
			spike.x = Math.abs(e.movementX)
			console.log("SPIKE!")
			return
		}; if (e.movementX != 0) spike.x = Math.abs(e.movementX)
		// if(spike.y - e.movementY > (e.movementY * 0.5)){
		// 	console.log( "Mouse Spiked!")
		// }else(spike.y = e.movementY)

		if (document.pointerLockElement != dom) { return }
		rY -= (e.movementX * sensitivity)
		rX -= (e.movementY * sensitivity)
		camera.rotation.order = "ZYX"

		rX = THREE.Math.clamp(rX, -Math.PI / 2, Math.PI / 2)
		rY = (rY + (2 * Math.PI)) % (2 * Math.PI);
		let r = new THREE.Euler(rX, rY, 0)
		r.order = "ZYX"
		camera.quaternion.setFromEuler(r);
		// console.log(rY)

	}

	let MoveState = {
		KeyW: 0,
		KeyS: 0,
		KeyA: 0,
		KeyD: 0,
		KeyQ: 0,
		ShiftLeft: 0,
		Move: new THREE.Vector3()
	}

	document.body.onkeydown = function (e) {
		if (document.pointerLockElement != dom) { return }
		else if (MoveState[e.code] != null) {
			MoveState[e.code] = 1
		}
	}
	document.body.onkeyup = function (e) {
		if (document.pointerLockElement != dom) { return }
		else if (MoveState[e.code] != null) {
			MoveState[e.code] = 0
		}
	}

	// document.body.onkeydown = function (e) {
	// 	if (document.pointerLockElement != dom) { return }
	// 	else if (e.key == "w") {
	// 		move.z = -1
	// 	}
	// 	else if (e.key == "s") {
	// 		move.z = 1
	// 	}
	// 	else if (e.key == "a") {
	// 		move.x = -1
	// 	}
	// 	else if (e.key == "d") {
	// 		move.x = 1
	// 	}
	// 	else if (e.code == "ShiftLeft"){
	// 		speed = 0.1 * 10

	// 	}
	// }
	// document.body.onkeyup = function (e) {
	// 	if (document.pointerLockElement != dom) { return }
	// 	else if (e.key == "w") {
	// 		move.z = 0;
	// 	}
	// 	else if (e.key == "s") {
	// 		move.z = 0;
	// 	}
	// 	else if (e.key == "a") {
	// 		move.x = 0;
	// 	}
	// 	else if (e.key == "d") {
	// 		move.x = 0;
	// 	}
	// 	else if (e.code == "ShiftLeft"){
	// 		speed = 0.1
	// 	}
	// }


	return function () {
		var shiftSpeed = (MoveState.ShiftLeft?speed*10:speed)
		MoveState.Move.z = (MoveState.KeyS - MoveState.KeyW) * shiftSpeed
		MoveState.Move.x = (MoveState.KeyD - MoveState.KeyA) * shiftSpeed
		MoveState.Move.y = 0
		// debugger
		MoveState.Move.applyEuler(camera.rotation)
		camera.position.add(MoveState.Move)
	}
}

module.exports = FlyCam



