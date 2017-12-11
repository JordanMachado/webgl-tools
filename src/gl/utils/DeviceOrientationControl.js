// DeviceOrientationControl.js

import { mat4, quat, vec3 } from 'gl-matrix';

const rad = function (degree) {
	return degree * Math.PI / 180;
};

class DeviceOrientationControl {
	constructor(mViewMatrix) {
		this._mtxTarget = mViewMatrix;
		this._rotation = mat4.create();

		this._hasSet = false;
		this._alpha = 0;
		this._beta = 0;
		this._gamma = 0;
		this.easing = 0.1;

		this._init();
		this.connect();
	}


	_init() {
		this.enabled = true;

		this.deviceOrientation = {};
		this.screenOrientation = 0;

		this.alphaOffsetAngle = 0;

		this.onScreenOrientationChangeBind = (e) => this._onScreenOrientationChange(e);
		this.onDeviceOrientationChangeBind = (e) => this._onDeviceOrientationChange(e);
	}


	connect() {
		this.onScreenOrientationChangeBind();

		window.addEventListener('orientationchange', this.onScreenOrientationChangeBind, false);
		window.addEventListener('deviceorientation', this.onDeviceOrientationChangeBind, false);

		this.enabled = true;
	}


	disconnect() {

		window.removeEventListener('orientationchange', this.onScreenOrientationChangeBind, false);
		window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeBind, false);
		this.enabled = false;
	}


	update() {
		const alpha = this.deviceOrientation.alpha ? rad(this.deviceOrientation.alpha) + this.alphaOffsetAngle : 0;
		const beta = this.deviceOrientation.beta ? rad(this.deviceOrientation.beta) : 0;
		const gamma = this.deviceOrientation.gamma ? rad(this.deviceOrientation.gamma) : 0;
		const orient = this.screenOrientation ? rad(this.screenOrientation) : 0;

		if(!this._hasSet) {
			this._alpha = alpha;
			this._beta = beta;
			this._gamma = gamma;
		} else {
			this._alpha += (alpha - this._alpha) * this.easing;
			this._beta += (beta - this._beta) * this.easing;
			this._gamma += (gamma - this._gamma) * this.easing;
		}

		this.setObjectQuaternion(this._alpha, this._beta, this._gamma, orient);
	}

	setObjectQuaternion(alpha, beta, gamma, orient) {
		const q = quat.create();
		const zee  = vec3.create();
		const q0 = quat.create();
		const q1 = quat.create();

		zee[2] = 1;

		// YXZ
		const euler = {
			x: beta,
			y: alpha,
			z: -gamma
		};

		const c1 = Math.cos(euler.x / 2);
		const c2 = Math.cos(euler.y / 2);
		const c3 = Math.cos(euler.z / 2);
		const s1 = Math.sin(euler.x / 2);
		const s2 = Math.sin(euler.y / 2);
		const s3 = Math.sin(euler.z / 2);

		const x = s1 * c2 * c3 + c1 * s2 * s3;
		const y = c1 * s2 * c3 - s1 * c2 * s3;
		const z = c1 * c2 * s3 - s1 * s2 * c3;
		const w = c1 * c2 * c3 + s1 * s2 * s3;

		quat.set(q, x, y, z, w);
		quat.set(q1, Math.sqrt(0.5), 0, 0, -Math.sqrt(0.5));

		quat.setAxisAngle(q0, zee, -orient);

		quat.multiply(q, q, q1);
		quat.multiply(q, q, q0);

		quat.invert(q, q);
		mat4.fromQuat(this._mtxTarget, q);
		mat4.fromQuat(this._rotation, q);
	}

	//	Event handlers

	_onScreenOrientationChange(e) {
		this.screenOrientation = window.orientation || 0;
	}

	_onDeviceOrientationChange(e) {
		this.deviceOrientation = event;

		this.update();
	}


	get rotation() {	return this._rotation;	}

}


export default DeviceOrientationControl;
