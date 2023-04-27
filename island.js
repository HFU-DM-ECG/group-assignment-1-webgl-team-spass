import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;

var time = Date.now()/1000;

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0,1,1);
const camera = new THREE.PerspectiveCamera( FOV, window.innerWidth / window.innerHeight, near_plane, far_plane);

//light
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 3 );
scene.add( light )
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
directionalLight.castShadow = true;
scene.add( directionalLight );

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
var dom = renderer.domElement;
renderer.domElement = document.getElementById("c");
document.body.appendChild( dom );

const flyControls = new FlyControls(camera, dom);
flyControls.movementSpeed = 0.01;
flyControls.dragToLook = true;


camera.position.z = 5;
camera.position.y = 2;

//object loading
const island1 = new THREE.Object3D();
const island2 = new THREE.Object3D();
const island3 = new THREE.Object3D();
const airship = new THREE.Object3D();

const loader = new GLTFLoader();

var flyMode = false;

loader.load( 'assets/insel.glb', function ( gltf ) {

    island1.add(gltf.scene.children[0]);
    island1.name = "island1";
    scene.add(island1);

    island2.add(gltf.scene.children[0]);
    island2.name = "island2";
    scene.add(island2);

    island3.add(gltf.scene.children[0]);
    island3.name = "island3";
    scene.add(island3);
}, undefined, function ( error ) {

	console.error( error );

} );
loader.load( 'assets/airship.glb', function ( gltf ) {
    airship.add(gltf.scene.children[0]);
    airship.name = "airship";
    scene.add(airship);
    console.log(airship);
}, undefined, function ( error ) {

	console.error( error );
} );

function floating(object, floatingFrequency, amplitude, currentTime) {
    const scalingFactor = 1/1000;
    var midPosition = object.position.y;
    object.position.y = midPosition+(Math.sin(currentTime*floatingFrequency)*scalingFactor*amplitude);
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
function flyLoop(object, currentTime) {
    const scalingFactor = 1/1000;
    var midPositionx = -1.5;
    var midPositiony = 0;
    var midPositionz = 1.5;

    object.position.x = midPositionx + (Math.sin(currentTime)*scalingFactor*2);
    object.position.y = midPositiony + (Math.sin(currentTime)*scalingFactor*1);
    object.position.z = midPositionz + (Math.sin(currentTime)*scalingFactor*4);
}

function animate() {
    //Time management
    const currentTime = Date.now()/1000; //scaling to seconds
    const deltaTime = currentTime - time;
    time = currentTime;
    
    //Fly Control
    flyControls.update(1);

    //animation
    floating(island1,1,1,time);
    floating(island2,1.5,1,time);
    floating(island3,2.2,2,time);

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
        flyLoop(airship,time);
    }

    //Rendering
    renderer.outputEncoding = THREE.sRGBEncoding;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();