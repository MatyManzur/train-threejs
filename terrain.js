import * as th from 'three';

function getTextures(textures) {
    const loader = new th.TextureLoader();
    return textures.map(source => {
        return new Promise((resolve, reject) => {
            loader.load(
                source,
                texture => resolve(texture),
                undefined, 
                err => reject(err)
            )
        })
    });
}

export async function generateTerrain(size=1024, segments=512, scale = 256) {
    const groundGeo = new th.PlaneGeometry(size, size, segments, segments);

    let displacement, grass = undefined;
    
    await Promise.all(getTextures(['textures/heightmap.png', 'textures/grass.png']))
    .then( textures => {
        displacement = textures[0];
        grass = textures[1];
        grass.wrapS = grass.wrapT = th.RepeatWrapping;
        grass.repeat.set(16,16);
    })

    const groundMat = new th.MeshPhongMaterial ({
        map: grass,
        displacementMap: displacement,
        displacementScale: scale,
    });

    let groundMesh = new th.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    return groundMesh;
}

export async function generateWater(waterLevel = 1, color = '#1b145c', size=1024) {
    const waterGeo = new th.PlaneGeometry(size, size);

    const waterMat = new th.MeshPhongMaterial ({
        color: color,
    });

    let waterMesh = new th.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = waterLevel;
    return waterMesh;
}