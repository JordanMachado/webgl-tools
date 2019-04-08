import glm from 'gl-matrix';
import Object3D from '../core/Object3D';

export default class OrthographicCamera extends Object3D
{
    constructor(left, right, bottom, top, zNear, zFar)
    {
        super();

        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
        this.zNear = zNear;
        this.zFar = zFar;
        this._projection = glm.mat4.create();
        this._view = glm.mat4.create();

        this._projection = glm.mat4.ortho(this._projection,
            left,
            right,
            bottom,
            top,
            zNear,
            zFar
        );
    }
    lookAt(aEye, aCenter, aUp = [0, 1, 0])
    {
        glm.vec3.copy(this.position, aEye);
        glm.mat4.identity(this._view);
        glm.mat4.lookAt(this._view, aEye, aCenter, aUp);
    }
    updateProjectionMatrix()
    {
        this._projection = glm.mat4.ortho(this._projection,
            this.left,
            this.right,
            this.bottom,
            this.top,
            this.zNear,
            this.zFar
        );
    }
    get aspect()
    {
        return this._apsect;
    }
    set aspect(value)
    {
        this._apsect = value;
    // this.updateProjectionMatrix();
    }

    get view() {	return this._view;	}

    get projection() {	return this._projection;	}
}
