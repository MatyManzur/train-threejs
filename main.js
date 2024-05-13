import * as th from 'three';
import { generateTerrain, generateWater } from './terrain';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { generateForest } from './tree';
import { generateRails } from './rails';
import { animateTrain, generateTrain, toggleTrainLight } from './train';
import { generateBridge, generateTunnel } from './structures';
import { setupNaturalLights, setSunPosition, generateLampPost, toggleLampPostsLight } from './lights';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const CAMERA_STARTING_POSITION = new th.Vector3(320,70,200);
const CAMERA_STARTING_LOOK_AT = new th.Vector3(0,60,0);

// Scene setup
const scene = new th.Scene();
const camera = new th.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(...CAMERA_STARTING_POSITION);
camera.lookAt(CAMERA_STARTING_LOOK_AT);
const renderer = new th.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = CAMERA_STARTING_LOOK_AT;
controls.update();

// Terreno y Lago
const terrain = await generateTerrain();
scene.add(terrain);
const water = await generateWater(42);
scene.add(water);

// Iluminación
setupNaturalLights(renderer, scene);
const lampPositions = [ new th.Vector3(218,0,165),new th.Vector3(286,0,39),new th.Vector3(314,0,-171),
                        new th.Vector3(191,0,-281),new th.Vector3(74,0,-340),new th.Vector3(-75,0,-376),
                        new th.Vector3(-245,0,-154),new th.Vector3(-265,0,88),new th.Vector3(-71,0,174),
                        new th.Vector3(76,0,136)];
lampPositions.forEach((position) => {
    const lamp = generateLampPost();
    lamp.position.set(position.x, 56.5, position.z);
    scene.add(lamp);
});

// Árboles
const forest_1 = await generateForest(60, 8);
forest_1.position.set(400,58,200);
scene.add(forest_1);
const forest_2 = await generateForest(90, 14);
forest_2.position.set(400,58,-100);
scene.add(forest_2);
const forest_3 = await generateForest(100, 12);
forest_3.position.set(100,58,400);
scene.add(forest_3);
const forest_4 = await generateForest(80, 12);
forest_4.position.set(-400,58,-100);
scene.add(forest_4);
const forest_5 = await generateForest(80, 12);
forest_5.position.set(-150,58,80);
scene.add(forest_5);

// Vías
const rails = generateRails();
rails.position.set(0,56,0);
scene.add(rails);

// Tren
const train = generateTrain();
scene.add(train);

// Túnel
const tunnel = generateTunnel();
tunnel.rotateY(Math.PI/2);
tunnel.position.set(-60, 55, -360);
scene.add(tunnel);

// Puente
const bridge = generateBridge(80, 20, 40, 20, 5);
bridge.position.set(100,56,150);
scene.add(bridge);



// GUI
const guiControls = {
    luz_del_tren: true,
    luz_de_faroles: true,
    velocidad_del_tren: 10,
    velocidad_del_dia: 1,
}

let timeOfDay = 0;

function guiChanged() {
    toggleTrainLight(guiControls.luz_del_tren);
    toggleLampPostsLight(guiControls.luz_de_faroles);
}
const gui = new GUI();
gui.add(guiControls, 'luz_del_tren').onChange(guiChanged);
gui.add(guiControls, 'luz_de_faroles').onChange(guiChanged);
gui.add(guiControls, 'velocidad_del_tren', -100, 100, 5);
gui.add(guiControls, 'velocidad_del_dia', -5, 5, 0.25);
guiChanged();

// Render Loop
function animate() {
    requestAnimationFrame(animate);

    //...animations...
    timeOfDay += guiControls.velocidad_del_dia*0.1;
    setSunPosition(timeOfDay);
    animateTrain(guiControls.velocidad_del_tren, 64.7);
    controls.update();

    renderer.render(scene, camera);
}
animate();