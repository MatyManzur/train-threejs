uniform sampler2D bottomTexture;
uniform sampler2D middleTexture;
uniform sampler2D topTexture;
uniform vec2 bottomTextureRepeat;
uniform vec2 middleTextureRepeat;
uniform vec2 topTextureRepeat;

uniform float bottomTextureEnd;
uniform float middleTextureStart;
uniform float middleTextureEnd;
uniform float topTextureStart;

varying vec2 vUv;
varying float vDisplacement;

float project_on_range(float value, float range_start, float range_end) {
    if (value <= range_start) return 0.0;
    if (value >= range_end) return 1.0;
    return (value-range_start)/(range_end-range_start);
}

vec4 repeat_texture(sampler2D texture, vec2 vuv, vec2 repeat) {
    vec2 uv = fract(vuv * repeat);
  	vec2 smooth_uv = repeat * vuv;
  	vec4 duv = vec4(dFdx(smooth_uv), dFdy(smooth_uv));
  	return textureGrad(texture, uv, duv.xy, duv.zw);
}

void main() {
    vec4 botTxt = repeat_texture(bottomTexture, vUv, bottomTextureRepeat);
    vec4 midTxt = repeat_texture(middleTexture, vUv, middleTextureRepeat);
    vec4 topTxt = repeat_texture(topTexture, vUv, topTextureRepeat);
    csm_DiffuseColor = mix(botTxt, mix(midTxt, topTxt, project_on_range(vDisplacement, middleTextureEnd, topTextureStart)), project_on_range(vDisplacement, bottomTextureEnd, middleTextureStart));
}