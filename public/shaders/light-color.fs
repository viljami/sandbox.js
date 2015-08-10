precision mediump float;

varying vec3 vLightWeighting;
varying vec4 vColor;

void main(void){
    gl_FragColor = vec4(vColor.xyz * vLightWeighting, vColor.a);
}
