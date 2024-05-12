import * as th from 'three';
import { getPointAt, getRailPath, getTangentAt } from './path';
import { offLightMaterial, onLightMaterial } from './lights';



const trainBodyMaterial = new th.MeshPhongMaterial({
    color: '#ff6600'
});

const trainSmokeStackMaterial = new th.MeshPhongMaterial({
    color: '#ff7b00'
});

const trainRoofMaterial = new th.MeshPhongMaterial({
    color: '#f0e87d'
})

const trainMotorMaterial = new th.MeshPhongMaterial({
    color: '#7c7c7c'
})

const trainWheelsMaterial = new th.MeshPhongMaterial({
    color: '#000000'
})

const trainRodMaterial = new th.MeshPhongMaterial({
    color: '#333333'
})

const trainPistonMaterial = new th.MeshPhongMaterial({
    color: '#310000'
})

const TRAIN_PATH_SEGMENTS = 2048;

const TRAIN_BARREL_DIAMETER = 5;
const TRAIN_BARREL_LENGTH = 12;
const TRAIN_FRONT_DIAMETER = 5.6;
const TRAIN_FRONT_WIDTH = 1.2;
const TRAIN_FLOOR_WIDTH = 0.2;
const TRAIN_CABIN_LENGTH = 4;
const TRAIN_CABIN_WIDTH = 5;
const TRAIN_CABIN_HEIGHT = 8;
const TRAIN_CABIN_FLOOR_WIDTH = 3;
const TRAIN_CABIN_PANEL_HEIGHT = 3.5;
const TRAIN_CABIN_PANELS_WIDTH = 0.2;
const INNER_RAIL_GAP = 4;
const TRAIN_MOTOR_LENGTH = 10;
const TRAIN_MOTOR_HEIGHT = 1;
const WHEEL_RADIUS = 1;
const WHEEL_WIDTH = 0.4;
const WHEEL_SEPARATION = 2.6;
const CENTER_WHEEL_POSITION = -1;
const PISTON_RADIUS = 0.8;
const PISTON_LENGTH = 2;
const EXTRA_ROD_LENGTH = 3;
const ROD_WIDTH=0.2;
const ROD_HEIGHT=0.2;
const BOLT_DEPTH=0.2;
const TRAIN_LIGHT_SIZE = 1;
const SMOKE_STACK_HEIGHT = 4;

const train = new th.Group();

const trainBodyBarrel = new th.Mesh(
    new th.CylinderGeometry(
        TRAIN_BARREL_DIAMETER/2,
        TRAIN_BARREL_DIAMETER/2,
        TRAIN_BARREL_LENGTH
    ),
    trainBodyMaterial);
trainBodyBarrel.rotateX(Math.PI/2);
train.add(trainBodyBarrel);

const trainFrontCircle = new th.Mesh(
    new th.CylinderGeometry(
        TRAIN_FRONT_DIAMETER/2,
        TRAIN_FRONT_DIAMETER/2,
        TRAIN_FRONT_WIDTH
    ),
    trainBodyMaterial);
trainFrontCircle.position.set(0,TRAIN_BARREL_LENGTH/2 + TRAIN_FRONT_WIDTH/2,0)
trainBodyBarrel.add(trainFrontCircle);

const trainFrontLight = new th.Mesh(
    new th.SphereGeometry(TRAIN_LIGHT_SIZE),
    offLightMaterial,
)
trainFrontLight.position.set(0,TRAIN_FRONT_WIDTH/4,0);
trainFrontCircle.add(trainFrontLight);

const trainSmokeStack = new th.Mesh(
    new th.CylinderGeometry(TRAIN_FRONT_WIDTH*0.4, TRAIN_FRONT_WIDTH*0.4, SMOKE_STACK_HEIGHT),
    trainSmokeStackMaterial
);
trainSmokeStack.rotateX(Math.PI/2);
trainSmokeStack.position.set(0,0,-TRAIN_FRONT_DIAMETER/2);
trainFrontCircle.add(trainSmokeStack);

const smokeStackTop = new th.Mesh(
    new th.CylinderGeometry(TRAIN_FRONT_WIDTH*0.4, TRAIN_FRONT_WIDTH*0.55, SMOKE_STACK_HEIGHT/6),
    trainSmokeStackMaterial
);
smokeStackTop.position.set(0,-SMOKE_STACK_HEIGHT/2, 0);
trainSmokeStack.add(smokeStackTop);

const trainBaseShape = new th.Shape();
trainBaseShape.moveTo(0,0);
trainBaseShape.lineTo(TRAIN_BARREL_LENGTH, 0);
trainBaseShape.lineTo(TRAIN_BARREL_LENGTH, -TRAIN_FLOOR_WIDTH);
trainBaseShape.lineTo(0, -TRAIN_FLOOR_WIDTH);
trainBaseShape.lineTo(-(TRAIN_CABIN_LENGTH*1.2)/2, -TRAIN_CABIN_FLOOR_WIDTH/2);
trainBaseShape.lineTo(-(TRAIN_CABIN_LENGTH*1.2), -TRAIN_CABIN_FLOOR_WIDTH/2);
trainBaseShape.lineTo(-(TRAIN_CABIN_LENGTH*1.2), TRAIN_CABIN_FLOOR_WIDTH/2);
trainBaseShape.lineTo(0, TRAIN_CABIN_FLOOR_WIDTH/2);
trainBaseShape.lineTo(0,0);

const extrudeSettings = { 
	bevelEnabled: false,
	steps: 1,
    depth: TRAIN_CABIN_WIDTH,
};

const trainBaseGeometry = new th.ExtrudeGeometry( trainBaseShape, extrudeSettings );
const trainBase = new th.Mesh( trainBaseGeometry, trainBodyMaterial);
trainBase.rotateY(-Math.PI/2);
trainBase.position.set(TRAIN_CABIN_WIDTH/2, -TRAIN_BARREL_DIAMETER/2, -TRAIN_BARREL_LENGTH/2);
train.add(trainBase);

const trainCabin = new th.Group();
trainCabin.position.set(0,-TRAIN_BARREL_DIAMETER/2+TRAIN_CABIN_FLOOR_WIDTH/2,-TRAIN_BARREL_LENGTH/2);
train.add(trainCabin);

const cabinLateralPanelShape = new th.Shape();
cabinLateralPanelShape.moveTo(0,0);
cabinLateralPanelShape.lineTo(TRAIN_CABIN_LENGTH, 0);
cabinLateralPanelShape.lineTo(TRAIN_CABIN_LENGTH, TRAIN_CABIN_HEIGHT);
cabinLateralPanelShape.lineTo(TRAIN_CABIN_LENGTH - TRAIN_CABIN_PANELS_WIDTH, TRAIN_CABIN_HEIGHT);
cabinLateralPanelShape.lineTo(TRAIN_CABIN_LENGTH - TRAIN_CABIN_PANELS_WIDTH, TRAIN_CABIN_PANEL_HEIGHT);
cabinLateralPanelShape.lineTo(TRAIN_CABIN_PANELS_WIDTH, TRAIN_CABIN_PANEL_HEIGHT);
cabinLateralPanelShape.lineTo(TRAIN_CABIN_PANELS_WIDTH, TRAIN_CABIN_HEIGHT);
cabinLateralPanelShape.lineTo(0,TRAIN_CABIN_HEIGHT);
cabinLateralPanelShape.lineTo(0,0);

const extrudeSettings_2 = { 
	bevelEnabled: false,
	steps: 1,
    depth: TRAIN_CABIN_PANELS_WIDTH,
};

const cabinLateralPanel = new th.Mesh(
    new th.ExtrudeGeometry( cabinLateralPanelShape, extrudeSettings_2 ),
    trainBodyMaterial);
cabinLateralPanel.rotateY(Math.PI/2);
cabinLateralPanel.position.set(TRAIN_CABIN_WIDTH/2 - TRAIN_CABIN_PANELS_WIDTH,0,0);
const cabinLateralPanel_2 = cabinLateralPanel.clone();
cabinLateralPanel_2.position.set(-TRAIN_CABIN_WIDTH/2,0,0)
trainCabin.add(cabinLateralPanel);
trainCabin.add(cabinLateralPanel_2);

const cabinFrontPanel = new th.Mesh(
    new th.BoxGeometry(TRAIN_CABIN_WIDTH, TRAIN_CABIN_PANEL_HEIGHT, TRAIN_CABIN_PANELS_WIDTH),
    trainBodyMaterial
);
cabinFrontPanel.position.set(0,TRAIN_CABIN_PANEL_HEIGHT/2,0)
trainCabin.add(cabinFrontPanel);

const trainCabinRoof = new th.Mesh(
    new th.BoxGeometry(TRAIN_CABIN_WIDTH*1.2, TRAIN_CABIN_LENGTH*1.2, 2*TRAIN_CABIN_PANELS_WIDTH),
    trainRoofMaterial
);
trainCabinRoof.rotateX(Math.PI/2);
trainCabinRoof.position.set(0,TRAIN_CABIN_HEIGHT, -TRAIN_CABIN_LENGTH/2)
trainCabin.add(trainCabinRoof);

const trainMotor = new th.Mesh(
    new th.BoxGeometry(INNER_RAIL_GAP, TRAIN_MOTOR_HEIGHT, TRAIN_MOTOR_LENGTH),
    trainMotorMaterial
);
trainMotor.position.set(0,-TRAIN_BARREL_DIAMETER/2-TRAIN_FLOOR_WIDTH-TRAIN_MOTOR_HEIGHT/2,0);
train.add(trainMotor);

// WHEELS

const wheelAnimations = [];

// LEFT WHEELS

const wheels_l_group = new th.Group();
wheels_l_group.rotateZ(Math.PI/2);
wheels_l_group.position.set(INNER_RAIL_GAP/2+WHEEL_WIDTH/2,-TRAIN_BARREL_DIAMETER/2-TRAIN_FLOOR_WIDTH-TRAIN_MOTOR_HEIGHT,CENTER_WHEEL_POSITION);
train.add(wheels_l_group);

const wheels_l = new th.Group();

const wheel_1 = new th.Mesh(
    new th.CylinderGeometry(WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_WIDTH),
    trainWheelsMaterial
);
const wheel_bolt = new th.Mesh(
    new th.CylinderGeometry(ROD_HEIGHT/2, ROD_HEIGHT/2, BOLT_DEPTH),
    trainRodMaterial
);
wheel_bolt.position.set(WHEEL_RADIUS/2,-WHEEL_WIDTH/2,0);
wheel_1.add(wheel_bolt);
wheels_l.add(wheel_1);
const wheel_2 = wheel_1.clone();
wheel_2.translateZ(-WHEEL_SEPARATION);
wheels_l.add(wheel_2);
const wheel_3 = wheel_1.clone();
wheel_3.translateZ(WHEEL_SEPARATION);
wheels_l.add(wheel_3);

wheels_l.children.forEach((wheel) => {
    wheelAnimations.push((rotation) => {
        wheel.rotateY(-rotation/WHEEL_RADIUS);
    });
})

wheels_l_group.add(wheels_l);

// LEFT PISTON

const piston_l = new th.Mesh(
    new th.CylinderGeometry(PISTON_RADIUS, PISTON_RADIUS, PISTON_LENGTH),
    trainPistonMaterial
);
piston_l.position.set(INNER_RAIL_GAP/2+PISTON_RADIUS*0.8,-TRAIN_BARREL_DIAMETER/2-TRAIN_FLOOR_WIDTH-TRAIN_MOTOR_HEIGHT,CENTER_WHEEL_POSITION+WHEEL_SEPARATION*2)
piston_l.rotateX(Math.PI/2);
train.add(piston_l);

// LEFT ROD

const longRodCenterL = new th.Group();
const longRod_l = new th.Mesh(
    new th.BoxGeometry(2*WHEEL_SEPARATION+ROD_HEIGHT+EXTRA_ROD_LENGTH, ROD_HEIGHT, ROD_WIDTH),
    trainRodMaterial
)
longRodCenterL.add(longRod_l);
longRodCenterL.position.set(0,-BOLT_DEPTH,0);
longRodCenterL.rotateY(Math.PI/2);
longRod_l.position.set(-EXTRA_ROD_LENGTH/2, 0, 0);
wheels_l.children[0].children[0].add(longRodCenterL);

wheelAnimations.push((rotation) => {
    longRodCenterL.rotateY(rotation);
});

// RIGHT WHEELS

const wheels_r_group = wheels_l_group.clone();

wheels_r_group.rotateX(Math.PI);
wheels_r_group.translateY(-INNER_RAIL_GAP-WHEEL_WIDTH);

const wheels_r = wheels_r_group.children[0];

wheels_r.children.forEach((wheel) => {
    wheelAnimations.push((rotation) => {
        wheel.rotateY(rotation/WHEEL_RADIUS);
    });
})

train.add(wheels_r_group);

// RIGHT PISTON

const piston_r = piston_l.clone();
piston_r.translateX(-INNER_RAIL_GAP-WHEEL_RADIUS);
train.add(piston_r);

// RIGHT ROD

const longRodCenter_r = wheels_r.children[0].children[0].children[0];
longRodCenter_r.children[0].position.set(EXTRA_ROD_LENGTH/2,0,0);

wheelAnimations.push((rotation) => {
    longRodCenter_r.rotateY(-rotation);
});

/**
 * Genera el objeto Tren
 * @returns {Group}     grupo que contiene al tren 
 */
export function generateTrain() {
    return train;
}

let lastTick = Date.now();
let lastDistance = 0;

// const helper = new th.AxesHelper(20);
// train.add(helper);

/**
 * Realiza las animaciones correspondientes para la velocidad del tren indicada. 
 * Desplaza al tren a lo largo del camino de las vías, y gira las ruedas acorde a la velocidad
 * @param {number} trainSpeed   velocidad del tren
 * @param {number} height       altura del plano X-Z por el que se desplaza el tren
 */
export function animateTrain(trainSpeed, height) {
    const currentTick = Date.now();
    const tickDiff = (currentTick - lastTick)/1000;
    wheelAnimations.forEach((animation) => animation(tickDiff*trainSpeed));

    const currentDistance = lastDistance + tickDiff * trainSpeed;

    const currentPoint = getPointAt(currentDistance);
    const currentTangent = getTangentAt(currentDistance);
    
    train.position.set(currentPoint.x, height, currentPoint.z);
    train.rotation.set(0,Math.atan2(-currentTangent.z, currentTangent.x) + Math.PI/2,0);
    lastTick = currentTick;
    lastDistance = currentDistance;
    currentTangent;
}



