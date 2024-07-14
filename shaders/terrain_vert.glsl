varying vec2 vUv;
varying float vDisplacement;

void main() {
    vUv = uv;
    vDisplacement = texture2D(displacementMap, uv).r;
}