import * as glm from 'gl-matrix';

const mat4 = glm.mat4;
const vec3 = glm.vec3;
const vec2 = glm.vec2;

function flatten(arr)
{
    return arr.reduce(function (flat, toFlatten)
    {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function generateFaces(vertices, indices)
{
    const _vertices = [];
    let index = 0;

    for (let i = 0; i < vertices.length; i += 3)
    {
        _vertices.push([vertices[i], vertices[i + 1], vertices[i + 2]]);
    }
    let ia,
        ib,
        ic;
    let a,
        b,
        c;
    const vba = vec3.create(),
        vca = vec3.create();
    const faces = [];

    for (let i = 0; i < indices.length; i += 3)
    {
        if (i % 2 == 0) index += 10;
        ia = indices[i];
        ib = indices[i + 1];
        ic = indices[i + 2];

        a = _vertices[ia];
        b = _vertices[ib];
        c = _vertices[ic];

        const face = {
            indices: [ia, ib, ic],
            index,
            vertices: [a, b, c],
        };

        faces.push(face);
    }

    return faces;
}

function randomPointInGeometry(geometry, nbPoints)
{

}

function generateTangents(vertices, uvs)
{
    const tangents = [];
    const bitangents = [];
    const v0 = vec3.create();
    const v1 = vec3.create();
    const v2 = vec3.create();

    const uv0 = vec3.create();
    const uv1 = vec3.create();
    const uv2 = vec3.create();

    const deltaPos1 = vec3.create();
    const deltaPos2 = vec3.create();

    const deltaUV1 = vec2.create();
    const deltaUV2 = vec2.create();

    for (let i = 0; i < vertices.length; i += 3)
    {
        const _v0 = vertices[i];
        const _v1 = vertices[i + 1];
        const _v2 = vertices[i + 2];

        vec3.set(v0, _v0[0], _v0[1], _v0[2]);
        vec3.set(v1, _v1[0], _v1[1], _v1[2]);
        vec3.set(v2, _v2[0], _v2[1], _v2[2]);

        const _uv0 = uvs[i];
        const _uv1 = uvs[i + 1];
        const _uv2 = uvs[i + 2];

        vec2.set(uv0, _uv0[0], _uv0[1]);
        vec2.set(uv1, _uv1[0], _uv1[1]);
        vec2.set(uv2, _uv2[0], _uv2[1]);

        vec3.subtract(deltaPos1, v1, v0);
        vec3.subtract(deltaPos2, v2, v0);

        vec3.subtract(deltaUV1, uv0, uv1);
        vec3.subtract(deltaUV2, uv0, uv2);

        const delta = (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
        // delta = delta === 0 ? 1: 0.0001;
        const r = 1.0 / delta;
        // console.log(r);

        const scalePos1x = scalar(deltaPos1, deltaUV2[0]);
        const scalePos1y = scalar(deltaPos1, deltaUV2[1]);

        const scalePos2x = scalar(deltaPos2, deltaUV1[0]);
        const scalePos2y = scalar(deltaPos2, deltaUV1[1]);

        // console.log(scalePos1x,scalePos1y);
        const tangent = scalar(sub(scalePos1y, scalePos2y), r);
        const bitangent = scalar(sub(scalePos2x, scalePos1x), r);

        tangents.push(tangent);
        tangents.push(tangent);
        tangents.push(tangent);
        bitangents.push(bitangent);
        bitangents.push(bitangent);
        bitangents.push(bitangent);

        return {
            tangents,
            bitangents,
        };

    // vec2.sub(deltaPos1, uv1, uv0)
    // console.log(deltaPos1);
    }

    return {
        tangents,
        bitangents,
    };
    console.log('tangent');
}

function scalar(vec, scalar)
{
    const _vec = [];

    for (let i = 0; i < vec.length; i++)
    {
        _vec[i] = vec[i] * scalar;
    }

    return _vec;
}

function sub(b, a)
{
    const _vec = [];

    for (let i = 0; i < a.length; i++)
    {
        _vec[i] = a[i] - b[i];
    }

    return _vec;
}

export default {
    flatten,
    generateFaces,

    generateTangents,
    randomPointInGeometry,
};
