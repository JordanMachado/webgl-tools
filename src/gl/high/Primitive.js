import Sphere from 'primitive-sphere';

const primtives = {
    bigTriangle: () =>
    {
        const positions = [
            -1, -1,
            -1, 4,
            4, -1,
        ];
        const indices = [2, 1, 0];

        return {
            positions,
            indices,
            flat: true,
        };
    },
    quad: (width = 1, height = 1) =>
    {
        const positions = [
            -1, -1, 0,
            -1, 1, 0,
            1, 1, 0,
            1, -1, 0,
        ];

        for (let i = 0; i < positions.length; i += 3)
        {
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
            1, 1,
        ];

        return {
            positions,
            indices,
            normals,
            uvs,
            flat: true,
        };
    },
    plane: (width = 1, height = 1, subdivisionsX = 1, subdivisionsY = 1) =>
    {
        const positions = [];
        const indices = [];
        const normals = [];
        const uvs = [];
        let index = 0;

        const spacerX = width / subdivisionsX;
        const spacerY = height / subdivisionsY;
        const offsetX = -width * 0.5;
        const offsetY = -height * 0.5;
        const spacerU = 1 / subdivisionsX;
        const spacerV = 1 / subdivisionsY;

        for (let y = 0; y < subdivisionsY; y += 1)
        {
            for (let x = 0; x < subdivisionsX; x += 1)
            {
                const triangleX = spacerX * x + offsetX;
                const triangleY = spacerY * y + offsetY;

                const u = x / subdivisionsX;
                const v = y / subdivisionsY;

                positions.push(triangleX, triangleY, 0);

                positions.push(triangleX + spacerX, triangleY, 0);

                positions.push(
                    triangleX + spacerX,
                    triangleY + spacerY,
                    0
                );
                positions.push(triangleX, triangleY + spacerY, 0);

                normals.push(0, 0, 1);
                normals.push(0, 0, 1);
                normals.push(0, 0, 1);
                normals.push(0, 0, 1);

                uvs.push(u, v);
                uvs.push(u + spacerU, v);
                uvs.push(u + spacerU, v + spacerV);
                uvs.push(u, v + spacerV);

                indices.push(index * 4 + 0);
                indices.push(index * 4 + 1);
                indices.push(index * 4 + 2);
                indices.push(index * 4 + 0);
                indices.push(index * 4 + 2);
                indices.push(index * 4 + 3);

                index += 1;
            }
        }

        return {
            positions,
            indices,
            normals,
            uvs,
            flat: true,
        };
    },
    cube: (width = 1, height = 1, depth = 1) =>
    {
        const positions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];

        for (let i = 0; i < positions.length; i += 3)
        {
            positions[i] *= width;
            positions[i + 1] *= height;
            positions[i + 2] *= depth;
        }
        const indices = [
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // back
            8, 9, 10, 8, 10, 11, // top
            12, 13, 14, 12, 14, 15, // bottom
            16, 17, 18, 16, 18, 19, // right
            20, 21, 22, 20, 22, 23, // left
        ];
        const normals = [
            // Front face
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Back face
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Top face
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Bottom face
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // Right face
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // Left face
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
        ];
        const uvs = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Back face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Top face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Right face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];

        return {
            positions,
            indices,
            normals,
            uvs,
        };
    },
    sphere: (size, segments) =>
        new Sphere(size, {
            segments,
        }),
};

export default primtives;
