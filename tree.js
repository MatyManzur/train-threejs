import * as th from 'three';
import { getMaterialFromTextureFolder } from './texture';

const treeTrunkMaterial = getMaterialFromTextureFolder('leaves', 2, 2, 0, 6);

const treeLeavesMaterial = getMaterialFromTextureFolder('leaves', 8, 4, 0, 3, false, '#859b82');

const TRUNK_RADIUS = 1;
const PINE_BOTTOM_RADIUS = 6;
const PINE_CONE_HEIGHT = 10;
const PINE_CONE_DIFF = 5;
const PINE_TRUNK_HEIGHT = 4;


/**
 * Genera un árbol con las dimensiones indicadas
 * @param {number} width        ancho del arbol
 * @param {number} height       alto del arbol
 * @param {number} rotation     rotacion del arbol
 * @returns {Promise<Object3D>} el objeto arbol
 */
export async function generateTree(width = 1, height= 1.2, rotation = 0) {
    const object = new th.Group();

    const log = new th.Mesh(
        new th.CylinderGeometry(TRUNK_RADIUS*0.9, TRUNK_RADIUS, PINE_TRUNK_HEIGHT),
        treeTrunkMaterial,
    )

    const lower_cone = new th.Mesh(
        new th.ConeGeometry(PINE_BOTTOM_RADIUS, PINE_CONE_HEIGHT),
        treeLeavesMaterial,
    )
    lower_cone.position.setY((PINE_CONE_HEIGHT/4) + PINE_TRUNK_HEIGHT);

    const top_cone = lower_cone.clone();
    top_cone.scale.set(0.8,0.8,0.8);
    lower_cone.add(top_cone);
    top_cone.position.setY(PINE_CONE_DIFF);

    object.add(log);
    object.add(lower_cone);

    object.rotation.y = rotation;
    object.scale.set(width, height, width);
    object.traverse((child) => {
        if(child.isMesh) {
            child.castShadow = true;
        }
    })
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
export async function generateForest(radius = 100, trees = 8, minSize = 1.0, maxSize = 1.6, drawHelper = false) {
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

