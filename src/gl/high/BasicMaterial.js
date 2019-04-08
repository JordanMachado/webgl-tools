import Shader from './Shader';
const glslify = require('glslify');

function filterEmptyLine(string)
{
    return string !== '';
}

export default class Material extends Shader
{
    constructor(options = {})
    {
    // console.log(glslify('../shaders/basic.vert'));
        const vs = glslify('../shaders/basic.vert');
        const fs = glslify('../shaders/basic.frag');
        // console.log(vs);
        const definesVs = [
            options.color ? '#define COLOR' : '',
            options.normalMap ? '#define NORMAL_MAP' : '',
            options.fog ? '#define FOG' : '',
        ].filter(filterEmptyLine).join('\n');

        const definesFs = [
            options.color ? '#define COLOR' : '',
            options.texture ? '#define TEXTURE' : '',
            options.normalMap ? '#define NORMAL_MAP' : '',
            options.fog ? '#define FOG' : '',

        ].filter(filterEmptyLine).join('\n');

        let vertex = `${definesVs}\n${vs}`;
        let fragment = `${definesFs}\n${fs}`;

        if (!options.vertex) options.vertex = {};

        vertex = vertex.replace(/#HOOK_VERTEX_START/g, options.vertex.start || '');
        vertex = vertex.replace(/#HOOK_VERTEX_MAIN/g, options.vertex.main || '');
        vertex = vertex.replace(/#HOOK_VERTEX_END/g, options.vertex.end || '');

        if (!options.fragment) options.fragment = {};

        fragment = fragment.replace(/#HOOK_FRAGMENT_START/g, options.fragment.start || '');
        fragment = fragment.replace(/#HOOK_FRAGMENT_MAIN/g, options.fragment.main || '');
        fragment = fragment.replace(/#HOOK_FRAGMENT_END/g, options.fragment.end || '');

        // console.log(fragment);
        // console.log(vertex);

        if (!options.fog) options.fog = {};
        // if(!options.uniforms) options.uniforms = {};

        super(vertex, fragment, Object.assign({}, {
            uColor: options.color || [0, 0, 0],
            uTexture: options.texture || null,
            uNormalMap: options.normalMap || null,
            uNormalScale: options.normalScale || [1, 1],
            uNormalUVRepeat: options.normalUvRepeat || [1, 1],
            uDensity: options.fog.density || 0.0,
            uGradient: options.fog.gradient || 0.0,
            uFogColor: options.fog.color || [0, 0, 0],
        }, options.uniforms), 'BasicMaterial');
    }
}
