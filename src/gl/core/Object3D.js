import * as glm from 'gl-matrix';
import Vector3 from '../math/Vector3';
import uuid from '../utils/UIID';

class Object3D
{
    /**
    * Constructs a new Object3D
    * @property {boolean} visible=true
    * @property {string} uuid
    * @property {object} position
    * @property {object} rotation
    * @property {object} scale
    * @property {object} parent=null
    * @property {array} children
    * @property {array} matrix
    * @property {array} matrixWorld
    * @property {array} positionWorld
    */
    constructor()
    {
        this.visible = true;
        this.uuid = uuid();

        this._needUpdate = true;

        this.position = new Vector3();

        this.rotation = new Vector3();

        this.scale = new Vector3(1, 1, 1);

        this.position.onChange(() =>
        {
            this._needUpdate = true;
            // console.log('cc');
        });
        this.rotation.onChange(() =>
        {
            this._needUpdate = true;
        });
        this.scale.onChange(() =>
        {
            this._needUpdate = true;
        });

        this._matrix = glm.mat4.create();
        this._matrixWorld = glm.mat4.create();
        this._matrixRotation = glm.mat4.create();
        this._matrixScale = glm.mat4.create();
        this._matrixTranslation = glm.mat4.create();
        this._matrixIdentity = glm.mat4.create();

        this.parent = null;
        this.children = [];
    }
    _updateMatrix()
    {
        if (!this.visible)
        {
            return;
        }

        glm.mat4.rotateX(this._matrixRotation, this._matrixIdentity, this.rotation.x);
        glm.mat4.rotateY(this._matrixRotation, this._matrixRotation, this.rotation.y);
        glm.mat4.rotateZ(this._matrixRotation, this._matrixRotation, this.rotation.z);

        glm.mat4.scale(this._matrixScale, this._matrixIdentity, this.scale.get());
        glm.mat4.translate(this._matrixTranslation, this._matrixIdentity, this.position.get());

        glm.mat4.mul(this._matrix, this._matrixTranslation, this._matrixRotation);
        glm.mat4.mul(this._matrix, this._matrix, this._matrixScale);
        this._updateMatrixWorld();
        this._needUpdate = false;
    }
    _updateMatrixWorld()
    {
        if (!this.visible)
        {
            return;
        }

        if (this.parent)
        {
            glm.mat4.multiply(this._matrixWorld, this.parent._matrixWorld, this._matrix);
        }
        else
        {
            glm.mat4.copy(this._matrixWorld, this._matrix);
        }

        for (let i = 0, l = this.children.length; i < l; i += 1)
        {
            this.children[i]._updateMatrixWorld();
        }
    }
    get positionWorld()
    {
        if (!this.parent) return this.position.get();

        return [this.parent.position.x + this.position.x,
            this.parent.position.y + this.position.y, this.parent.position.z + this.position.z];
    }
    get matrixWorld()
    {
        if (this._needUpdate) this._updateMatrix();

        return this._matrixWorld;
    }
    get matrix()
    {
        if (this._needUpdate) this._updateMatrix();

        return this._matrix;
    }
    /**
  * @func  addChild
  * @description  Add a child to the object
  * @param {object} child an Object3D
  * @memberof Object3D.prototype
  */
    addChild(object)
    {
        if (object.parent)
        {
            const ndx = object.parent.children.indexOf(this);

            if (ndx >= 0)
            {
                object.parent.children.splice(ndx, 1);
            }
        }
        object.parent = this;
        this.children.push(object);
    }
}

export default Object3D;
