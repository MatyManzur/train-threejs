import * as th from 'three';
import { getPointAt, getRailPath, getTangentAt, pathLength } from './path';
import { getTexture, resetUVs } from './texture';

const TERRAPLEN_WIDTH = 18;
const TERRAPLEN_HEIGHT = 3;

const RAIL_WIDTH = 0.5;
const RAIL_HEIGHT = 1;
const INNER_RAIL_GAP = 4;

const SLEEPER_WIDTH = 8;
const SLEEPER_HEIGHT = 0.5;
const SLEEPER_LENGTH = 2.5;
const SLEEPER_COUNT = 220;

const terraplenMaterial = new th.MeshPhongMaterial(
    {
        map: getTexture('textures/dirt.jpg', .1, .1),
        shininess: 0,
    }
)
const railMaterial = new th.MeshPhongMaterial(
    {
        map: getTexture('textures/metal.jpg', .1, .1),
        shininess: 100,
        specular: '#cacacaff'
    }
)
const sleeperMaterial = new th.MeshPhongMaterial(
    {
        map: getTexture('textures/plank.jpg', .15, .15, Math.PI/2),
        color: '#797064',
        shininess: 0,
    }
)

const terraplenShape = new th.Shape();
terraplenShape.moveTo(0, -TERRAPLEN_WIDTH / 2);
terraplenShape.bezierCurveTo(-TERRAPLEN_HEIGHT * 1.30, -0.32 * TERRAPLEN_WIDTH, -TERRAPLEN_HEIGHT, -0.45 * TERRAPLEN_WIDTH, -TERRAPLEN_HEIGHT, 0);
terraplenShape.bezierCurveTo(-TERRAPLEN_HEIGHT, 0.45 * TERRAPLEN_WIDTH, -TERRAPLEN_HEIGHT * 1.30, 0.32 * TERRAPLEN_WIDTH, 0, TERRAPLEN_WIDTH / 2);
terraplenShape.lineTo(0, -TERRAPLEN_WIDTH / 2);

const railShape_l = new th.Shape();
railShape_l.moveTo(-TERRAPLEN_HEIGHT, -INNER_RAIL_GAP / 2);
railShape_l.lineTo(-TERRAPLEN_HEIGHT, -(INNER_RAIL_GAP / 2) - RAIL_WIDTH);
railShape_l.lineTo(-TERRAPLEN_HEIGHT - RAIL_HEIGHT, -(INNER_RAIL_GAP / 2) - RAIL_WIDTH);
railShape_l.lineTo(-TERRAPLEN_HEIGHT - RAIL_HEIGHT, -(INNER_RAIL_GAP / 2));
railShape_l.lineTo(-TERRAPLEN_HEIGHT, -(INNER_RAIL_GAP / 2));

const railShape_r = new th.Shape();
railShape_r.moveTo(-TERRAPLEN_HEIGHT, INNER_RAIL_GAP / 2);
railShape_r.lineTo(-TERRAPLEN_HEIGHT, (INNER_RAIL_GAP / 2) + RAIL_WIDTH);
railShape_r.lineTo(-TERRAPLEN_HEIGHT - RAIL_HEIGHT, (INNER_RAIL_GAP / 2) + RAIL_WIDTH);
railShape_r.lineTo(-TERRAPLEN_HEIGHT - RAIL_HEIGHT, (INNER_RAIL_GAP / 2));
railShape_r.lineTo(-TERRAPLEN_HEIGHT, (INNER_RAIL_GAP / 2));


const extrudeSettings = {
    bevelEnabled: false,
	steps: 1024,
    extrudePath: getRailPath(),
    curveSegments: 128,
};

const terraplenGeometry = new th.ExtrudeGeometry(terraplenShape, extrudeSettings);
const railLGeometry = new th.ExtrudeGeometry(railShape_l, extrudeSettings);
const railRGeometry = new th.ExtrudeGeometry(railShape_r, extrudeSettings);

function getSleeper() {
    return new th.Mesh(
        new th.BoxGeometry(SLEEPER_WIDTH, SLEEPER_HEIGHT, SLEEPER_LENGTH),
        sleeperMaterial
    );
}

/**
 * Genera el recorrido por donde pasa el tren, con terraplen y vías
 * @returns {Group}     el grupo que contiene al terraplen y las vías
 */
export function generateRails() {
    const group = new th.Group();
    const terraplen = new th.Mesh(terraplenGeometry, terraplenMaterial);
    resetUVs(terraplen);
    const rails = new th.Group();
    rails.name = "rails";
    const railLeft = new th.Mesh(railLGeometry, railMaterial);
    const railRight = new th.Mesh(railRGeometry, railMaterial);
    rails.add(railLeft);
    rails.add(railRight);
    group.add(rails);
    group.add(terraplen);
    const railsLength = pathLength;
    const gap = railsLength / SLEEPER_COUNT;
    const sleepers = new th.Group();
    for (let i=0; i<SLEEPER_COUNT;i++) {
        const sleeper = getSleeper();
        const point = getPointAt(i*gap);
        const tangent = getTangentAt(i*gap);
        sleeper.rotation.set(0,Math.atan2(-tangent.z, tangent.x) + Math.PI/2,0);
        sleeper.position.set(point.x, point.y, point.z);
        sleepers.add(sleeper);
    }
    sleepers.position.setY(TERRAPLEN_HEIGHT + SLEEPER_HEIGHT/2);
    rails.position.setY(SLEEPER_HEIGHT);
    group.add(sleepers);

    terraplen.traverse((child) => {
        if (child.isMesh) {
            child.receiveShadow = true;
        }
    })
    rails.traverse((child) => {
        if (child.isMesh) {
            resetUVs(child);
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
    sleepers.traverse((child) => {
        if (child.isMesh) {
            resetUVs(child);
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
    return group;
}