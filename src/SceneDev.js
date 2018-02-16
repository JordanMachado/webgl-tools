import G from './gl';
const glslify = require('glslify');
import deviceType from 'ua-device-type';
window.ddevice = deviceType(navigator.userAgent);

import OrbitalCameraControl from 'orbital-camera-control';
import Query from './dev/Query';
import SuperConfig from './dev/SuperConfig';

import Screenshot from './dev/Screenshot';
import PingPong from './gl/utils/PingPong';
import { mat4, mat3 } from 'gl-matrix';
import colorScheme from 'color-scheme'

if(Query.verbose) {
  G.debug.verbose = true;
}

export default class Scene {
  constructor() {
    window.scene = this;
    this.webgl = new G.Webgl();
    this.time = 0
    this.bgC = '#000000';
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.lookAt([0,0,100],[0,0,0])

    this.controls = new OrbitalCameraControl(this.camera.view, 40, window);

    if(Query.debug) {
      this.screenshot = new Screenshot(this);
    }

    this.composer = new G.Composer(this.webgl, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

    this.fxaa = new G.FXAAPass({
      uResolution: [window.innerWidth, window.innerHeight]
    });
    this.composer.add(this.fxaa)

    //
    this.toon = new G.ToonPass({
      uResolution: [window.innerWidth * 2, window.innerHeight * 2]
    });
    // this.composer.add(this.toon)
    this.invert = new G.InvertPass();

    this.contrast = new G.BrightnessContrastPass({
      uBrightness:-0.1,
      uContrast:0.8,
    });

    this.tilt = new G.TiltPass();


    this.noise = new G.NoisePass();
    this.bloom = new G.BloomPass({
      amount:2
    });
    this.composer.add(this.bloom)
    this.composer.add(this.tilt)

    // this.composer.add(this.noise)
    // this.composer.add(this.invert)




    this.fboHelper = new G.FBOHelper(this.webgl);

    let width, height;
    width = height = ddevice ==='desktop'? 256 : 256;

    const positions = new Float32Array(width * height * 3)
    const colors = new Float32Array(width * height * 3)
    const uvs = new Float32Array(width * height * 2);
    // A684EE	8775AD	492593	BEA2F6	CCB7F6
    this.colors = [
      G.Utils.hexToRgb('#A684EE'),
      G.Utils.hexToRgb('#8775AD'),
      G.Utils.hexToRgb('#492593'),
      G.Utils.hexToRgb('#BEA2F6'),
      G.Utils.hexToRgb('#CCB7F6'),
    ]

    var scm = new colorScheme();
    scm.from_hue(Math.random()* 255)
   .scheme('triade')
   .distance(0.1)
   .add_complement(false)
   .variation('pastel')
   .web_safe(true);

this.colors = scm.colors();
console.log(this.colors);
this.colors= this.colors.map((color )=> {
  // console.log(color, ;
  return G.Utils.hexToRgb('#'+color)
});
console.log(this.colors);
let bgColor = this.colors[Math.floor(Math.random() * this.colors.length)]
bgColor = bgColor.map(c =>{
  return c * 0.1
})
this.webgl.clearColor(bgColor);



    let count = 0;


      var a            = SuperConfig.config.a;
      var b            = SuperConfig.config.b;
      var c            = SuperConfig.config.c;
      var interval     = SuperConfig.config.interval;
      var x = 0.1, y = 0.1, z = 0.1;
      var newX, newY, newZ, minX, minY, minZ, maxX, maxY, maxZ;
      newX = x, newY = y, newZ = z;
      minX = minY = minZ = Infinity;
      maxX = maxY = maxZ = -Infinity;


    for (var i = 0; i < width * height * 3; i+=3) {
      const r = Math.random() * (Math.PI*2);

      newX = x - (a * x) * interval + (a * y) * interval;
      newY = y + (b * x) * interval - y * interval - (z * x) * interval;
      newZ = z - (c * z) * interval + (x * y) * interval;

      minX = Math.min(minX, newX);
      minY = Math.min(minY, newY);
      minZ = Math.min(minZ, newZ);

      maxX = Math.max(maxX, newX);
      maxY = Math.max(maxY, newY);
      maxZ = Math.max(maxZ, newZ);
      // console.log( Math.cos(r));

      positions[i] = newX;
      positions[i + 1] = newY;
      positions[i + 2] = newZ -b;

       x = newX, y = newY, z = newZ;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      // console.log(color);
      // console.log(color,Math.floor(Math.random() * this.colors.length-1));
      colors[count * 3 + 0] = color[0];
      colors[count * 3 + 1] = color[1];
      colors[count * 3 + 2] = color[2];

      uvs[count * 2 + 0] = (count % width) / width;
      uvs[count * 2 + 1] = Math.floor(count / width) / height;

       count++;
    }

    const dataText = new G.Texture(gl);
    dataText.repeat()
    dataText.format = gl.RGB;
    dataText.type = gl.FLOAT;
    dataText.uploadData(positions, width, height);
    this.fboHelper.attach(dataText)

    const geometry = new G.Geometry({
      positions,
      uvs,
      flat:true
    });
    geometry.addAttribute('colors', colors, true)
    const material = new G.Shader(
    glslify('./shaders/attractor.vert'),
    glslify('./shaders/attractor.frag'),
    {
      uPointSize:2.
    })

    this.strangeAttractor = new G.Mesh(geometry, material);
    console.log(geometry);
    this.strangeAttractor.drawType = gl.POINTS;



    const primitive = G.Primitive.sphere();
    const geo = new G.Geometry(primitive);
    console.log(geo);



    this.scene = new G.Object3D();

    this.meshes = [];
    for (var i = 0; i < 50; i++) {
      const mat = new G.Shader(
      glslify('./shaders/base.vert'),
      glslify('./shaders/base.frag'),
      {
        uPosition:dataText,
        uUVpos:[0,0.0],
        uColor: this.colors[Math.floor(Math.random() * this.colors.length)]
      })


      const mesh = new G.Mesh(geo, mat);
      mesh.scale.set(Math.random() * 0.5)
      mesh.uvOffset = [0,Math.random()]
      // 1/256
      mesh.time = 0.0039062500 * (Math.floor(Math.random()* 256))
      mesh.y = 0


      this.scene.addChild(mesh);
      this.meshes.push(mesh);
    }
    // this.mesh = new G.Mesh(geo, mat);







    this.scene.addChild(this.strangeAttractor);
    // this.scene.addChild(this.mesh);
    this.y = 0;

  }

  render() {

    this.controls.update();
    this.webgl.clear();

    // console.log(this.mesh.shader.uniforms.uUVPOS);

    for (var i = 0; i < this.meshes.length; i++) {
      // console.log(this.meshes[i].material);
      // console.log( this.meshes[i].uvOffset[0]);
      this.meshes[i].time += 0.00390625;
      if(this.meshes[i].time >=1) {
        this.meshes[i].time  = 0.0000;
        this.meshes[i].y += 0.00390625;
      }

      this.meshes[i].shader.uniforms.uUVpos = [this.meshes[i].time + this.meshes[i].uvOffset[0],this.meshes[i].y + this.meshes[i].uvOffset[1]]
      // console.log(this.meshes[i].shader.uniforms.uUVpos);
    }
    // this.mesh.shader.uniforms.uUVpos = [this.time,this.y]
    // console.log(this.mesh.shader.uniforms.uUVPOS);
    G.State.enable(gl.DEPTH_TEST);
    if(Query.config.postPro) {
      this.composer.render(this.scene, this.camera);
      this.composer.toScreen();
    } else {
      this.webgl.render(this.scene, this.camera);
    }
    G.State.disable(gl.DEPTH_TEST);
    this.fboHelper.render();



  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
