import * as glm from 'gl-matrix';

const mat4 = glm.mat4;
const vec3 = glm.vec3;
const vec2 = glm.vec2;
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}


function generateFaces(vertices, indices) {
  let _vertices = [];
let index= 0;
for (var i = 0; i < vertices.length; i+=3) {
  _vertices.push([vertices[i],vertices[i+1],vertices[i+2]])

}
let ia, ib, ic;
let a, b, c;
const vba = vec3.create(), vca = vec3.create();
const faces = [];
for(let i = 0; i < indices.length; i += 3) {
  if(i%2==0) index+=10;
  ia = indices[i];
  ib = indices[i + 1];
  ic = indices[i + 2];


  a = _vertices[ia];
  b = _vertices[ib];
  c = _vertices[ic];


  const face = {
    indices:[ia, ib, ic],
    index,
    vertices:[a, b, c],
  };

  faces.push(face);
}
return faces;
}




function randomPointInGeometry(geometry, nbPoints) {

}

function generateTangents(vertices, uvs) {
  let tangents = []
  let bitangents = []
  let v0 = vec3.create();
  let v1 = vec3.create();
  let v2 = vec3.create();

  let uv0 = vec3.create();
  let uv1 = vec3.create();
  let uv2 = vec3.create();

  let deltaPos1 = vec3.create();
  let deltaPos2 = vec3.create();

  let deltaUV1 = vec2.create();
  let deltaUV2 = vec2.create();

  for (var i = 0; i < vertices.length; i+=3) {
    let _v0 = vertices[i];
    let _v1 = vertices[i + 1];
    let _v2 = vertices[i + 2];
    vec3.set(v0, _v0[0], _v0[1], _v0[2])
    vec3.set(v1, _v1[0], _v1[1], _v1[2])
    vec3.set(v2, _v2[0], _v2[1], _v2[2])


    let _uv0 = uvs[i];
    let _uv1 = uvs[i + 1];
    let _uv2 = uvs[i + 2];

    vec2.set(uv0, _uv0[0], _uv0[1])
    vec2.set(uv1, _uv1[0], _uv1[1])
    vec2.set(uv2, _uv2[0], _uv2[1])

    vec3.subtract(deltaPos1, v1, v0);
    vec3.subtract(deltaPos2, v2, v0);

    vec3.subtract(deltaUV1,uv0, uv1);
    vec3.subtract(deltaUV2,uv0, uv2 );

    let delta = (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0])
    // delta = delta === 0 ? 1: 0.0001;
    let r = 1.0 /  delta;
    // console.log(r);

    let scalePos1x = scalar(deltaPos1, deltaUV2[0]);
    let scalePos1y = scalar(deltaPos1, deltaUV2[1]);

    let scalePos2x = scalar(deltaPos2, deltaUV1[0]);
    let scalePos2y = scalar(deltaPos2, deltaUV1[1]);

    // console.log(scalePos1x,scalePos1y);
    let tangent = scalar(sub(scalePos1y, scalePos2y), r);
    let bitangent = scalar(sub(scalePos2x, scalePos1x), r);

    tangents.push(tangent)
    tangents.push(tangent)
    tangents.push(tangent)
    bitangents.push(bitangent)
    bitangents.push(bitangent)
    bitangents.push(bitangent)

    return {
      tangents,
      bitangents
    }


    // vec2.sub(deltaPos1, uv1, uv0)
    // console.log(deltaPos1);

  }
  return {
    tangents,
    bitangents
  }
  console.log('tangent');
}

function scalar(vec, scalar) {
  let _vec = [];
  for (var i = 0; i < vec.length; i++) {
    _vec[i] = vec[i] * scalar;
  }
  return _vec;
}

function sub(b, a) {
  let _vec = [];
  for (var i = 0; i < a.length; i++) {
    _vec[i] = a[i] - b[i];
  }
  return _vec;
}

export default {
  flatten,
  generateFaces,

  generateTangents,
  randomPointInGeometry
};
