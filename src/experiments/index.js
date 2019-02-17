import ParticlesScene from './particles/Scene.js';
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
  }
}

export default experiments;
