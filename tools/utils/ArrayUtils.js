import * as glm from 'gl-matrix';

const mat4 = glm.mat4;
const vec3 = glm.vec3;
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}


function generateFaces(vertices, indices) {
		let _vertices = vertices;
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


export default {
  flatten,
  generateFaces
};
