import ArrayBuffer from './core/ArrayBuffer';
import IndexBuffer from './core/IndexBuffer';
import FrameBuffer from './core/FrameBuffer';
import Object3D from './core/Object3D';
import Program from './core/Program';
import Texture from './core/Texture';
import TextureCube from './core/TextureCube';
import Webgl from './core/Webgl';
import State from './core/State';

import OrthographicCamera from './camera/OrthographicCamera';
import PerspectiveCamera from './camera/PerspectiveCamera';

import GLNumber from './const/webglNumber';
import GLConst from './const/webglConst';

import Geometry from './high/Geometry';
import Mesh from './high/Mesh';
import Shader from './high/Shader';
import Primitive from './high/Primitive';



import Utils from './utils/Utils';
import ArrayUtils from './utils/ArrayUtils';
import Debug from './utils/Debug';
import Vector3 from './math/Vector3';

import Composer from './post/Composer';
import Pass from './post/Pass';
import NoisePass from './post/NoisePass';
import InvertPass from './post/InvertPass';
import FXAAPass from './post/FXAAPass';
import ToonPass from './post/ToonPass';

import FBOHelper from './utils/FBOHelper';

import glm from 'gl-matrix';
const vanilla = {
  glm,
  // core
  Webgl,
  Texture,
  TextureCube,
  Program,
  Object3D,
  FrameBuffer,
  IndexBuffer,
  ArrayBuffer,

  // camera
  OrthographicCamera,
  PerspectiveCamera,

  // const
  GLNumber,
  GLConst,

  // high api
  Geometry,
  Mesh,
  Shader,
  Primitive,
  State,

  // Utils
  Utils,
  utils:Utils,
  ArrayUtils,
  Debug,
  debug:Debug,

  // Math
  Vector3,

  // Composer
  Composer,
  Pass,
  NoisePass,
  InvertPass,
  FXAAPass,
  ToonPass,
  FBOHelper
}
export default vanilla;
