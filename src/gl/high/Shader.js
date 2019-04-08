import Program from '../core/Program';

export default class Shader
{
    constructor(vs, fs, uniforms = {}, name)
    {
        this.program = new Program({
            context: gl,
            vertexShader: vs,
            fragmentShader: fs,
            name,
        });
        this.uniforms = uniforms;
    }
}
