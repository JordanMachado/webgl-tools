import ParticlesScene from './particles/Scene.js';
import SpringScene from './spring/Scene.js';
const experiments = {
  particles:{
    scene: ParticlesScene,
    config:{
      controls:true,
      name:'Particles',
    },
    manifest: [
      'assets/img/normal.png',
    ]
  },
  spring: {
  scene: SpringScene,
  config:{}
  }
}

export default experiments;
