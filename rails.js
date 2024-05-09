import * as th from 'three';
import { railPath } from './path';

const TERRAPLEN_WIDTH = 18;
const TERRAPLEN_HEIGHT = 3;

const RAIL_WIDTH = 0.5;
const RAIL_HEIGHT = 1;
const INNER_RAIL_GAP = 4;

const terraplenMaterial = new th.MeshPhongMaterial(
    {color: '#775d54',}
)
const railMaterial = new th.MeshPhongMaterial(
    {color: '#dbdbdb',}
)

const terraplenShape = new th.Shape();
terraplenShape.moveTo( 0, -TERRAPLEN_WIDTH/2 );
terraplenShape.bezierCurveTo( -TERRAPLEN_HEIGHT*1.30,-0.32*TERRAPLEN_WIDTH, -TERRAPLEN_HEIGHT,-0.45*TERRAPLEN_WIDTH,-TERRAPLEN_HEIGHT,0);
terraplenShape.bezierCurveTo( -TERRAPLEN_HEIGHT,0.45*TERRAPLEN_WIDTH,-TERRAPLEN_HEIGHT*1.30,0.32*TERRAPLEN_WIDTH,0,TERRAPLEN_WIDTH/2 );
terraplenShape.lineTo( 0,-TERRAPLEN_WIDTH/2 );

const railShape_l = new th.Shape();
railShape_l.moveTo(-TERRAPLEN_HEIGHT, -INNER_RAIL_GAP/2);
railShape_l.lineTo(-TERRAPLEN_HEIGHT, -(INNER_RAIL_GAP/2)-RAIL_WIDTH);
railShape_l.lineTo(-TERRAPLEN_HEIGHT-RAIL_HEIGHT, -(INNER_RAIL_GAP/2)-RAIL_WIDTH);
railShape_l.lineTo(-TERRAPLEN_HEIGHT-RAIL_HEIGHT, -(INNER_RAIL_GAP/2));
railShape_l.lineTo(-TERRAPLEN_HEIGHT, -(INNER_RAIL_GAP/2));

const railShape_r = new th.Shape();
railShape_r.moveTo(-TERRAPLEN_HEIGHT, INNER_RAIL_GAP/2);
railShape_r.lineTo(-TERRAPLEN_HEIGHT, (INNER_RAIL_GAP/2)+RAIL_WIDTH);
railShape_r.lineTo(-TERRAPLEN_HEIGHT-RAIL_HEIGHT, (INNER_RAIL_GAP/2)+RAIL_WIDTH);
railShape_r.lineTo(-TERRAPLEN_HEIGHT-RAIL_HEIGHT, (INNER_RAIL_GAP/2));
railShape_r.lineTo(-TERRAPLEN_HEIGHT, (INNER_RAIL_GAP/2));


const extrudeSettings = { 
	bevelEnabled: false,
	steps: 500,
    extrudePath: railPath
};

const terraplenGeometry = new th.ExtrudeGeometry( terraplenShape, extrudeSettings );
const railLGeometry = new th.ExtrudeGeometry( railShape_l, extrudeSettings);
const railRGeometry = new th.ExtrudeGeometry( railShape_r, extrudeSettings);

export function generateRails() {
    const group = new th.Group();
    const terraplen = new th.Mesh( terraplenGeometry, terraplenMaterial );
    const rails = new th.Group();
    rails.name = "rails";
    const railLeft = new th.Mesh( railLGeometry, railMaterial);
    const railRight = new th.Mesh( railRGeometry, railMaterial);
    rails.add(railLeft);
    rails.add(railRight);
    group.add(rails);
    group.add(terraplen);
    return group;
}