import G from './gl';
const glslify = require('glslify');
import deviceType from 'ua-device-type';
window.ddevice = deviceType(navigator.userAgent);

import OrbitalCameraControl from './gl/utils/OrbitalCameraControl';
import Query from './dev/Query';
import SuperConfig from './dev/SuperConfig';

import Screenshot from './dev/Screenshot';
import PingPong from './gl/utils/PingPong';
import { mat4, mat3 } from 'gl-matrix';
import colorsPalette from 'nice-color-palettes'



if(Query.verbose) {
  G.debug.verbose = true;
}



    function relative(offset) {
      return (point, index, list) => {
        index = Math.min(Math.max(index + offset, 0), list.length-1);
        return list[index]
      }
    }

    function duplicate(nestedArray, mirror) {
      var out = []
      nestedArray.forEach(x => {
        let x1 = mirror ? -x : x
        out.push(x1, x)
      })
      return out;
    }
    function createIndices(length) {
      let indices = new Uint16Array(length * 6)
      let c = 0, index = 0
      for (let j=0; j<length-1; j++) {
        let i = index
        indices[c++] = i + 0
        indices[c++] = i + 1
        indices[c++] = i + 2
        indices[c++] = i + 2
        indices[c++] = i + 1
        indices[c++] = i + 3
        index += 2
      }
      return indices
    }


export default class Scene {
  constructor() {
    const _colors = [
      ["#452632", "#91204d", "#e4844a", "#e8bf56", "#e2f7ce"],
      ["#c2412d", "#d1aa34", "#a7a844", "#a46583", "#5a1e4a"],
      ["#00a8c6", "#40c0cb", "#f9f2e7", "#aee239", "#8fbe00"],
      ["#1b325f", "#9cc4e4", "#e9f2f9", "#3a89c9", "#f26c4f"]
    ]
    const colors = _colors[Math.floor(Math.random()* _colors.length)];
    // const colors = colorsPalette[Math.floor(Math.random()* colorsPalette.length)];
    // const colors =
    // const colors =
    // const colors =
    // const colors =

    this.mouse = {
      x:0,
      y:0,
    }
    this.mouseEase = {
      x:0,
      y:0,
    }
    window.addEventListener('mousemove', (e)=> {
      this.mouse.x = ((e.clientX/ window.innerWidth) - 0.5 )* 2;
      this.mouse.y = -((e.clientY/ window.innerWidth) - 0.5 )* 2;
      this.mouse.x *= 10;
      this.mouse.y *= 2;

    });
    window.addEventListener('touchmove', (e)=> {
      this.mouse.x = ((e.touches[0].clientX/ window.innerWidth) - 0.5 )* 2;
      this.mouse.y = -((e.touches[0].clientY/ window.innerWidth) - 0.5 )* 2;
      this.mouse.x *= 10;
      this.mouse.y *= 2;

    });

    window.scene = this;
    this.webgl = new G.Webgl();
    this.time = 0
    this.bgC = '#ffffff';
    this.webgl.append();
    this.webgl.clearColor(colors[0], 1)

    this.mouse = {
      x:0,
      y:0,
    }


    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

    let s = 8;
    this.cameraShadow = new G.PerspectiveCamera(45, 1, 0.1, 100);
    // this.cameraShadow =  new G.OrthographicCamera(-s,s,-s,s, 1, 50);
    this.cameraShadow.lookAt([0,20,1], [0,0,0], [0,1,0]);
    this.mvpDepth = mat4.create();
    mat4.multiply(this.mvpDepth, this.cameraShadow.projection, this.cameraShadow.view)
    const biaMatrix = mat4.fromValues(
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.5, 0.5, 0.5, 1.0
      );
    mat4.multiply(this.mvpDepth, biaMatrix, this.mvpDepth);


    this.controls = new OrbitalCameraControl(this.camera, 20, window);
    this.fbo = new G.FrameBuffer(gl, 1024, 1024 , { depth: true});



    this.scene = new G.Object3D();

    this.quad = new G.Mesh(new G.Geometry(G.Primitive.plane(10,10, 30, 30)), new G.BasicMaterial({
      color: G.Utils.hexToRgb(colors[1]),
      uniforms: {
        uShadowMap: this.fbo.depth,
        uShadowMatrix: this.mvpDepth,
      },
      fog: {
        density:0.04,
        gradient:2,
        color:[0,0,0]
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
          // gl_FragColor = vec4(vec3(visibility) * vec3(1.0), 1.0);
          gl_FragColor = vec4( vec3(visibility) *finalColor.rgb + light, finalColor.a);


          `

      }
    }));
    this.quad.scale.set(10);
    // this.quad.scale.set(2);

    this.quad.position.y = -5;
    this.quad.rotation.x = Math.PI/180 * -90
    this.scene.addChild(this.quad)



   let width = SuperConfig.config.textureSize;
   let height = SuperConfig.config.textureSize;

    this.hitDetect = new G.HitDetect(this.quad, this.camera)


    const shader = new G.Shader(
      `
          precision highp float;

          attribute vec3 aPosition;
          attribute vec2 aUv;

          attribute float aDirection;
          attribute float aUvy;

          uniform mat4 uShadowMatrix;
          varying vec4 vShadowCoord;

          uniform mat4 projectionMatrix;
          uniform mat4 viewMatrix;
          uniform mat4 worldMatrix;
          uniform float aspect;
          uniform float thickness;
          uniform float width;
          uniform float height;
          uniform int miter;
          uniform sampler2D uBuff;
          varying vec2 vUv;
          varying vec3 vColor;
          varying float vLife;

          void main() {
              vUv = aUv;
              vLife = texture2D(uBuff, vec2(vUv.x, aUvy)).w;
             vec3 pos = texture2D(uBuff, vec2(vUv.x, aUvy)).xyz;
             vec3 prev = texture2D(uBuff, vec2(vUv.x - 2.0/width,aUvy)).xyz;
             vec3 next = texture2D(uBuff, vec2(vUv.x + 1.0/width,aUvy)).xyz;
             vec2 aspectVec = vec2(aspect, 1.0);
             mat4 projViewModel = projectionMatrix * viewMatrix * worldMatrix;
             vec4 previousProjected = projViewModel * vec4(prev, 1.0);
             vec4 currentProjected = projViewModel * vec4(pos, 1.0);
             vec4 nextProjected = projViewModel * vec4(next, 1.0);
             //
             vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;
             vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;
             vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;
             //
             float len = thickness;
             float orientation = aDirection;
             gl_Position = vec4(1.);

              //starting point uses (next - current)
              vec2 dir = vec2(0.0);
              if (currentScreen == previousScreen) {
                dir = normalize(nextScreen - currentScreen);
              }
              //ending point uses (current - previous)
              else if (currentScreen == nextScreen) {
                dir = normalize(currentScreen - previousScreen);
              }
              //somewhere in middle, needs a join
              else {
                //get directions from (C - B) and (B - A)
                vec2 dirA = normalize((currentScreen - previousScreen));
                if (miter == 1) {
                  vec2 dirB = normalize((nextScreen - currentScreen));
                  //now compute the miter join normal and length
                  vec2 tangent = normalize(dirA + dirB);
                  vec2 perp = vec2(-dirA.y, dirA.x);
                  vec2 miter = vec2(-tangent.y, tangent.x);
                  dir = tangent;
                  len = thickness / dot(miter, perp);
                } else {
                  dir = dirA;
                }
              }
              vec2 normal = vec2(-dir.y, dir.x);
              normal *= len/2.0;
              normal.x /= aspect;

              vec4 offset = vec4(normal * orientation, 0.0, 1.0);
              gl_Position = currentProjected + offset;
              gl_PointSize = 1.0;
              vColor = pos;






          }
      `,
      `

        precision highp float;
        varying vec2 vUv;
        varying float vLife;
        varying vec3 vColor;
        uniform sampler2D uBuff;
        uniform vec3 uColorStart;
        uniform vec3 uColorEnd;




        void main() {



          gl_FragColor = vec4(mix(vec3(uColorStart), vec3(uColorEnd), vUv.x), vLife);
        }

      `,
      {
        aspect: window.innerWidth / window.innerHeight,
        thickness: SuperConfig.config.thickness,
        miter: 0.4,
        width: width,
        height: height,
        uShadowMap: this.fbo.depth,
        uShadowMatrix: this.mvpDepth,
        uColorStart:G.Utils.hexToRgb(colors[2]),
        uColorEnd:G.Utils.hexToRgb(colors[3]),
      },
      'Lines'
    )



    this.fboHelper = new G.FBOHelper(this.webgl);

    this.fboHelper.attach(this.fbo.colors);




   let path = []
   let uvs = [];
   let uvsy = [];
   for (var i = 0; i < width/6; i++) {
     path.push([0,0,0]);
     uvs.push([i / width, 1./height]);
     uvs.push([i / width, 1./height]);


   }
   for (var i = 0; i < height; i++) {
     uvsy.push(i/width);
     uvsy.push(i/width);
   }
   const position = duplicate(path)
   const directions = duplicate(path.map(x => 1), true)
   const indexBuffer = createIndices(path.length);

   const geometry = this.geometry = new G.Geometry();
   geometry.addAttribute('positions', position)
   geometry.addAttribute('directions', directions)
   geometry.addIndices(indexBuffer, true);
   geometry.addInstancedAttribute('uvys', uvsy, 1);
   geometry.addAttribute('uvs', uvs)
   geometry.addCount(uvsy.length)

   this.lines = new G.Mesh(geometry,shader);
   this.lines.position.y = 2;
   this.scene.addChild(this.lines);

   let dataPos = new Float32Array(width * height * 4);
   let count = 0;
   let row = 0;
   let lifes = [];
   for (var i = 0; i < height; i++) {
lifes.push(Math.random())
   }
   let r = Math.random()
   let rr = 1;
   for (let i = 0, l = width * height * 4; i < l; i += 4) {
     // if((count % width) / width <= 1.0/width) {

     // }
     if((count) % height ===0) {
       row++;
       r =  Math.random()

     }

     dataPos[count * 4 + 0] = Math.cos(Math.PI*2 * r) * r * (rr +rr) - rr
     dataPos[count * 4 + 1] = Math.sin(Math.PI*2 * r) * r * (rr +rr) - rr
     dataPos[count * 4 + 2] = r * (rr +rr) - rr


     dataPos[count * 4 + 3] = lifes[row]

     // console.log(row);




      count++;
   }

   let dataTexture = new G.Texture(gl);
   dataTexture.format = gl.RGBA;
   dataTexture.type = gl.FLOAT;
   dataTexture.uploadData(dataPos, width, height)
   this.fboHelper.attach(dataTexture);

   this.gpu = new PingPong({
     data:dataTexture,
     width,
     height,
     renderer:this.webgl,
     camera: new G.OrthographicCamera(-1,1,-1,1,0.1,100),
     vs: glslify('./shaders/line/base.vert'),
     fs: glslify('./shaders/line/sim.frag'),
     uniforms: {
     }
   })
   this.fboHelper.attach(this.gpu.fboOut.colors);

   // this.initComposer();
  }
  initComposer() {
    this.composer = new G.Composer(this.webgl, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, !!Query.debug);
    this.bloom = new G.BloomPass({amount:3})
    this.bloom.enable = true;
    this.composer.add(this.bloom)

    this.invert = new G.InvertPass({amount:3})
    this.invert.enable = true;
    this.composer.add(this.invert)
  }

  render() {

    if(this.controls)
    if(SuperConfig.config.controls) {
      this.controls.update();

    } else {
      this.camera.lookAt([this.mouseEase.x,this.mouseEase.y,18], [0,0,0], [0,1,0]);

    }


    this.webgl.clear();

    this.gpu.update()
    this.lines.shader.uniforms.uBuff = this.gpu.fboOutO.colors;


    this.fbo.bind();
      this.fbo.clear();
      G.State.disable(gl.CULL_FACE);
      this.webgl.render(this.lines,this.cameraShadow);
    this.fbo.unbind();

    this.quad.shader.uniforms.uShadowMap = this.fbo.depth;
    this.lines.shader.uniforms.uShadowMap = this.fbo.depth;

    this.mouseEase.x += (this.mouse.x - this.mouseEase.x) * 0.05;
    this.mouseEase.y += (this.mouse.y - this.mouseEase.y) * 0.05;


    G.State.enable(gl.DEPTH_TEST);
     gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);

    if(Query.config.postPro) {
      this.composer.render(this.scene, this.camera);
    } else {
      this.webgl.render(this.scene, this.camera);
    }
    gl.disable(gl.BLEND);

    // this.fboHelper.render();

  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
