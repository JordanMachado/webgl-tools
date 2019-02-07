import G from 'gl';
import OrbitalCameraControl from 'gl/utils/OrbitalCameraControl';
import Query from 'dev/Query';
import SuperConfig from 'dev/SuperConfig';
import { mat4, mat3 } from 'gl-matrix';
import System from './System';
const glslify = require('glslify');

export default class Scene {
  constructor() {
    console.log('Particles');
    this.webgl = new G.Webgl();
    this.webgl.clearColor("#afbdc9", 1)

    this.webgl.append();
    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.controls = new OrbitalCameraControl(this.camera, 15, window);
    console.log(this.controls);
    this.controls.center = [4,0,0]
    this.fboHelper = new G.FBOHelper(this.webgl,256);


    // this.cameraShadow = new G.PerspectiveCamera(45, 1, 0.1, 100);
    let s = 10;
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

    this.fbo = new G.FrameBuffer(gl, window.innerWidth, window.innerHeight , { depth: true});
    this.fboHelper.attach(this.fbo.depth);
    this.fboHelper.attach(this.fbo.colors);


    this.scene = new G.Object3D();



    const system = this.system = new System(512, this)
    this.scene.addChild(system.mesh);


    this.quad = new G.Mesh(new G.Geometry(G.Primitive.plane(10,10, 20, 20)), new G.BasicMaterial({
      color: G.Utils.hexToRgb("#ffffff"),
      uniforms: {
        uShadowMap: this.fbo.depth,
        uShadowMatrix: this.mvpDepth,
      },
      fog: {
        density:0.04,
        gradient:2,
        color:G.Utils.hexToRgb("#afbdc9"),
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
        `,
        main: `
          vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
          vec2 uv = shadowCoord.xy;
          vec4 shadow = texture2D( uShadowMap, uv.xy );
          float visibility = 1.0;

          if ( shadow.r < shadowCoord.z - 0.005){
            visibility = 0.5;
          }
          `,
          end: `
          gl_FragColor = vec4(vec3(visibility) * vec3(1.0), 1.0);
          // gl_FragColor = vec4( vec3(visibility) *finalColor.rgb + light, finalColor.a);


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
