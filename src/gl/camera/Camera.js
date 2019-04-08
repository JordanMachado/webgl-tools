import glm from 'gl-matrix';

export default class Camera
{
    constructor()
    {
        this.projection = glm.mat4.create();
        this.matrix = glm.mat4.create();
    }
}
