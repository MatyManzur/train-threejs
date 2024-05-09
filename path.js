import * as th from 'three';

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

export const railPath = new th.CurvePath();

for (let i = 0; i< bezierPathPoints.length / 4; i++) {
    const curve = new th.CubicBezierCurve3(
        bezierPathPoints[4*i],
        bezierPathPoints[4*i+1],
        bezierPathPoints[4*i+2],
        bezierPathPoints[4*i+3],
    )
    railPath.add(curve);
}