import * as th from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const treeTrunkMaterial = new th.MeshPhongMaterial(
    {   
        color: '#3d2116',
        shininess: 0
    }
)
const treeLeavesMaterial = new th.MeshPhongMaterial(
    {
        color: '#669739',
        shininess: 10,
    }
)

function getTreeModel(model) {
    const loader = new GLTFLoader();
    const obj = new Promise((resolve) => {
        loader.load(model, (object) => {
            object.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true; 
                    switch(child.name) {
                        case "Cylinder":
                            child.material = treeTrunkMaterial;
                            break;
                        case "Icosphere":
                            child.material = treeLeavesMaterial;
                            break;
                    }
                }
            })
            resolve(object.scene);
        }, undefined, (error) => {
            console.error(error);
        })
    });
    return obj;
}

/**
 * Genera un árbol con las dimensiones indicadas
 * @param {number} width        ancho del arbol
 * @param {number} height       alto del arbol
 * @param {number} rotation     rotacion del arbol
 * @returns {Promise<Object3D>} el objeto arbol
 */
export async function generateTree(width = 1, height= 1.2, rotation = 0) {
    const object = await getTreeModel("./models/tree/tree.gltf");
    object.rotation.y = rotation;
    object.scale.set(width, height, width);
    return object;
}

function getRandomFloat(max) {
    return (Math.random() * max);
}

/**
 * Genera un grupo de arboles con disposición aleatoria dentro de un circulo
 * @param {number} radius           el radio del circulo donde generar los arboles
 * @param {number} trees            cantidad de arboles
 * @param {number} minSize          limite inferior para el tamaño de los arboles
 * @param {number} maxSize          limite superior para el tamaño de los arboles
 * @param {boolean} drawHelper      si se debe mostrar un helper del circulo
 * @returns {Promise<Group>}        el grupo que contiene a los arboles
 */
export async function generateForest(radius = 100, trees = 8, minSize = 0.8, maxSize = 1.3, drawHelper = false) {
    const group = new th.Group();
    for(let i = 0;i<trees;i++) {
        const size = minSize + getRandomFloat(maxSize - minSize);
        const tree = await generateTree(size, size, getRandomFloat(2*Math.PI));
        const ro = getRandomFloat(radius);
        const tita = getRandomFloat(2*Math.PI);
        tree.position.set(ro*Math.sin(tita), 0, ro*Math.cos(tita));
        group.add(tree);
    }
    if(drawHelper) {
        const helper = new th.PolarGridHelper(radius, 1,6,36, '#ffffff');
        group.add(helper);
    }
    return group;
}

