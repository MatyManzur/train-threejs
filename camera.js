import * as th from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

const ORBITAL_CAMERA_STARTING_POSITION = new th.Vector3(300,100,300);
const ORBITAL_CAMERA_STARTING_LOOK_AT = new th.Vector3(0,60,0);

const FIRST_PERSON_CAMERA_SPEED = 1;
const FIRST_PERSON_CAMERA_HEIGHT = 66;

let orbitControls, firstPersonControls = undefined;
let initialized = false;

const cameras = {};
let selectedCamera = 0;

export function initCameras(camera, renderer) {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
    firstPersonControls.update(FIRST_PERSON_CAMERA_SPEED);

    initialized = true;
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
    const newTarget = new th.Vector3();
    cameras[selectedCamera].target.getWorldPosition(newTarget);
    camera.lookAt(newTarget);
    orbitControls.target = newTarget;
    firstPersonControls.target = newTarget;
    changeControlsTo(cameras[selectedCamera].controls);
}

function changeControlsTo(controls) {
    switch(controls) {
        case 'orbital':
            orbitControls.enabled = true;
            firstPersonControls.enabled = false;
            break;
        case 'firstPerson':
            firstPersonControls.enabled = true;
            orbitControls.enabled = false;
            break;
        default:
            orbitControls.enabled = false;
            firstPersonControls.enabled = false;
            break;
    }
}

export function updateCamera(camera) {
    if (!initialized) {
        return;
    }
    firstPersonControls.update(FIRST_PERSON_CAMERA_SPEED);
    if (selectedCamera in cameras) {
        if (cameras[selectedCamera].controls == 'attached') {
            const newPos = new th.Vector3();
            cameras[selectedCamera].position.getWorldPosition(newPos);
            camera.position.set(...newPos);
            cameras[selectedCamera].target.getWorldPosition(newPos);
            camera.lookAt(newPos);
        }
        if (cameras[selectedCamera].controls == 'firstPerson') {
            camera.position.setY(FIRST_PERSON_CAMERA_HEIGHT);
        }
    }
    else {
        camera.position.set(...ORBITAL_CAMERA_STARTING_POSITION);
        camera.lookAt(ORBITAL_CAMERA_STARTING_LOOK_AT);
        changeControlsTo('fix');
    }
}

