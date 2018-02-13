precision highp float;
uniform sampler2D uTexture;
varying vec2 vUv;


uniform float uBlurAmount;
uniform float uCenter;
uniform float uStepSize;

const float steps       = 3.0;

const float minOffs     = (float(steps-1.0)) / -2.0;
const float maxOffs     = (float(steps-1.0)) / +2.0;

void main() {

    float amount;
    vec4 blurred;

        //Work out how much to blur based on the mid point
    amount = pow((vUv.y * uCenter) * 2.0 - 1.0, 2.0) * uBlurAmount;

        //This is the accumulation of color from the surrounding pixels in the texture
    blurred = vec4(0.0, 0.0, 0.0, 1.0);

        //From minimum offset to maximum offset
    for (float offsX = minOffs; offsX <= maxOffs; ++offsX) {
        for (float offsY = minOffs; offsY <= maxOffs; ++offsY) {

                //copy the coord so we can mess with it
            vec2 temp_vUv = vUv.xy;

                //work out which uv we want to sample now
            temp_vUv.x += offsX * amount * uStepSize;
            temp_vUv.y += offsY * amount * uStepSize;

                //accumulate the sample
            blurred += texture2D(uTexture, temp_vUv);

        } //for y
    } //for x

    blurred /= float(steps * steps);
    gl_FragColor = blurred;

}
