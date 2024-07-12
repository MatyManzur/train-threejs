import * as th from 'three';

export function getTexture(source, repeatX, repeatY, rotation = 0) {
    const loader = new th.TextureLoader();
    const txt = loader.load(source);
    txt.wrapS = txt.wrapT = th.RepeatWrapping;
    txt.repeat.set(repeatX, repeatY);
    txt.rotation = rotation;
    return txt;
}

export function resetUVs(object) {
    var pos = object.geometry.getAttribute('position'),
        nor = object.geometry.getAttribute('normal'),
        uvs = object.geometry.getAttribute('uv');

    for (var i = 0; i < pos.count; i++) {
        var x = 0,
            y = 0;

        var nx = Math.abs(nor.getX(i)),
            ny = Math.abs(nor.getY(i)),
            nz = Math.abs(nor.getZ(i));

        // if facing X
        if (nx >= ny && nx >= nz) {
            x = pos.getZ(i);
            y = pos.getY(i);
        }

        // if facing Y
        if (ny >= nx && ny >= nz) {
            x = pos.getX(i);
            y = pos.getZ(i);
        }

        // if facing Z
        if (nz >= nx && nz >= ny) {
            x = pos.getX(i);
            y = pos.getY(i);
        }

        uvs.setXY(i, x, y);
    }
}