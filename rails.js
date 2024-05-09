import * as th from 'three';


const terraplenShape = new th.Shape();


terraplenShape.moveTo( 0, -10 );
terraplenShape.bezierCurveTo( -9.17,-6.4, -7,-9,-7,0);
terraplenShape.bezierCurveTo( -7,9,-9.17,6.4,0,10 );
terraplenShape.bezierCurveTo( 0,5,0,-5,0,-10 );


const bezierPathPoints = [
    new th.Vector3(200,0,150),
    new th.Vector3(340,0,150),
    new th.Vector3(300,0,150),
    new th.Vector3(300,0,50),

    new th.Vector3(300,0,50),
    new th.Vector3(300,0,-50),
    new th.Vector3(300,0,-150),
    new th.Vector3(300,0,-200),

    new th.Vector3(300,0,-200),
    new th.Vector3(300,0,-260),
    new th.Vector3(300,0,-260),
    new th.Vector3(250,0,-260),

    new th.Vector3(250,0,-260),
    new th.Vector3(180,0,-260),
    new th.Vector3(155,0,-260),
    new th.Vector3(150,0,-320),

    new th.Vector3(150,0,-320),
    new th.Vector3(145,0,-360),
    new th.Vector3(50,0,-360),
    new th.Vector3(0,0,-360),

    new th.Vector3(0,0,-360),
    new th.Vector3(-50,0,-360),
    new th.Vector3(-125,0,-360),
    new th.Vector3(-160,0,-360),

    new th.Vector3(-160,0,-360),
    new th.Vector3(-220,0,-360),
    new th.Vector3(-230,0,-350),
    new th.Vector3(-230,0,-300),

    new th.Vector3(-230,0,-300),
    new th.Vector3(-230,0,-260),
    new th.Vector3(-230,0,-40),
    new th.Vector3(-230,0,0),

    new th.Vector3(-230,0,0),
    new th.Vector3(-230,0,40),
    new th.Vector3(-230,0,35),
    new th.Vector3(-250,0,40),

    new th.Vector3(-250,0,40),
    new th.Vector3(-260,0,45),
    new th.Vector3(-280,0,25),
    new th.Vector3(-280,0,100),

    new th.Vector3(-280,0,100),
    new th.Vector3(-260,0,175),
    new th.Vector3(-240,0,180),
    new th.Vector3(-150,0,180),

    new th.Vector3(-150,0,180),
    new th.Vector3(-80,0,180),
    new th.Vector3(-100,0,150),
    new th.Vector3(-20,0,150),

    new th.Vector3(-20,0,150),
    new th.Vector3(40,0,150),
    new th.Vector3(150,0,150),
    new th.Vector3(200,0,150),
];

const path = new th.CurvePath();

for (let i = 0; i< bezierPathPoints.length / 4; i++) {
    const curve = new th.CubicBezierCurve3(
        bezierPathPoints[4*i],
        bezierPathPoints[4*i+1],
        bezierPathPoints[4*i+2],
        bezierPathPoints[4*i+3],
    )
    path.add(curve);
}

const extrudeSettings = { 
	bevelEnabled: false,
	steps: 500,
    extrudePath: path
};

const geometry = new th.ExtrudeGeometry( terraplenShape, extrudeSettings );

export function generateRails() {
    const group = new th.Group();
    const terraplen = new th.Mesh( geometry, new th.MeshPhongMaterial(
        {
            color: '#351402'
        }
    ) );
    terraplen.scale.set(1,0.6,1)
    group.add(terraplen);
    return group;
}