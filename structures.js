import * as th from 'three';
import { getTexture, resetUVs } from './texture';

const tunnelMaterial = new th.MeshPhongMaterial({
    map: getTexture('textures/wood.jpg', .1, .1, Math.PI/2),
    shininess: 0,
});

const bridgeArcMaterial = new th.MeshPhongMaterial({
    map: getTexture('textures/brick.jpg', .1, .1),
    shininess: 10,
});

const topStructureMaterial = new th.MeshPhongMaterial({
    map: getTexture('textures/metal.jpg', .1, .1),
    shininess: 100,
    specular: '#a3a3a3'
})

const TUNNEL_WIDTH = 35;
const TUNNEL_HEIGHT = 20;
const TUNNEL_CURVE = 1;
const TUNNEL_LENGTH = 120;
const TUNNEL_WALL = 1;

const BRIDGE_ARC_WIDTH = 12;
const BRIDGE_COLUMN_DEPTH = 2;
const BRIDGE_BAR_SIZE = 0.7;


/**
 * Genera la estructura del túnel
 * @param {number} length   longitud del túnel 
 * @param {number} height   altura de la parte recta de la pared del túnel 
 * @param {number} width    ancho exterior del túnel
 * @returns {Object3D}      el objeto túnel
 */
export function generateTunnel(length = TUNNEL_LENGTH, height = TUNNEL_HEIGHT, width = TUNNEL_WIDTH) {
    const tunnelShape = new th.Shape();
    tunnelShape.moveTo(-width/2, 0);
    tunnelShape.lineTo(-width/2, height);
    tunnelShape.bezierCurveTo(-width/2, height*(1+TUNNEL_CURVE), width/2, height*(1+TUNNEL_CURVE), width/2, height);
    tunnelShape.lineTo(width/2, 0);
    tunnelShape.lineTo(width/2-TUNNEL_WALL, 0);
    tunnelShape.lineTo(width/2-TUNNEL_WALL, height);
    tunnelShape.bezierCurveTo(width/2-TUNNEL_WALL, height*(1+TUNNEL_CURVE)-TUNNEL_WALL, -width/2+TUNNEL_WALL, height*(1+TUNNEL_CURVE)-TUNNEL_WALL, -width/2+TUNNEL_WALL, height);
    tunnelShape.lineTo(-width/2+TUNNEL_WALL, 0);
    tunnelShape.lineTo(-width/2, 0);

    const tunnelExtrudeSettings = {
        depth: length,
        curveSegments: 64,
    }

    const tunnelGeometry = new th.ExtrudeGeometry(tunnelShape, tunnelExtrudeSettings);
    const tunnel = new th.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.traverse((child) => {
        if(child.isMesh) {
            child.castShadow = true;
        }
    })
    
    return tunnel;

}

function generateArc(width, depth, height, columnWidth) {
    const arcShape = new th.Shape();
    arcShape.moveTo(-width/2, 0);
    arcShape.lineTo(-width/2, -height);
    arcShape.lineTo(-width/2 + columnWidth/2, -height);
    const radius = (width - columnWidth)/2;
    arcShape.lineTo(-width/2 + columnWidth/2, -columnWidth-radius);
    arcShape.bezierCurveTo(-width/2 + columnWidth/2, -columnWidth, width/2 - columnWidth/2, -columnWidth, width/2 - columnWidth/2, -columnWidth-radius);
    arcShape.lineTo(width/2 - columnWidth/2, -height);
    arcShape.lineTo(width/2, -height);
    arcShape.lineTo(width/2, 0);
    arcShape.lineTo(-width/2, 0);

    const arcExtrudeSettings = {
        depth: depth,
    }

    const arcGeometry = new th.ExtrudeGeometry(arcShape, arcExtrudeSettings);
    return new th.Mesh(arcGeometry, bridgeArcMaterial);
}

function generateTopStructureArc(width, height, barSize) {
    const segment = new th.Group();
    const bar_1 = new th.Mesh(
        new th.BoxGeometry(barSize, height, barSize),
        topStructureMaterial
    );
    bar_1.position.set(-width/2+barSize, height/2, 0);
    segment.add(bar_1);
    const bar_2 = new th.Mesh(
        new th.BoxGeometry(barSize, height, barSize),
        topStructureMaterial
    );
    bar_2.position.set(width/2-barSize, height/2, 0);
    segment.add(bar_2);
    const bar_3 = new th.Mesh(
        new th.BoxGeometry(width-barSize, barSize, barSize),
        topStructureMaterial
    );
    bar_3.position.set(0, height, 0);
    segment.add(bar_3);
    return segment;
}

function generateTopStructureSegment(length, width, height, barSize) {
    const segment = generateTopStructureArc(width, height, barSize);
    const bar_4 = new th.Mesh(
        new th.BoxGeometry(barSize, Math.sqrt(height**2+length**2), barSize),
        topStructureMaterial
    );
    bar_4.position.set(-width/2+barSize, height/2, length/2);
    bar_4.rotateX(Math.atan2(length, height));
    segment.add(bar_4);
    const bar_5 = new th.Mesh(
        new th.BoxGeometry(barSize, Math.sqrt(height**2+length**2), barSize),
        topStructureMaterial
    );
    bar_5.position.set(width/2-barSize, height/2, length/2);
    bar_5.rotateX(-Math.atan2(length, height));
    segment.add(bar_5);
    const bar_6 = new th.Mesh(
        new th.BoxGeometry(barSize, Math.sqrt((width-2*barSize)**2+length**2), barSize),
        topStructureMaterial
    );
    bar_6.position.set(0, height, length/2);
    bar_6.rotateY(-Math.atan2(length, height));
    bar_6.rotateZ(Math.PI/2);
    segment.add(bar_6);
    const bar_7 = new th.Mesh(
        new th.BoxGeometry(barSize, barSize, length),
        topStructureMaterial
    );
    bar_7.position.set(-width/2+barSize, height, length/2);
    segment.add(bar_7);
    const bar_8 = new th.Mesh(
        new th.BoxGeometry(barSize, barSize, length),
        topStructureMaterial
    );
    bar_8.position.set(width/2-barSize, height, length/2);
    segment.add(bar_8);

    segment.rotateY(Math.PI/2);
    return segment;
}


/**
 * Genera el puente con las estructuras correspondientes
 * @param {number} bridgeLength         longitud del puente
 * @param {number} bridgeWidth          ancho del puente
 * @param {number} bridgeColumnsHeight  altura de las columnas de la base
 * @param {number} topStructureHeight   altura de estructura metálica superior
 * @param {number} topStructureSegments cantidad de repeticiones de estructura metálica superior
 * @returns {Object3D}                  el grupo con los objetos que conforman el puente
 */
export function generateBridge(bridgeLength, bridgeWidth, bridgeColumnsHeight, topStructureHeight, topStructureSegments) {

    const arcCount = Math.ceil(bridgeLength/BRIDGE_ARC_WIDTH);


    const bridge = new th.Group();
    const columns = new th.Group();
    const topStructure = new th.Group();

    for(let i = 0; i< arcCount;i++) {
        const arc_1 = generateArc(BRIDGE_ARC_WIDTH, BRIDGE_COLUMN_DEPTH, bridgeColumnsHeight, BRIDGE_COLUMN_DEPTH);
        arc_1.translateZ(bridgeWidth/2-BRIDGE_COLUMN_DEPTH);
        arc_1.translateX(i*BRIDGE_ARC_WIDTH);
        columns.add(arc_1);
        const arc_2 = generateArc(BRIDGE_ARC_WIDTH, BRIDGE_COLUMN_DEPTH, bridgeColumnsHeight, BRIDGE_COLUMN_DEPTH);
        arc_2.translateZ(-bridgeWidth/2);
        arc_2.translateX(i*BRIDGE_ARC_WIDTH);
        columns.add(arc_2);
    }
    for(let i=0;i<topStructureSegments;i++) {
        const segment = generateTopStructureSegment(bridgeLength/topStructureSegments, bridgeWidth, topStructureHeight, BRIDGE_BAR_SIZE);
        segment.translateZ(i*(bridgeLength/topStructureSegments));
        topStructure.add(segment);
    }
    const finalArc = generateTopStructureArc(bridgeWidth, topStructureHeight, BRIDGE_BAR_SIZE);
    finalArc.rotateY(Math.PI/2);
    finalArc.translateZ(bridgeLength);
    topStructure.add(finalArc);


    bridge.add(columns);
    bridge.add(topStructure);

    bridge.traverse((child) => {
        if(child.isMesh) {
            resetUVs(child);
            child.castShadow = true;
        }
    })

    return bridge;
}