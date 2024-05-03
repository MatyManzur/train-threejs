import * as th from 'three';
import { generateTerrain, generateWater } from './terrain';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { generateForest } from './tree';

const CAMERA_STARTING_POSITION = new th.Vector3(200,200,400);

// Scene setup
const scene = new th.Scene();
const camera = new th.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(...CAMERA_STARTING_POSITION);
camera.lookAt(scene.position);
const renderer = new th.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Terrain
const terrain = await generateTerrain();
scene.add(terrain);
const water = await generateWater(42);
scene.add(water);

// Lights
const ambientLight = new th.AmbientLight('#ffffff', 1);
const directionaLight = new th.DirectionalLight('#ffffff', 1);
directionaLight.position.set(1000,1000,1000);
scene.add(directionaLight);
scene.add(ambientLight);

// TODO: borrar helpers
const axesHelper = new th.AxesHelper( 50 );
scene.add( axesHelper );

const forest = await generateForest(100, 24, true);
forest.position.set(320,58,200);
scene.add(forest);


// Render Loop
function animate() {
    requestAnimationFrame(animate);

    //...animations...
    controls.update();

    renderer.render(scene, camera);
}
animate();