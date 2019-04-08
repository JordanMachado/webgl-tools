import { vec3, mat4, quat } from 'gl-matrix';

const getCursorPos = function (e)
{
    if (e.touches)
    {
        return {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY,
        };
    }

    return {
        x: e.clientX,
        y: e.clientY,
    };
};

const UP = vec3.fromValues(0, 1, 0);
const ANGLE_LIMIT = (Math.PI / 2 - 0.01);

class OrbitalCameraControl
{
    constructor(camera, mRadius = 5, mListenerTarget = window)
    {
        this.camera = camera;
        this._mtxTarget = camera.view;
        this._radius = mRadius;
        this._targetRadius = mRadius;
        this._listenerTarget = mListenerTarget;
        this._isDown = false;
        this._rotation = mat4.create();
        this.center = vec3.create();

        this.easing = 0.1;
        this.senstivity = 1;
        this.senstivityRotation = 1;

        this._isLocked = false;
        this._isZoomLocked = false;
        this._rx = 0;
        this._trx = 0;
        this._prevx = 0;
        this._ry = 0;
        this._try = 0;
        this._prevy = 0;

        this._quat = quat.create();
        this._vec = vec3.create();
        this._mtx = mat4.create();

        this._mouseDown = {
            x: 0,
            y: 0,
        };

        this._mouse = {
            x: 0,
            y: 0,
        };

        this._init();
    }

    _init()
    {
        this._listenerTarget.addEventListener('mousedown', (e) => this._onDown(e));
        this._listenerTarget.addEventListener('mouseup', () => this._onUp());
        this._listenerTarget.addEventListener('mousemove', (e) => this._onMove(e));

        this._listenerTarget.addEventListener('touchstart', (e) => this._onDown(e));
        this._listenerTarget.addEventListener('touchend', () => this._onUp());
        this._listenerTarget.addEventListener('touchmove', (e) => this._onMove(e));

        this._listenerTarget.addEventListener('mousewheel', (e) => this._onWheel(e));
        this._listenerTarget.addEventListener('DOMMouseScroll', (e) => this._onWheel(e));
    }

    lock(mValue)
    {
        this._isLocked = mValue;
    }

    lockZoom(mValue)
    {
        this._isZoomLocked = mValue;
    }

    _onWheel(e)
    {
        if (this._isZoomLocked)
        {
            return;
        }
        const w = e.wheelDelta;
        const d = e.detail;
        let value = 0;

        if (d)
        {
            if (w)
            {
                value = w / d / 40 * d > 0 ? 1 : -1; // Opera
            }
            else
            {
                value = -d / 3; // Firefox;         TODO: do not /3 for OS X
            }
        }
        else
        {
            value = w / 120;
        }

        this._targetRadius += (-value * 2 * this.senstivity);
        if (this._targetRadius < 0.01)
        {
            this._targetRadius = 0.01;
        }
    }

    _onDown(e)
    {
        if (this._isLocked) {	return;	}
        this._isDown = true;

        this._mouseDown = getCursorPos(e);
        this._mouse = getCursorPos(e);

        this._prevx = this._trx = this._rx;
        this._prevy = this._try = this._ry;
    }

    _onMove(e)
    {
        if (this._isLocked) {	return;	}
        if (!this._isDown)	{	return;	}
        this._mouse = getCursorPos(e);
    }

    _onUp()
    {
        if (this._isLocked) {	return;	}
        this._isDown = false;
    }

    update()
    {
        const dx = this._mouse.x - this._mouseDown.x;
        const dy = this._mouse.y - this._mouseDown.y;

        const senstivity = 0.02 * this.senstivityRotation;

        this._try = this._prevy - dx * senstivity;
        this._trx = this._prevx - dy * senstivity;

        if (this._trx < -Math.PI / 2 + 0.01)
        {
            this._trx = -Math.PI / 2 + 0.01;
        }
        else if (this._trx > Math.PI / 2 - 0.01)
        {
            this._trx = Math.PI / 2 - 0.01;
        }

        this._rx += (this._trx - this._rx) * this.easing;
        this._ry += (this._try - this._ry) * this.easing;
        this._radius += (this._targetRadius - this._radius) * this.easing;

        quat.identity(this._quat);
        quat.rotateY(this._quat, this._quat, this._ry);
        quat.rotateX(this._quat, this._quat, this._rx);

        vec3.set(this._vec, 0, 0, this._radius);
        vec3.transformQuat(this._vec, this._vec, this._quat);

        mat4.identity(this._mtx);
        // mat4.lookAt(this._mtx, this._vec, this.center, UP);

        if (this._mtxTarget)
        {
            mat4.copy(this._mtxTarget, this._mtx);
        }
        this.camera.lookAt(this._vec, this.center, UP);
    }
}

export default OrbitalCameraControl;
