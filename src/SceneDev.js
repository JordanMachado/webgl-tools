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
import colorScheme from 'color-scheme'
import sphere from './sphere'

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

    this.mouse = {
      x:0,
      y:0,
    }
    window.addEventListener('mousemove', (e)=> {
      this.mouse.x = ((e.clientX/ window.innerWidth) - 0.5 )* 2;
      this.mouse.y = -((e.clientY/ window.innerWidth) - 0.5 )* 2;
      this.mouse.x *=5;
      this.mouse.y *=5;

    });

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);


    this.controls = new OrbitalCameraControl(this.camera, 10, window);

    if(Query.debug) {
      this.screenshot = new Screenshot(this);

    }
    this.fboHelper = new G.FBOHelper(this.webgl);


    this.composer = new G.Composer(this.webgl, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    this.composer.add(new G.FXAAPass())
    this.composer.add(new G.NoisePass({
      uSpeed:1,
      uAmount:0.2,
    }))
    this.composer.add(new G.InvertPass())

    this.composer.add(new G.BloomPass({amount:3}))

    this.scene = new G.Object3D();


    // console.log(G.ObjParser(sphere),G.ArrayUtils.flatten(this.centers).length);
    const primitive = G.ObjParser(sphere);

    console.log(primitive);
    const faces = G.ArrayUtils.generateFaces(primitive.positions, primitive.indices);


    function center(a,b,c) {
      var centerX = ((a[0] + b[0] + c[0]) / 3);
      var centerY = ((a[1] + b[1] + c[1]) / 3);
      var centerZ = ((a[2] + b[2] + c[2]) / 3);
      return [centerX, centerY, centerZ];
    }

    this.colors = [
      G.Utils.hexToRgb('#A684EE'),
      G.Utils.hexToRgb('#8775AD'),
      G.Utils.hexToRgb('#492593'),
      G.Utils.hexToRgb('#BEA2F6'),
      G.Utils.hexToRgb('#CCB7F6'),
    ]


    this.centers = new Float32Array(primitive.positions.length)
    this.uvsCenter = new Float32Array(primitive.uvs.length)
    let count = 0;
    this.points = [];
    let counter = 0;
    for (var i = 0; i < faces.length; i++) {
      let face = faces[i];
      let _center = center(face.vertices[0],face.vertices[1],face.vertices[2])

      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.points.push({
          x:_center[0],
          y:_center[1],
          z:_center[2],
          oldx:_center[0],
          oldy:_center[1],
          oldz:_center[2],
          pinned:false
        })
      for (var l = 0; l < 3; l++) {
        this.centers[count] = _center[0]
        this.centers[count +1] = _center[1]
        this.centers[count +2] = _center[2]

        this.uvsCenter[ count* 2 + 0] = (counter % 12) / 12;
        this.uvsCenter[ count * 2 + 1] = Math.floor(counter / 12) / 12;
        // console.log((counter % 24) / 24, Math.floor(counter / 24) / 24);
        // count += 3;
        // counter++;

      }

    }
    this.points.push({
      x:0,
      y:0,
      z:0,
      oldx:0,
      oldy:0,
      oldz:0,
      pinned:false
    })
    console.log(this.centers.length);

    this.sticks = [];
    for (var i = 0; i < this.points.length; i++) {

        this.sticks.push({
          p0: this.points[i],
          p1: this.points[this.points.length-1],
          length: this.distance(this.points[this.points.length-1], this.points[i])
        })
    }
    const dataText = this.dataText = new G.Texture(gl);
    dataText.format = gl.RGB;
    dataText.type = gl.FLOAT;
    // dataText.repeat()
    dataText.uploadData(this.centers, 12,12);
    this.fboHelper.attach(dataText)

    console.log(primitive);
    const geo = new G.Geometry(G.Primitive.sphere(SuperConfig.config.sphereSize,12));
    // const geo = new G.Geometry(primitive);
    // geo.generateFaces();


    geo.addAttribute('centers', this.centers)
    // geo.addAttribute('uvsCenters', this.uvsCenter)

    const mat = new G.Shader(
    glslify('./shaders/base.vert'),
    glslify('./shaders/base.frag'),
    {
      uTexture:dataText,
      uForce: SuperConfig.config.forceMultiplier
    })
    this.mesh = new G.Mesh(geo, mat);
    this.mesh.drawType = gl[SuperConfig.config.drawType];

    // this.scene.addChild(this.mesh);


    //
    this.points[this.points.length-1].pinned = true;

    this.tick = 0;
    window.r = 0
    setInterval(()=>{
      window.r = Math.random() * (5+5) - 5;
    },1000)



    this.quad = new G.Mesh(new G.Geometry(G.Primitive.plane()), new G.BasicMaterial());
    this.scene.addChild(this.quad)

    this.sphere = new G.Mesh(new G.Geometry(G.Primitive.sphere()), new G.BasicMaterial());
    this.sphere.scale.set(0.2)
    this.scene.addChild(this.sphere)

    // this.hitDetect = new G.HitDetect(this.quad, this.camera)



  }
  distance(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dz = b.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  updatePoints() {
    const friction = SuperConfig.config.friction
    for (var i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if(!p.pinned) {
        let vx = (p.x - p.oldx) * friction;
        let vy = (p.y - p.oldy) * friction - SuperConfig.config.gravity;
        let vz = (p.z - p.oldz) * friction;

        p.oldx = p.x;
        p.oldy = p.y;
        p.oldz = p.z;
        p.x+= vx;
        p.y+= vy;
        p.z+= vz;
      }

    }
  }
  updateStiks() {
    for (var i = 0; i < this.sticks.length; i++) {
      const s = this.sticks[i];
      let dx = s.p1.x - s.p0.x;
      let dy = s.p1.y - s.p0.y;
      let dz = s.p1.z - s.p0.z;
      let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      let diff = s.length - distance;
      let percent = diff / distance /2;

      let offsetX = dx* percent;
      let offsetY = dy* percent;
      let offsetZ = dz* percent;
      if(!s.p0.pinned) {
        s.p0.x -=offsetX;
        s.p0.y -=offsetY;
        s.p0.z -=offsetZ;

      }
      if(!s.p1.pinned) {
        s.p1.x +=offsetX;
        s.p1.y +=offsetY;
        s.p1.z -=offsetZ;

      }
    }
  }

  render() {
    this.tick+= 0.05;
    if(this.controls)
    this.controls.update();

    this.webgl.clear();
    this.updatePoints();
    this.updateStiks();

    let count = 0;
    for (var i = 0; i < this.points.length; i++) {
      for (var j = 0; j < 3; j++) {
    //
        this.centers[count] = this.points[i].x
        this.centers[count +1] = this.points[i].y
        this.centers[count +2] = this.points[i].z
    //
        count+=3;
      }
    }
    this.dataText.uploadData(this.centers, 15,15);



    G.State.enable(gl.DEPTH_TEST);
    if(Query.config.postPro) {
      this.composer.render(this.scene, this.camera);
    } else {
      this.webgl.render(this.scene, this.camera);
    }

    // this.fboHelper.render();
    this.points[this.points.length-1].x += (this.mouse.x - this.points[this.points.length-1].x) * 0.1
    this.points[this.points.length-1].y += (this.mouse.y - this.points[this.points.length-1].y) * 0.1
    // this.quad.position.x = 2;


    // this.sphere.position.set(this.hitDetect.hit[0],this.hitDetect.hit[1],this.hitDetect.hit[2])


  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
