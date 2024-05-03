import * as th from 'three';
import { TDSLoader } from './loaders/TDSLoader.js';

function getTreeModel(model, resourcePath) {
    const loader = new TDSLoader();
    loader.setResourcePath(resourcePath);
    const obj = new Promise((resolve) => {
        loader.load(model, (object) => {
            resolve(object);
        })
    });
    return obj;
}

export async function generateTree(width = 1, height= 1, rotation = 0) {
    const object = await getTreeModel("./models/tree/Tree1.3ds", "./models/tree/textures/");
    object.rotation.x = - Math.PI /2;
    object.rotation.z = rotation;
    object.scale.set(width, width, height);
    return object;
}

function getRandomFloat(max) {
    return (Math.random() * max);
}

export async function generateForest(radius = 100, trees = 8, drawHelper = false) {
    const group = new th.Group();
    for(let i = 0;i<trees;i++) {
        const tree = await generateTree();
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

