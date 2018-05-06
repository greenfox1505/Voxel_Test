let THREE = require("three")

class WASD_Mouse {
	/**
	 * 
	 * @param {HTMLElement} dom 
	 * @param {THREE}
	 */
	constructor(dom) {
		this.dom = dom
		this.listners = []
		this.bound = this.controlCatch.bind(this)
		this.resetKeyState()
		this.dom.addEventListener("keydown", this.bound)
		this.dom.addEventListener("keyup", this.bound)
		this.dom.addEventListener("mousemove", this.bound)
		this.dom.addEventListener("click", this.bound)
	}
	resetKeyState() {
		this.keystate = {
			KeyW: 0,
			KeyA: 0,
			KeyS: 0,
			KeyD: 0,
			ShiftLeft: 0,
			Space:0,
			mouse: { x: 0, y: 0 }
		}
	}
	addListener(l) {
		this.listners.push(l)
		return this;
	}
	removeListener(l) {
		throw "TODO!"
	}
	tick(dT) {
		for (let i in this.listners) {
			this.listners[i](this.keystate, dT)
		}
		this.keystate.mouse = { x: 0, y: 0 }
	}
	controlCatch(e) {
		if (document.pointerLockElement == this.dom) {
			if (e.type == "mousemove") {
				this.keystate.mouse.x -= e.movementX
				this.keystate.mouse.y -= e.movementY
			}
			else if (e.type == "keydown" && this.keystate[e.code] != null) {
				this.keystate[e.code] = 1
			}
			else if (e.type == "keyup" && this.keystate[e.code] != null) {
				this.keystate[e.code] = 0
			}
			else {
				debugger
			}
		}
		if (e.type == "click") {
			//capture mouse
			if (document.pointerLockElement != this.dom) {
				this.dom.requestPointerLock()
				this.resetKeyState()
			}
			else {
				// debugger
			}
		}
	}
	distroy() {
		this.dom.removeEventListener("keydown", this.bound)
		this.dom.removeEventListener("keyup", this.bound)
		this.dom.removeEventListener("mousemove", this.bound)
		this.dom.removeEventListener("click", this.bound)
	}
	/**
	 * 
	 * @param {THREE.Object3D} object 
	 * @param {number} speed 
	 */
	static Fly(object, settings) {
		let v = new THREE.Vector3()
		let r = new THREE.Euler()
		r.order = "ZYX"
		let sprint = settings.sprint ? settings.sprint : 1
		return function (keyState, dt) {
			v.z = (keyState.KeyW - keyState.KeyS) * settings.speed * dt * (keyState.ShiftLeft ? sprint : 1)
			v.x = (keyState.KeyA - keyState.KeyD) * settings.speed * dt * (keyState.ShiftLeft ? sprint : 1)
			v.y = 0;
			r.x = THREE.Math.clamp(r.x + (keyState.mouse.y * settings.sensitivity), -Math.PI / 2, Math.PI / 2)
			r.y += keyState.mouse.x * settings.sensitivity
			object.setRotationFromEuler(r)

			v.applyEuler(r)
			object.position.sub(v)
		}
	}
}

module.exports = WASD_Mouse