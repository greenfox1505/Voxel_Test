let mcTest = require("./testMesh")


var THREE = require("three")

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let objList = []
let sep = 3
for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
        let myObj = mcTest.mcVis(y * 16 + x)
        objList[y * 16 + x] = myObj
        myObj.position.set(x * sep, -y * sep, 0).sub({ x: sep * 7.5, y: 0, z: 0 }).add({ x: 0, y: sep * 7.5, z: 0 })
        scene.add(myObj)
    }
}

let rSpeed = 0;
document.body.onkeydown = function (e) {
    if (e.code == "Space") {
        rSpeed = rSpeed ? 0 : 0.01
    }
}

let zoom = false
document.body.onclick = function () {
    zoom = zoom ? false : true
}


let dis = new THREE.Vector2()
document.body.onmousemove = function (e) {
    // console.log(e)
    dis.copy({
        x: e.screenX / window.innerWidth,
        y: e.screenY / window.innerHeight
    })
}

let animate = function () {
    requestAnimationFrame(animate);
    // mc.rotation.y += 0.01;
    objList.map((e) => {
        e.rotation.y += rSpeed;
    })
    if (zoom) {
        var z = 64
        camera.position.copy(
            {
                x: (dis.x * z) - (z / 2),
                y: (-dis.y * z) + (z / 2),
                z: 5
            }
        )

    }
    else {
        camera.position.copy({ x: 0, y: 0, z: 35 })
    }


    renderer.render(scene, camera);
};

animate();



