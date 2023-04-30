import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;

var time = Date.now()/1000;

//scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near_plane, far_plane);

//background
const backgroundLoader = new THREE.TextureLoader();
backgroundLoader.load('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg', function(texture) {
    scene.background = texture;
});

//light
///light from the sky
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemisphereLight.color.setHSL(0.6, 1, 0.6);
hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
hemisphereLight.position.set(0, 10, 0);
scene.add(hemisphereLight)
const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
hemiLightHelper.visible = true;
scene.add(hemiLightHelper);

///light from the sun
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.color.setHSL(0.1, 1, 0.95);
directionalLight.position.set(0, 10, -0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 2048
///shadows from the sun
const shadowValue = 30
directionalLight.shadow.camera.left = -shadowValue;
directionalLight.shadow.camera.right = shadowValue;
directionalLight.shadow.camera.top = shadowValue;
directionalLight.shadow.camera.bottom = -shadowValue;
directionalLight.shadow.camera.far = 3500;
directionalLight.shadow.bias = -0.000001;
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
directionalLightHelper.visible = true;
scene.add(directionalLightHelper);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var dom = renderer.domElement;
renderer.domElement = document.getElementById("c");
document.body.appendChild(dom);

const flyControls = new FlyControls(camera, dom);
flyControls.movementSpeed = 0.01;
flyControls.dragToLook = true;


camera.position.z = 10;
camera.position.y = 5;

//object loading
const island1 = new THREE.Object3D();
const island2 = new THREE.Object3D();
const island3 = new THREE.Object3D();
const airship = new THREE.Object3D();

const loader = new GLTFLoader();

var flyMode = false;

loader.load('models/insel.glb', function (gltf) {

    island1.add(gltf.scene.children[0]);
    island1.children[0].children[0].castShadow = true;
    island1.children[0].children[0].receiveShadow = true;
    island1.name = "island1";
    scene.add(island1);

    island2.add(gltf.scene.children[0]);
    island2.children[0].children[0].castShadow = true;
    island2.children[0].children[0].receiveShadow = true;
    island2.name = "island2";
    scene.add(island2);

    island3.add(gltf.scene.children[0]);
    island3.children[0].children[0].castShadow = true;
    island3.children[0].children[0].receiveShadow = true;
    island3.name = "island3";
    scene.add(island3);
    island1.scale.set(3, 3, 3);
    island2.scale.set(3, 3, 3);
    island3.scale.set(3, 3, 3);
}, undefined, function (error) {

	console.error(error);

} );
loader.load('models/airship.glb', function (gltf) {
    airship.add(gltf.scene.children[0]);
    airship.name = "airship";
    airship.children[0].children[0].castShadow = true;
    airship.children[0].children[0].receiveShadow = true;
    scene.add(airship);
    airship.scale.set(2, 2, 2);
    airship.rotateY(1.49);
}, undefined, function (error) {

	console.error(error);
});

function floating(object, floatingFrequency, amplitude, currentTime) {
    const scalingFactor = 1/1000;
    var midPosition = object.position.y;
    object.position.y = midPosition+(Math.sin(currentTime*floatingFrequency)*scalingFactor*amplitude);
}

function sunCycle(object, floatingFrequency, amplitude, currentTime) {
    const scalingFactor = 1/750;
    var positionX = object.position.x;
    var positionY = object.position.y;
    var positionZ = object.position.z;
    object.position.x = positionX+(Math.sin(currentTime*floatingFrequency)*scalingFactor*amplitude);
    object.position.y = positionY+(Math.sin(currentTime*floatingFrequency)*scalingFactor*amplitude); // TODO: Fix
    object.position.z = positionZ+(Math.cos(currentTime*floatingFrequency)*scalingFactor*amplitude);
}

function fly(object) {
    const offsetVector = new THREE.Vector3(-0.1,-0.6,-0.1);
    offsetVector.applyQuaternion(camera.quaternion);
    object.position.x = camera.position.x +offsetVector.x;
    object.position.y = camera.position.y +offsetVector.y;
    object.position.z = camera.position.z +offsetVector.z;
    object.quaternion.y = camera.quaternion.y;
    object.setRotationFromQuaternion(camera.quaternion);
}
function flyLoopBezier(object, currentTime) {
    const bezierPath = new THREE.CubicBezierCurve(
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(1,0,1),
        new THREE.Vector3(1,0,-1),
        new THREE.Vector3(-1,0,1),
        new THREE.Vector3(0,1,1),
    )
}
function flyLoop(object, midPosition, currentTime, timescale, x_amp, y_amp,z_amp) {
    if (Math.sin(currentTime*timescale/2)>0){
        const oldPosition = new THREE.Vector3(object.position.x,object.position.y,object.position.z);
    
        object.position.x = midPosition.x+Math.sin(currentTime*timescale)*x_amp;
        object.position.y = midPosition.y+Math.cos(currentTime*timescale)*y_amp;
        object.position.z = midPosition.z+Math.cos(currentTime*timescale)*z_amp-z_amp;
    
        object.lookAt(oldPosition);
    } else {        
        object.position.x = midPosition.x+Math.sin(0)*x_amp;
        object.position.y = midPosition.y+Math.cos(0)*y_amp;
        object.position.z = midPosition.z+Math.cos(0)*z_amp-z_amp;
    }
}


function animate() {
    //time management
    const currentTime = Date.now()/1000; //scaling to seconds
    // const deltaTime = currentTime - time;
    time = currentTime;
    
    //Fly Control
    flyControls.update(1);

    //animation
    floating(island1,1,1,time);
    floating(island2,1.5,1,time);
    floating(island3,2.2,2,time);
    sunCycle(directionalLight, 1, 45, time);

    //toggle mode
    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 32) {
            flyMode = !flyMode;
        }
    }
    if (flyMode) {
        //fly-mode
        fly(airship);
    } else {
        //loop animation
        flyLoop(airship, new THREE.Vector3(-1.5,-.1,1.55) ,time, .5, 2.5, .5, 2);
    }

    //Rendering
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
	requestAnimationFrame(animate) ;
	renderer.render(scene, camera);
}
animate();