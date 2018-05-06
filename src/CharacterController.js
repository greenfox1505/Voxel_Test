
let THREE = require("three")
let world = require("./World/World")


class CharacterController {
    /**
     * 
     * @param {THREE.Object3D} object 
     * @param {VoxWorld} myVoxWorld 
     */
    constructor(object, myVoxWorld) {
        this.object = object;
        this.ThreeWorld = myVoxWorld.ThreeObject
        /**
         * @type {VoxWorld}
         */
        this.VoxWorld = myVoxWorld
    }
    createHandle(settings) {
        let v = new THREE.Vector3()
        let r = new THREE.Euler()
        let object = this.object
        r.order = "ZYX"
        let sprint = settings.sprint ? settings.sprint : 1

        let moveRay = new THREE.Raycaster(this.object.position, v, 0);

        let feetRay = new THREE.Raycaster(this.object.position, new THREE.Vector3(0, -1, 0), 0, 3);


        let that = this;

        let grav = new THREE.Vector3(0, -10, 0);
        let velocity = new THREE.Vector3(0, 0, 0);

        return function handle(keyState, dt) {
            if (settings.mode == "noclip") {
                //rotate camera
                r.x = THREE.Math.clamp(r.x + (keyState.mouse.y * settings.sensitivity), -Math.PI / 2, Math.PI / 2)
                r.y += keyState.mouse.x * settings.sensitivity
                object.setRotationFromEuler(r)

                //move intent
                v.z = -(keyState.KeyW - keyState.KeyS) * settings.speed * dt * (keyState.ShiftLeft ? sprint : 1)
                v.x = -(keyState.KeyA - keyState.KeyD) * settings.speed * dt * (keyState.ShiftLeft ? sprint : 1)
                v.y = 0;
                v.applyEuler(r)

                //move results
                object.position.add(v)

                return;
            }
            if (settings.mode == "fly") {
                //you can fly through corners with this. I should probably have some sort of recurisve machine...
                v.z = -(keyState.KeyW - keyState.KeyS) * settings.speed * dt * (keyState.ShiftLeft ? sprint : 1)
                v.x = -(keyState.KeyA - keyState.KeyD) * settings.speed * dt * (keyState.ShiftLeft ? sprint : 1)
                v.y = 0;
                r.x = THREE.Math.clamp(r.x + (keyState.mouse.y * settings.sensitivity), -Math.PI / 2, Math.PI / 2)
                r.y += keyState.mouse.x * settings.sensitivity
                v.applyEuler(r)

                moveRay.far = v.length() + 0.5;
                var a = moveRay.intersectObject(that.ThreeWorld, true)
                if (a.length != 0) {
                    // debugger
                    console.log(v)
                    let n = a[0].face.normal
                    // debugger                   v
                    let neg = v.clone().negate()

                    v = v.add(n.multiplyScalar(neg.dot(n)))
                    // v = v.multiplyScalar(v.dot(a[0].face.normal))//.divideScalar(v.length())
                }
                object.setRotationFromEuler(r)
                object.position.add(v)
                return;
            }
            if (settings.mode == "voxclip") {
                //rotate camera
                r.x = THREE.Math.clamp(r.x + (keyState.mouse.y * settings.sensitivity), -Math.PI / 2, Math.PI / 2)
                r.y += keyState.mouse.x * settings.sensitivity
                object.setRotationFromEuler(r)

                //move vector
                v.z = -(keyState.KeyW - keyState.KeyS) 
                v.x = -(keyState.KeyA - keyState.KeyD)
                v.y = 0;
                v.applyEuler(r);
                v.y = 0;
                v.normalize()
                v.multiplyScalar(settings.speed * dt * (keyState.ShiftLeft ? sprint : 1))


                ///get vertex pos
                let pos = that.object.position.clone()
                pos.addScalar(0.5)
                pos.floor()
                let feet = pos.clone(); feet.y =feet.y - 2
                
                let gt = grav.clone().multiplyScalar(dt)
                if(that.VoxWorld.GetVoxel(feet) == 0){
                    velocity.add(gt)
                }
                if(that.VoxWorld.GetVoxel(feet) != 0){
                    velocity.set(0,0,0);
                    velocity.sub(gt);                   
                }


                // if(that.VoxWorld.GetVoxel(feet) == undefined){
                //     debugger
                // }
                object.position.add(velocity)
                object.position.add(v)

                return
            }
            if (settings.mode == "dot") {
                let gt = grav.clone().multiplyScalar(dt);
                //shoot ray down
                let touching = feetRay.intersectObject(that.ThreeWorld, true)
                if (touching.length == 0) {
                    velocity = velocity.add(gt);
                }
                if (touching.length != 0) {
                    debugger
                    if (touching[0].distance < 2) {
                        velocity.y = 2 - touching[0].distance
                    }
                    else {
                        velocity = velocity.add(gt);
                        if (velocity.y > (2 - touching[0].distance)) {
                            velocity.y = 2 - touching[0].distance
                        }
                    }
                }
                //if ray is <0.5, resist movement
                //if ray is 1.5, push player to 2
                //if ray is >2, drop player
                // debugger
                object.position.add(velocity)
                console.log(velocity)
                return
            }

            throw "No CharacterController Mode Set!"
        }
    }

}

module.exports = CharacterController