import * as th from 'three';

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

    let displacement, grass, normal = undefined;
    
    await Promise.all(getTextures(['textures/heightmap.png', 'textures/grass.jpg', 'textures/normalmap.png']))
    .then( textures => {
        displacement = textures[0];
        grass = textures[1];
        normal = textures[2];
        grass.wrapS = grass.wrapT = th.RepeatWrapping;
        grass.repeat.set(64,64);
    })

    const groundMat = new th.MeshPhongMaterial ({
        map: grass,
        displacementMap: displacement,
        normalMap: normal,
        displacementScale: scale,
        shininess: 10,
    });

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

    const waterMat = new th.MeshPhongMaterial ({
        color: color,
        shininess: 100,
        opacity: 0.8,
        transparent: true,
        specular: '#ffffff',
    });

    let waterMesh = new th.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = waterLevel;
    return waterMesh;
}