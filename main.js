import * as th from 'three';
import { generateTerrain, generateWater } from './terrain';
import { generateForest } from './tree';
import { generateRails } from './rails';
import { animateTrain, generateTrain, toggleTrainLight } from './train';
import { generateBridge, generateTunnel } from './structures';
import { setupNaturalLights, setSunPosition, generateLampPost, toggleLampPostsLight, toggleSunShadows } from './lights';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { createCameraNumber, initCameras, setCameraNumber, updateCamera } from './camera';

const BASE_WATER_LEVEL = 42;

await new Promise(r => setTimeout(r, 2000));

// Scene setup
const scene = new th.Scene();
const camera = new th.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new th.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = th.PCFSoftShadowMap;

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

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
    lamp.position.set(position.x, 56.25, position.z);
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

// Sonido del tren
const listener = new th.AudioListener();
camera.add(listener);

const sound = new th.PositionalAudio(listener);
const audioLoader = new th.AudioLoader();
audioLoader.load('assets/train.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.autoplay = true;
    sound.setLoop(true);
    sound.playbackRate = 1;
    sound.setRefDistance(20);
    sound.play();
})

train.add(sound);


// Túnel
const tunnel = generateTunnel();
tunnel.rotateY(Math.PI/2);
tunnel.position.set(-60, 55, -360);
scene.add(tunnel);

const tunnelCamera = new th.Object3D();
tunnel.add(tunnelCamera);
tunnelCamera.position.set(5,30,-10);
const tunnelCameraTarget = new th.Object3D();
tunnelCameraTarget.position.set(-2,-2,10);
tunnelCamera.add(tunnelCameraTarget);
createCameraNumber(4, tunnelCamera, tunnelCameraTarget, 'fix');

// Puente
const bridge = generateBridge(80, 20, 40, 20, 5);
bridge.position.set(100,56,150);
scene.add(bridge);

const bridgeCamera = new th.Object3D();
bridge.add(bridgeCamera);
bridgeCamera.position.set(-10,15,-15);
const bridgeCameraTarget = new th.Object3D();
bridgeCameraTarget.position.set(10,-2,4);
bridgeCamera.add(bridgeCameraTarget);
createCameraNumber(5, bridgeCamera, bridgeCameraTarget, 'fix');

// Camaras
const camera_names = [  'Orbital', 'Locomotora Frontal', 'Locomotora Trasera', 'Locomotora', 
                        'Tunel', 'Puente', 'Espectador'];
let selected_camera = 0;
initCameras(camera, renderer);
const defaultCamera = new th.Object3D();
defaultCamera.position.set(300,100,300);
scene.add(defaultCamera);
const defaultCameraTarget = new th.Object3D();
defaultCameraTarget.position.set(0,60,0);
scene.add(defaultCameraTarget);
createCameraNumber(0, defaultCamera, defaultCameraTarget, 'orbital');
setCameraNumber(0, camera, renderer);
const spectatorCamera = new th.Object3D();
spectatorCamera.position.set(200,65,200);
scene.add(spectatorCamera);
const spectatorCameraTarget = new th.Object3D();
spectatorCameraTarget.position.set(-100,0,-100);
spectatorCamera.add(spectatorCameraTarget);
createCameraNumber(6, spectatorCamera, spectatorCameraTarget, 'firstPerson');

// GUI
const guiControls = {
    luz_del_tren: true,
    luz_de_faroles: true,
    velocidad_del_tren: 10,
    velocidad_del_dia: 1,
    nivel_del_agua: 0,
    sombras: true,
    camara: 'Orbital',
    volumen_sonido: 1,
}

let timeOfDay = 0;

function guiChanged() {
    toggleTrainLight(guiControls.luz_del_tren, guiControls.sombras);
    toggleSunShadows(guiControls.sombras);
    toggleLampPostsLight(guiControls.luz_de_faroles);
    water.position.setY(BASE_WATER_LEVEL+guiControls.nivel_del_agua);
    if(guiControls.camara !== camera_names[selected_camera]) {
        selected_camera = camera_names.indexOf(guiControls.camara);
        setCameraNumber(selected_camera, camera, renderer);
    }
    sound.setVolume(guiControls.volumen_sonido);
}

const gui = new GUI();
gui.add(guiControls, 'luz_del_tren').listen().onChange(guiChanged);
gui.add(guiControls, 'luz_de_faroles').listen().onChange(guiChanged);
gui.add(guiControls, 'velocidad_del_tren', -100, 100, 5).listen();
gui.add(guiControls, 'velocidad_del_dia', -5, 5, 0.25).listen();
gui.add(guiControls, 'nivel_del_agua', -40, 15, 1).onChange(guiChanged);
gui.add(guiControls, 'camara', camera_names).listen().onChange(guiChanged);
gui.add(guiControls, 'sombras').listen().onChange(guiChanged);
gui.add(guiControls, 'volumen_sonido', 0, 2, 0.1).listen().onChange(guiChanged);


guiChanged();

// Keyboard
function setupKeyControls() {
    document.onkeydown = (event) => {
        switch(event.key) {
            case "t":
                guiControls.luz_del_tren = !guiControls.luz_del_tren;
                guiChanged();
                break;
            case "l":
                guiControls.luz_de_faroles = !guiControls.luz_de_faroles;
                guiChanged();
                break;
            case "z":
                guiControls.velocidad_del_tren -= 5;
                guiChanged();
                break;
            case "x":
                guiControls.velocidad_del_tren += 5;
                guiChanged();
                break;
            case "j":
                guiControls.velocidad_del_dia -= 0.25;
                guiChanged();
                break;
            case "k":
                guiControls.velocidad_del_dia += 0.25;
                guiChanged();
                break;
            case "1": case "2": case "3": case "4": case "5": case "6": case "7":
                const selected = parseInt(event.key)-1;
                guiControls.camara = camera_names[selected];
                guiChanged();
                break;      
        }
    }
}

setupKeyControls();

// Render Loop
function animate() {
    requestAnimationFrame(animate);

    //...animations...
    timeOfDay += guiControls.velocidad_del_dia*0.1;
    setSunPosition(timeOfDay, (sun) => {
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
    });
    water.material.uniforms['time'].value += guiControls.velocidad_del_dia*0.01;
    animateTrain(guiControls.velocidad_del_tren, 65.2);
    if(Math.abs(guiControls.velocidad_del_tren) < 5) {
        sound.setPlaybackRate(0);
    }
    else {
        sound.setPlaybackRate(1);
    }
    updateCamera(camera);

    renderer.render(scene, camera);
}
animate();