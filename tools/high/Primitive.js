import Sphere from 'primitive-sphere';

const primtives = {
  quad: (width = 1, height = 1) => {
    const positions = [
      -1, -1,0,
      -1, 1,0,
      1, 1,0,
      1, -1,0
    ];
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] *= width;
      positions[i + 1] *= height;
    }
    const indices = [0, 1, 2, 0, 2, 3];
    const normals = [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
    ];
    const uvs = [
      0, 1,
      0, 0,
      1, 0,
      1, 1
    ];

    return {
      positions,
      indices,
      normals,
      uvs
    }



  },
  plane: (width = 1, height = 1, widthSegments = 1, heightSegments = 1) => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const positions = [
      -0.5, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5, 0.5, 0.0,
    ];
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] *= width;
      positions[i + 1] *= height;
    }
    const indices = [3, 2, 1, 3, 1, 0];
    const normals = [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
    ];
    const uvs = [
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];
    return {
      positions,
      indices,
      normals,
      uvs
    }
  },
  sphere : (size, segments) => {

    return new Sphere(size, {
      segments
    });

  }
}
export default primtives;
