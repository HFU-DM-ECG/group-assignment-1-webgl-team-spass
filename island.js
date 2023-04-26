import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const FOV = 75;
const near_plane = 0.1;
const far_plane = 1000;

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
camera.rotateX(-0.1)

//object loading
var island1;
var island2;
var island3;
var airship;

const loader = new GLTFLoader();

loader.load( 'assets/insel.glb', function ( gltf ) {
	scene.add( gltf.scene );
    island1 = gltf.scene.children[0];
    island2 = gltf.scene.children[1];
    island3 = gltf.scene.children[2];
    console.log(island1);

}, undefined, function ( error ) {

	console.error( error );

} );
loader.load( 'assets/airship.glb', function ( gltf ) {
	scene.add( gltf.scene );
    airship = gltf.scene.children[0];
    console.log(airship);

}, undefined, function ( error ) {

	console.error( error );
} );

function animate() {
    flyControls.update(1);
    renderer.outputEncoding = THREE.sRGBEncoding;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();