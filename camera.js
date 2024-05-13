import * as th from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ORBITAL_CAMERA_STARTING_POSITION = new th.Vector3(300,100,300);
const ORBITAL_CAMERA_STARTING_LOOK_AT = new th.Vector3(0,60,0);

let orbitControls = undefined;
let initialized = false;

const cameras = {
};
let selectedCamera = 0;

export function initCameras(camera, renderer) {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target = ORBITAL_CAMERA_STARTING_LOOK_AT;
    orbitControls.update();

    initialized = true;
    return orbitControls;
}

export function createCameraNumber(number, positionObject, targetObject, controls='fix') {
    cameras[number] = {
        position: positionObject,
        target: targetObject,
        controls: controls
    }
}

export function setCameraNumber(number, camera) {
    selectedCamera = number;
    if (!(number in cameras)) {
        return;
    }
    const newPos = new th.Vector3();
    cameras[selectedCamera].position.getWorldPosition(newPos);
    camera.position.set(...newPos);
    cameras[selectedCamera].target.getWorldPosition(newPos);
    camera.lookAt(newPos);
    if(cameras[selectedCamera].controls == 'orbital') {
        orbitControls.target = cameras[selectedCamera].target.position;
    }
    changeControlsTo(cameras[selectedCamera].controls);
}

function changeControlsTo(controls) {
    switch(controls) {
        case 'orbital':
            orbitControls.enabled = true;
            break;
        default:
            orbitControls.enabled = false;
            break;
    }
}

export function updateCamera(camera) {
    if (!initialized) {
        return;
    }
    orbitControls.update();
    if (selectedCamera in cameras) {
        if (cameras[selectedCamera].controls == 'attached') {
            const newPos = new th.Vector3();
            cameras[selectedCamera].position.getWorldPosition(newPos);
            camera.position.set(...newPos);
            cameras[selectedCamera].target.getWorldPosition(newPos);
            camera.lookAt(newPos);
        }
    }
    else {
        camera.position.set(...ORBITAL_CAMERA_STARTING_POSITION);
        camera.lookAt(ORBITAL_CAMERA_STARTING_LOOK_AT);
        changeControlsTo('fix');
    }
}

