// TouchDetect.js

import Ray from '../math/Ray';
import { EventEmitter } from 'events';
import * as glm from 'gl-matrix';

const mat4 = glm.mat4;
const vec3 = glm.vec3;
let v0 = vec3.create(), v1= vec3.create(), v2 = vec3.create();



function getMouse(e) {
	let x, y;

	if(e.touches) {
		x = e.touches[0].pageX;
		y = e.touches[0].pageY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}


	return {
		x, y
	};
}
let t = mat4.create();
const getVector = (target, v, modelMatrix) => {
  vec3.transformMat4(target, v, modelMatrix);
};



/*
 * Raycasting for one type of object they all have the same geometry like cube / sphere
*/
class HitDetect extends EventEmitter {
	constructor(objects = [], camera) {
		super();

		this.objects = objects.length ? objects : [objects];
		this.camera = camera;



		this.ray = new Ray([0, 0, 0], [0, 0, 0]);
		this.hit = vec3.fromValues(0, 0, 0);


		this.b_onDown = this._onDown.bind(this);
		this.b_onUp = this._onUp.bind(this);
		this.b_onMove = this._onMove.bind(this);

		this._posDown = {
			x:-9999,
			y:-9999
		}


		this._posLast = {
			x:-9999,
			y:-9999
		}

		this.connect();

	}

	connect() {

		// if(Device.instance.desktop) {
			window.addEventListener('mousedown', this.b_onDown);
			window.addEventListener('mouseup', this.b_onUp);
			window.addEventListener('mousemove', this.b_onMove);
		// } else {
			window.addEventListener('touchstart', this.b_onDown);
			window.addEventListener('touchend', this.b_onUp);
			window.addEventListener('touchmove', this.b_onMove);
		// }
	}
	disconnect() {
		// if(Device.instance.desktop) {
			window.removeEventListener('mousedown', this.b_onDown);
			window.removeEventListener('mouseup', this.b_onUp);
			window.removeEventListener('mousemove', this.b_onMove);
		// } else {
			window.removeEventListener('touchstart', this.b_onDown);
			window.removeEventListener('touchend', this.b_onUp);
			window.removeEventListener('touchmove', this.b_onMove);
		// }
			this._objectHit = null;
			this._posDown.x = -999;
			this._posDown.y = -999;

			this.objects = [];


	}


	_onUp(e) {


		//
		// let dx = this._posLast.x - this._posDown.x;
		// let dy = this._posLast.y - this._posDown.y;
		// const d = Math.sqrt(dx*dx + dy*dy);
		// 	this._checkHit();
	}

	_onMove(e) {

		let mouse = getMouse(e);
		this._posDown.x = mouse.x;
		this._posDown.y = mouse.y;
		this._posLast.x = mouse.x;
		this._posLast.y = mouse.y;
		this._checkHit()

	}

	_onDown(e) {

		let mouse = getMouse(e);
		this._posDown.x = mouse.x;
		this._posDown.y = mouse.y;
		this._posLast.x = mouse.x;
		this._posLast.y = mouse.y;
		this._checkHit()

	}


	_checkHit() {


		let mx = 0,my = 0;

		const { x, y } = this._posLast;

		mx = (x / window.innerWidth) * 2.0 - 1.0;
		my = - (y / window.innerHeight) * 2.0 + 1.0;

		this.camera.generateRay([mx, my, 0], this.ray);




		let hit;

		for (var i = 0; i < this.objects.length; i++) {
			let object;

			object = this.objects[i];
			object._needUpdate = true;
			if(!object.geometry.faces) {
				object.geometry.generateFaces();
			}

			let faces = object.geometry.faces;
			for (var j = 0; j < faces.length; j++) {
				let vertices;

				vertices = faces[j].vertices;
				getVector(v0,vertices[0], object.matrixWorld)
				getVector(v1, vertices[1], object.matrixWorld)
				getVector(v2, vertices[2], object.matrixWorld)

					hit = this.ray.intersectTriangle(v0, v1, v2);
					if(hit) {
						this.hit[0] = hit[0];
						this.hit[1] = hit[1];
						this.hit[2] = hit[2];
						break;
					}
			}
		}
	}
}


export default HitDetect;
