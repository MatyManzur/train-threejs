import * as th from 'three';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import FragmentShader from "./shaders/terrain_frag.glsl";
import VertexShader from "./shaders/terrain_vert.glsl";
import { Water } from "three/addons/objects/Water.js";
import { getTexture } from './texture';

function getTextures(textures) {
    const loader = new th.TextureLoader();
    return textures.map((source) => {
        return loader.load(source);
    });
}

/**
 * Genera el terreno con su forma según el heightmap
 * @param {number} size         Tamaño del terreno (lado del cuadrado)
 * @param {number} segments     Segmentos tomados del heightmap
 * @param {number} scale        Escala de variación de altura según heightmap
 * @returns {Promise<Object3D>} Promise del objeto terreno
 */
export async function generateTerrain(size=1024, segments=512, scale = 256) {
    const groundGeo = new th.PlaneGeometry(size, size, segments, segments);

    let displacement, grass, normal, snow, sand = undefined;
    
    await Promise.all(getTextures(['textures/heightmap.png', 'textures/grass.jpg', 'textures/normalmap.png', 'textures/snow.jpg', 'textures/sand.jpg']))
    .then( textures => {
        displacement = textures[0];
        grass = textures[1];
        normal = textures[2];
        snow = textures[3];
        sand = textures[4];
    });

    const groundMat = new CustomShaderMaterial({
        baseMaterial: th.MeshPhysicalMaterial,
        fragmentShader: FragmentShader,
        vertexShader: VertexShader,
        uniforms: {
            bottomTexture: {value: sand},
            middleTexture: {value: grass},
            topTexture: {value: snow},
            bottomTextureRepeat: {value: [64,64]},
            middleTextureRepeat: {value: [48,48]},
            topTextureRepeat: {value: [64,64]},
            bottomTextureEnd: {value: 0.19},
            middleTextureStart: {value: 0.2201},
            middleTextureEnd: {value: 0.4},
            topTextureStart: {value: 0.45},
        },
        displacementMap: displacement,
        normalMap: normal,
        displacementScale: scale,
        shininess: 10,
    })

    let groundMesh = new th.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    return groundMesh;
}

/**
 * Genera un plano de agua a un nivel indicado
 * @param {number} waterLevel   altura del nivel del agua
 * @param {string} color        color del material
 * @param {number} size         tamaño del plano
 * @returns {Promise<Object3D>} Promise del objeto agua
 */
export async function generateWater(waterLevel = 1, color = '#1b145c', size=1024) {
    const waterGeo = new th.PlaneGeometry(size, size);
    let waterNormals = undefined;
    await Promise.all(getTextures(['textures/waternormals.jpg']))
    .then((textures) => {
        waterNormals = textures[0];
        waterNormals.wrapS = waterNormals.wrapT = th.RepeatWrapping;
    })
    const waterMat = {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        sunDirection: new th.Vector3(),
		sunColor: 0xffffff,
        waterColor: color,
        distortionScale: 1,
    };
    const waterMat2 = new th.MeshPhongMaterial ({
        color: color,
        shininess: 100,
        opacity: 0.8,
        transparent: true,
        specular: '#ffffff',
    });

    let waterMesh = new Water(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = waterLevel;
    return waterMesh;
}