import * as th from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { getTexture, getMaterialFromTextureFolder, resetUVs } from './texture';

export const offLightMaterial = new th.MeshPhongMaterial({
    color: '#668186',
    transparent: true,
    opacity: 0.80,
    shininess: 100,
});

export const onLightMaterial = new th.MeshPhongMaterial({
    emissive: '#fffc39',
    color: '#ffffff',
});

const lampMaterial = getMaterialFromTextureFolder('metal', .1, .1, 0, 1, true);
const lampDetailMaterial = getMaterialFromTextureFolder('metal', .1, .1, 0, 1, true, '#b6b6b6');

const SHADOW_RESOLUTION = 4096;

const sunLightColorGradient = [ '#2f0f00', '#752901', '#b24502', '#e76104', '#fa8120', 
                        '#fa9d48', '#fbb46a', '#fbc687', '#fcd59f', '#fde0b2', 
                        '#fde8c2', '#fdefcf', '#fef4da', '#fef7e2', '#fef9e8',
                        '#fffbec', '#fffcef', '#fffdf1', '#fffef3', '#fffef4'].reverse();
const MAX_ANGLE = 92;
const angleSteps = MAX_ANGLE / sunLightColorGradient.length;

const SUN_AZIMUTH = 235;
const AMBIENT_LIGHT_INTENSITY = 2;
const DIRECTIONAL_LIGHT_INTENSITY = 6;

const LAMP_BASE_DIAMETER = 2;
const LAMP_POST_DIAMETER = 0.5;
const LAMP_TOP_DIAMETER = 2;
const LAMP_POST_INTENSITY = 80;

let sky, sun, ambientLight, directionaLight;

/**
 * Agrega el skybox con luz natural, un sol que rota alrededor de la escena,
 * una luz ambiental tenue y una luz direccional.
 * La luz direccional se mueve con el sol y cambia su tonalidad según el 
 * momento del día.
 * @param {Renderer} renderer       renderer de la escena
 * @param {Scene} scene             objeto escena
 */
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
    directionaLight.castShadow = true;
    directionaLight.shadow.mapSize.width = SHADOW_RESOLUTION;
    directionaLight.shadow.mapSize.height = SHADOW_RESOLUTION;
    directionaLight.shadow.camera.near = 400;
    directionaLight.shadow.camera.far = 1600;
    directionaLight.shadow.camera.top = 500;
    directionaLight.shadow.camera.bottom = -500;
    directionaLight.shadow.camera.left = 600;
    directionaLight.shadow.camera.right = -600;
    scene.add(directionaLight);
    scene.add(ambientLight);
    setSunPosition(0);
}

/**
 * Establece la posición del sol en un ángulo determinado
 * @param {number} angle    ángulo del sol entre 0 y 360, siendo 0 el mediodía
 */
export function setSunPosition(angle, onNewSunPosition = (sun) => {}) {
    angle %= 360;
    let phi = th.MathUtils.degToRad( angle );
    const theta = th.MathUtils.degToRad( SUN_AZIMUTH );
    sun.setFromSphericalCoords( 1, phi, theta );
    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    onNewSunPosition(sun);
    directionaLight.position.setFromSphericalCoords(1000, phi, theta);
    if (angle < MAX_ANGLE) {
        directionaLight.visible = true;
        directionaLight.color.set(sunLightColorGradient[Math.floor(angle/angleSteps)]);
    }
    else if (angle > 360-MAX_ANGLE) {
        directionaLight.visible = true;
        directionaLight.color.set(sunLightColorGradient[Math.floor((360-angle)/angleSteps)]);
    }
    else {
        directionaLight.visible = false;
    }
}

const lampPostLights = [];

/**
 * Genera un farol que emite luz si está prendido
 * @param {number} height   altura del farol
 * @returns {Object}        objeto farol
 */
export function generateLampPost(height=18) {
    const lamp = new th.Group();
    const base = new th.Mesh(
        new th.CylinderGeometry(0.8*LAMP_BASE_DIAMETER/2, LAMP_BASE_DIAMETER/2, height*0.1),
        lampDetailMaterial
    );
    base.position.setY(height*0.05);
    lamp.add(base);
    const post = new th.Mesh(
        new th.CylinderGeometry(LAMP_POST_DIAMETER/2, LAMP_POST_DIAMETER/2, height*0.8),
        lampMaterial
    );
    post.position.setY(height*0.5);
    lamp.add(post);
    const lightBase = new th.Mesh(
        new th.CylinderGeometry(0.6*LAMP_TOP_DIAMETER/2, 0.4*LAMP_TOP_DIAMETER/2, height*0.04),
        lampDetailMaterial
    );
    lightBase.position.setY(height*0.92);
    lamp.add(lightBase);
    const light = new th.Mesh(
        new th.CylinderGeometry(0.8*LAMP_TOP_DIAMETER/2, 0.6*LAMP_TOP_DIAMETER/2, height*0.06),
        onLightMaterial
    )
    light.position.setY(height*0.95);
    lamp.add(light);
    const top = new th.Mesh(
        new th.CylinderGeometry(0.9*LAMP_TOP_DIAMETER/2, 0.8*LAMP_TOP_DIAMETER/2, height*0.02),
        lampDetailMaterial
    )
    top.position.setY(height*0.98);
    lamp.add(top);

    const pointLight = new th.PointLight(0xffffff, LAMP_POST_INTENSITY, 0, 1);
    //pointLight.castShadow = true; // se laguea bastante
    light.add(pointLight);

    lampPostLights.push(light);

    lamp.traverse((child) => {
        if(child.isMesh) {
            resetUVs(child);
            child.castShadow = true;
        }
    })
    return lamp;
}

/**
 * Prende o apaga la luz de todos los faroles generados
 * @param {boolean} lightOn     true = prender; false = apagar
 */
export function toggleLampPostsLight(lightOn) {
    if(lightOn) {
        lampPostLights.forEach((light) => {
            light.children[0].intensity = LAMP_POST_INTENSITY;
            light.material = onLightMaterial;
        });
    }
    else {
        lampPostLights.forEach((light) => {
            light.children[0].intensity = 0;
            light.material = offLightMaterial;
        });
    }
}

/**
 * Activa o desactiva las sombras causadas por el sol
 * @param {boolean} shadows     si el sol castea sombras
 */
export function toggleSunShadows(shadows) {
    directionaLight.castShadow = shadows;
}
