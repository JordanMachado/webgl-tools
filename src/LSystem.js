// http://subprotocol.com/system/tree.html
// https://fr.wikipedia.org/wiki/L-Syst%C3%A8me
import G from './gl';
import { mat4, mat3, quat, vec3 } from 'gl-matrix';
import SuperConfig from './dev/SuperConfig';

let len = 50;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
let plane;
let material;
export default class LSystem {
  constructor() {
    this.rules = [
      {
        a:SuperConfig.config.rule.a,
        b:SuperConfig.config.rule.b
      },

    ]
    console.log(SuperConfig.config);
    let axiom = SuperConfig.config.axiom;


    for (var i = 0; i < 4; i++) {

      axiom = this.generate(axiom);

    }
    // console.log(axiom);
    plane = new G.Geometry(G.Primitive.cube(1,1, 1, 1));
    material = new G.BasicMaterial({
      color:[0.3,0.3,0.3]
    });

    this.positions = [];
    this.rotations = [];
    this.scales = [];


    this.buildGeom(axiom);


  }
  generate(sentence) {
    let transformed = '';
    for (var i = 0; i < sentence.length; i++) {
      const current = sentence.charAt(i);
      let found = false;
      for (var j = 0; j < this.rules.length; j++) {
        if(current == this.rules[j].a) {
          found = true;
          transformed += this.rules[j].b;
          break;
        }
      }
      if(!found) {
        transformed += current;
      }

    }
    return transformed;

  }
  buildEl(state) {
    let transform = quat.create();
    quat.rotateX(transform, transform, state.rotation[0]);
    quat.rotateY(transform, transform, state.rotation[1]);
    quat.rotateZ(transform, transform, state.rotation[2]);
    let pos = vec3.fromValues(0, state.scale[1], 0);
    vec3.transformQuat(pos, pos, transform);
    vec3.add(state.position, state.position, pos);

    // let mesh = new G.Mesh(plane, material);
    //
    // mesh.position.set(state.position[0],state.position[1],state.position[2])
    // mesh.rotation.set(state.rotation[0],state.rotation[1],state.rotation[2])
    // mesh.scale.x = state.scale[1] * 0.1;
    // mesh.scale.y = state.scale[1];
    // mesh.scale.z = state.scale[1] * 0.1;

    this.positions.push(state.position[0],state.position[1],state.position[2]);
    this.rotations.push(transform[0],transform[1],transform[2],transform[3]);
    this.scales.push(state.scale[1] * 0.1,state.scale[1],state.scale[1] * 0.1);


    // return mesh;
  }
  buildGeom(sentence) {

    let mesh = null;
    let state = {
      position: vec3.create(),
      rotation:  vec3.create(),
      scale:  vec3.fromValues(1,1,1),
    }
    let stateStack = [];
    for (var i = 0; i < sentence.length; i++) {
      const current = sentence.charAt(i);

      switch (current) {
        case 'F':
          this.buildEl(state);

          break;
        case '_':
          state.rotation[1] += Math.PI/180 * SuperConfig.config.rotation.y;
          state.rotation[2] += Math.PI/180 * SuperConfig.config.rotation.z;
          break;
        case '-':
          state.rotation[1] -= Math.PI/180 * SuperConfig.config.rotation.y;
          state.rotation[2] -= Math.PI/180 * SuperConfig.config.rotation.z;
          break;
        case '[':
          stateStack.push(clone(state));
          state.scale[1] *= SuperConfig.config.scaleDivisor;

          break;
        case ']':
          state = clone(stateStack.pop())

          break;

        default:

      }


    }

  }
}
