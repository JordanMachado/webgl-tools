import G from 'gl';
import OrbitalCameraControl from 'gl/utils/OrbitalCameraControl';
import Query from 'dev/Query';
import SuperConfig from 'dev/SuperConfig';
import { mat4, mat3 } from 'gl-matrix';
import System from './System';
const glslify = require('glslify');

export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    this.webgl.clearColor("#ffe1d9", 1)

    this.webgl.append();
    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.controls = new OrbitalCameraControl(this.camera, 20, window);
    this.controls.center = [4,0,0]
    this.fboHelper = new G.FBOHelper(this.webgl,256);


    // this.cameraShadow = new G.PerspectiveCamera(45, 1, 0.1, 100);
    let s = 15;
    this.cameraShadow =  new G.OrthographicCamera(-s,s,-s,s, 1, 100);
    this.cameraShadow.lookAt([0,50 ,0.1], [0,0,0], [0,1,0]);
    this.mvpDepth = mat4.create();
    mat4.multiply(this.mvpDepth, this.cameraShadow.projection, this.cameraShadow.view)
    const biaMatrix = mat4.fromValues(
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.5, 0.5, 0.5, 1.0
      );
    mat4.multiply(this.mvpDepth, biaMatrix, this.mvpDepth);

    this.fbo = new G.FrameBuffer(gl, 1024,1024 , { depth: true});
    this.fboHelper.attach(this.fbo.depth);
    this.fboHelper.attach(this.fbo.colors);


    this.scene = new G.Object3D();



    const system = this.system = new System(256, this)
    this.scene.addChild(system.mesh);


    this.quad = new G.Mesh(new G.Geometry(G.Primitive.plane(20,20, 20, 20)), new G.BasicMaterial({
      color: G.Utils.hexToRgb("#ffffff"),
      uniforms: {
        uShadowMap: this.fbo.depth,
        uShadowMatrix: this.mvpDepth,
      },
      fog: {
        density:0.02,
        gradient:2,
        color:G.Utils.hexToRgb("#ffe1d9")
      },

      vertex: {
        start: `
        uniform mat4 uShadowMatrix;
        varying vec4 vShadowCoord;

        `,
        end: `
        vShadowCoord = uShadowMatrix * worldMatrix * p;

        `
      },
      fragment: {
        start: `
          uniform sampler2D uShadowMap;
          varying vec4 vShadowCoord;
          float rand(vec2 co){
              return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
          }

          float sampleShadow(vec3 coord) {
          	return step(coord.z, texture2D(uShadowMap, coord.xy).r + rand(coord.xy) * 0.03);
          }

        `,
        main: `
          vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
          vec2 uv = shadowCoord.xy;

          float shadow = 0.0;
          float offset = 0.001;

          shadow += sampleShadow(shadowCoord.xyz);
          shadow += sampleShadow(shadowCoord.xyz + vec3(   0.0, -offset, 0.0));
          shadow += sampleShadow(shadowCoord.xyz + vec3(-offset,    0.0, 0.0));
          shadow += sampleShadow(shadowCoord.xyz + vec3(   0.0,    0.0, 0.0));
          shadow += sampleShadow(shadowCoord.xyz + vec3( offset,    0.0, 0.0));
          shadow += sampleShadow(shadowCoord.xyz + vec3(   0.0,  offset, 0.0));
          shadow /= 5.0;


          `,
          end: `

          gl_FragColor = vec4( finalColor.rgb + light, finalColor.a);
          gl_FragColor.rgb *= vec3(smoothstep(0.0, 1.0, shadow+0.65));



          `

      }
    }));
    this.quad.scale.set(10);
    // this.quad.scale.set(2);

    this.quad.position.y = -4;
    this.quad.rotation.x = Math.PI/180 * -90
    this.scene.addChild(this.quad)

    this.hitarea = new G.Mesh(new G.Geometry(G.Primitive.quad(1)), new G.BasicMaterial())

    this.hitDetect = new G.HitDetect(this.hitarea, this.camera)

    this.hitarea.scale.set(10);

    // this.scene.addChild(this.hitarea);






  }
  render(){
    if(SuperConfig.config.controls) {
      this.controls.update();
    }

    // console.log(this.hitDetect.hit);
    // this.sphere.position.x = this.hitDetect.hit[0]
    // this.sphere.position.y = this.hitDetect.hit[1]
    // this.sphere.position.z = this.hitDetect.hit[2]

    gl.disable(gl.BLEND);
    this.system.update(this.hitDetect.hit);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    this.fbo.bind();
      this.fbo.clear();
      this.webgl.render(this.scene,this.cameraShadow);
    this.fbo.unbind();

    this.webgl.clear();


    this.webgl.render(this.scene, this.camera);
    if(Query.debug)
    this.fboHelper.render();


  }
  resize(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }

}
