import * as th from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

export const offLightMaterial = new th.MeshPhongMaterial({
    color: '#668186'
});

export const onLightMaterial = new th.MeshPhongMaterial({
    color: '#fffc39'
});

const sunLightColorGradient = [ '#2f0f00', '#752901', '#b24502', '#e76104', '#fa8120', 
                        '#fa9d48', '#fbb46a', '#fbc687', '#fcd59f', '#fde0b2', 
                        '#fde8c2', '#fdefcf', '#fef4da', '#fef7e2', '#fef9e8',
                        '#fffbec', '#fffcef', '#fffdf1', '#fffef3', '#fffef4'].reverse();
const MAX_ANGLE = 100;
const angleSteps = MAX_ANGLE / sunLightColorGradient.length;

const SUN_AZIMUTH = 270;
const AMBIENT_LIGHT_INTENSITY = 2;
const DIRECTIONAL_LIGHT_INTENSITY = 6;

let sky, sun, ambientLight, directionaLight;


export function setupNaturalLights(renderer, scene) {
    sky = new Sky();
    sky.scale.setScalar(100000);
    sun = new th.Vector3();
    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = 10;
    uniforms[ 'rayleigh' ].value = 3;
    uniforms[ 'mieCoefficient' ].value = 0.005;
    uniforms[ 'mieDirectionalG' ].value = 0.7;
    renderer.toneMapping = th.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.2;
    
    scene.add(sky);

    ambientLight = new th.AmbientLight('#c0bbff', AMBIENT_LIGHT_INTENSITY);
    directionaLight = new th.DirectionalLight('#ffffff', DIRECTIONAL_LIGHT_INTENSITY);
    scene.add(directionaLight);
    scene.add(ambientLight);
    setSunPosition(0);
}

export function setSunPosition(angle) {
    angle %= 360;
    let phi = th.MathUtils.degToRad( angle );
    const theta = th.MathUtils.degToRad( SUN_AZIMUTH );
    sun.setFromSphericalCoords( 1, phi, theta );
    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    directionaLight.position.setFromSphericalCoords(1000, phi, theta);
    if (angle < MAX_ANGLE) {
        directionaLight.color.set(sunLightColorGradient[Math.floor(angle/angleSteps)]);
    }
    if (angle > 360-MAX_ANGLE) {
        directionaLight.color.set(sunLightColorGradient[Math.floor((360-angle)/angleSteps)]);
    }
}
