import * as th from 'three';
import { generateTerrain, generateWater } from './terrain';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { generateForest } from './tree';
import { generateRails } from './rails';

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

// Terreno y Lago
const terrain = await generateTerrain();
scene.add(terrain);
const water = await generateWater(42);
scene.add(water);

// Iluminación
const ambientLight = new th.AmbientLight('#ffffff', 1);
const directionaLight = new th.DirectionalLight('#ffffff', 1);
directionaLight.position.set(1000,1000,1000);
scene.add(directionaLight);
scene.add(ambientLight);

// TODO: borrar helpers
const axesHelper = new th.AxesHelper( 50 );
scene.add( axesHelper );

// Árboles
const forest_1 = await generateForest(60, 8);
forest_1.position.set(400,58,200);
scene.add(forest_1);
const forest_2 = await generateForest(100, 14);
forest_2.position.set(400,58,-100);
scene.add(forest_2);
const forest_3 = await generateForest(100, 12);
forest_3.position.set(100,58,400);
scene.add(forest_3);
const forest_4 = await generateForest(80, 12);
forest_4.position.set(-400,58,-100);
scene.add(forest_4);

const rails = new generateRails();
rails.position.set(0,56,0);
scene.add(rails);


// Render Loop
function animate() {
    requestAnimationFrame(animate);

    //...animations...
    controls.update();

    renderer.render(scene, camera);
}
animate();