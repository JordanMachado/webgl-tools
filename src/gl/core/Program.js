import {
    VERTEX_SHADER,
    FRAGMENT_SHADER,
    LINK_STATUS,
    COMPILE_STATUS,
    ACTIVE_UNIFORMS,
} from '../const/webglConst';
import webglNumber from '../const/webglNumber';
import Debug from '../utils/Debug';
const uniformMap = {
    INT: 'uniform1i',
    FLOAT: 'uniform1f',
    FLOAT_VEC2: 'uniform2f',
    FLOAT_VEC3: 'uniform3f',
    SAMPLER_2D: 'uniform1i',
    SAMPLER_CUBE: 'uniform1i',
    FLOAT_MAT3: 'uniformMatrix3fv',
    FLOAT_MAT4: 'uniformMatrix4fv',
};

const attributesMapSize = {
    FLOAT: 1,
    INT: 1,
    FLOAT_VEC2: 2,
    FLOAT_VEC3: 3,
    FLOAT_VEC4: 4,
};

// String.prototype.capitalizeFirstLetter = function ()
// {
//     return this.charAt(0).toUpperCase() + this.slice(1);
// };
class Program
{
    /**
    * Constructs a new Program
    * @param {object} [params={}]  options
    * @param {object} params.context  context webgl
    * @param {string} params.vertexShader  vertexShader source
    * @param {string} params.fragmentShader  fragmentShader source
    * @param {string} params.name  name
    */
    constructor({
        context,
        vertexShader,
        fragmentShader,
        name = '',
    } = {})
    {
        this.gl = context;
        this.vs = this.createShader(vertexShader, VERTEX_SHADER);
        this.fs = this.createShader(fragmentShader, FRAGMENT_SHADER);
        this.program = this.createProgram(this.vs, this.fs);
        this.uniforms = this.u = {};
        this.attributes = this.a = {};

        Debug.group(`Program: ${name}`);
        this.buildAttributeGetter();
        this.buildUniformsGetterSetter();
        Debug.groupEnd();
    }
    /**
  * @func  createProgram
  * @description  create a shader
  * @param {object} vertexShader  vertexShader source
  * @param {object} fragmentShader  fragmentShader source
  * @memberof Program.prototype
  */
    createProgram(vertexShader, fragmentShader)
    {
        const program = this.gl.createProgram();

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        const success = this.gl.getProgramParameter(program, LINK_STATUS);

        if (success) return program;

        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);

        return null;
    }
    /**
  * @func  createShader
  * @description  create a shader
  * @param {string} source  shader source
  * @param {string} type  VERTEX_SHADER|FRAGMENT_SHADER
  * @memberof Program.prototype
  */
    createShader(source, type)
    {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        const success = this.gl.getShaderParameter(shader, COMPILE_STATUS);

        if (success) return shader;

        console.log(this.gl.getShaderInfoLog(shader));

        this.gl.deleteShader(shader);

        return null;
    }
    /**
  * @func  buildAttributeGetter
  * @description  Auto build attribute getter
  * @memberof Program.prototype
  */
    buildAttributeGetter()
    {
        const numAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);

        Debug.log(`Number of active attributes: ${numAttributes}`);

        for (let i = 0; i < numAttributes; ++i)
        {
            const attribute = this.gl.getActiveAttrib(this.program, i);
            const aLocation = this.gl.getAttribLocation(this.program, attribute.name);

            attribute.location = aLocation;
            // const Afn = `get${attribute.name.capitalizeFirstLetter()}Location`;

            attribute._size = attributesMapSize[webglNumber[attribute.type]];
            this.attributes[attribute.name] = attribute;
            Debug.log(`Attribute generated: ${attribute.name}`);

            // console.log(attributesMapSize[webglNumber[attribute.type]]);
        }
    }
    /**
  * @func  buildUniformsGetterSetter
  * @description  Auto build uniforms getter and setter
  * @memberof Program.prototype
  */
    buildUniformsGetterSetter()
    {
        const nbActiveUniforms = this.gl.getProgramParameter(this.program, ACTIVE_UNIFORMS);

        Debug.log(`Number of active uniforms: ${nbActiveUniforms}`);

        for (let i = 0; i < nbActiveUniforms; ++i)
        {
            const uniform = this.gl.getActiveUniform(this.program, i);
            const uLocation = this.gl.getUniformLocation(this.program, uniform.name);
            const uFunction = uniformMap[webglNumber[uniform.type]];

            Debug.log(`Uniform generated: ${uniform.name} | ${webglNumber[uniform.type]}`);
            this.uniforms[uniform.name] = null;

            Object.defineProperty(this.uniforms, uniform.name, {
                get: () =>
                    uniform.value,
                set: (value) =>
                {
                    uniform.value = value;

                    if (uFunction.indexOf('Matrix') === -1)
                    {
                        if (!value.length)
                        {
                            if (uFunction === 'uniform1i')
                            {
                                if (webglNumber[uniform.type] === 'INT')
                                {
                                    this.gl[uFunction](uLocation, value);
                                }
                                else
                                {
                                    this.gl[uFunction](uLocation, value._bindIndex);
                                }
                            }
                            else
                            {
                                this.gl[uFunction](uLocation, value);
                            }
                        }
                        else
                        {
                            this.gl[uFunction].apply(this.gl, Array.prototype.concat.apply(uLocation, value));
                        }
                    }
                    else
                    {
                        this.gl[uFunction](uLocation, this.gl.FALSE, value);
                    }
                },
            });
        }
    }
    /**
  * @func  bind
  * @description  Bind the program
  * @memberof Program.prototype
  */
    bind()
    {
        this.gl.useProgram(this.program);
    }
    /**
  * @func  destroy
  * @description  Destroy the program
  * @memberof Program.prototype
  */
    destroy()
    {
        this.gl.deleteProgram(this.program);
        this.gl.deleteShader(this.vs);
        this.gl.deleteShader(this.fs);
    }
}
export default Program;
