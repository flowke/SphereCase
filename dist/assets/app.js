/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time, preserve) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time) || preserve) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
		 window.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	TWEEN.now = function () {
		return new Date().getTime();
	};
}


TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _repeatDelayTime;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	this.to = function (properties, duration) {

		_valuesEnd = properties;

		if (duration !== undefined) {
			_duration = duration;
		}

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object, _object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.end = function () {

		this.update(_startTime + _duration);
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.repeatDelay = function (amount) {

		_repeatDelayTime = amount;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object, _object);
			}

			_onStartCallbackFired = true;
		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				if (_repeatDelayTime !== undefined) {
					_startTime = time + _repeatDelayTime;
				} else {
					_startTime = time + _delayTime;
				}

				return true;

			} else {

				if (_onCompleteCallback !== null) {

					_onCompleteCallback.call(_object, _object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (true) {

		// AMD
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return TWEEN;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sceneWidth = window.innerWidth > 1200 ? window.innerWidth : 1200,
    sceneHeight = 822;

module.exports = {
    initRenderer: function initRenderer() {
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(sceneWidth, sceneHeight);
        document.getElementById('sphere').appendChild(renderer.domElement);
        renderer.setClearColor(0xffffff, 0.0);
        // renderer.shadowMap.enabled = true; //允许阴影映射
        return renderer;
    },
    initCamera: function initCamera() {
        var camera = new THREE.PerspectiveCamera(45, sceneWidth / sceneHeight, 0.1, 1000);
        var view = 10;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 8;
        // camera.up.set(0,1,0);
        camera.lookAt({ x: 0, y: 0, z: 0 });
        // camera.position.z = 5;
        return { camera: camera };
    },
    initLight: function initLight() {
        var ambLight = new THREE.AmbientLight(0xffffff, 0.2);

        // let HemisphereLight = new THREE.HemisphereLight( 0x7d5252, 0x222233 );
        // let HemisphereLightHelper = new THREE.HemisphereLightHelper( HemisphereLight, 5 );

        var mainLight = new THREE.SpotLight(0xffffff, 1);
        mainLight.position.set(1, 4, 2);
        // mainLight.castShadow = true;ff

        var dL1 = new THREE.DirectionalLight(0xffffff, 0.8);
        dL1.position.set(1, 1, 1);

        var dl2 = new THREE.DirectionalLight(0xffffff, 0.3);
        dl2.position.set(1, -1, 1);

        var fillLight = new THREE.SpotLight(0xffffff, 0.7);
        fillLight.position.set(-3, -2, 1);

        var f2 = fillLight.clone();
        f2.position.set(-3, 2, 0);

        return [ambLight, mainLight, dL1, fillLight, f2, dl2];
    },
    initSmallSphereScene: function initSmallSphereScene(scene2) {

        // let scene2 = new THREE.Scene();


        var normalIco1 = this.getNormalIco(1, 1, 0x7221d7);
        scene2.add(normalIco1);
        normalIco1.position.set(5, -3, -2);

        var normalIco2 = this.getNormalIco(2, 2, 0x186b94);
        scene2.add(normalIco2);
        normalIco2.position.set(-12, -5, -22);

        var normalIco3 = this.getNormalIco(1.8, 2, 0xff79d1);
        scene2.add(normalIco3);
        normalIco3.position.set(-8, 7, -10);

        return { normalIco1: normalIco1, normalIco3: normalIco3 };
    },
    getIco: function getIco(r, d) {
        return new THREE.IcosahedronGeometry(r, d);
    },
    getNormalIco: function getNormalIco(r, d, color) {
        var geo = new THREE.IcosahedronGeometry(r, d);
        var mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
            color: color,
            shading: THREE.FlatShading
        }));
        return mesh;
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// const THREE = require('three-js')();
module.exports = {
    makeFacesGroup: function makeFacesGroup(geo) {
        var faces = geo.faces;
        var vertices = geo.vertices;

        var facesGroup = [];
        faces.forEach(function (elt) {
            var arr = [];
            arr.normal = elt.normal;
            arr.push(vertices[elt.a], vertices[elt.b], vertices[elt.c]);
            facesGroup.push(arr);
        });

        return facesGroup;
    },
    meshsToFacesGroup: function meshsToFacesGroup(meshes) {
        return meshes.map(function (mesh) {
            var arr = mesh.geometry.vertices.slice();
            arr.normal = mesh.geometry.faces[0].normal;
            return arr;
        });
    },
    originFacesPosition: function originFacesPosition(facesGroup) {

        return facesGroup.map(function (elt) {
            return elt.map(function (elt) {
                return elt.clone();
            });
        });
    },
    resetPoint: function resetPoint(facesGroup) {
        facesGroup.forEach(function (elt, i, self) {
            var _elt$center = elt.center,
                x = _elt$center.x,
                y = _elt$center.y,
                z = _elt$center.z;


            elt.forEach(function (elt, i, self) {
                elt.set(x, y, z);
            });
        });
    },
    markFaces: function markFaces(meshes) {
        var arr = [];
        meshes.forEach(function (elt, i) {

            // let geo = new THREE.IcosahedronGeometry(0.03, 1);
            var geo = new THREE.TextGeometry(i.toString(), {
                font: new THREE.Font()
            });

            var mat = new THREE.MeshPhongMaterial({
                map: texture
            });

            var mesh = new THREE.Mesh(geo, mat);

            mesh.position.x = elt.normal.x;
            mesh.position.y = elt.normal.y;
            mesh.position.z = elt.normal.z;
            arr.push(mesh);
        });
        console.log(arr[0]);
        return arr;
    },
    sceneAdd: function sceneAdd(scene, meshes) {
        meshes.forEach(function (elt) {
            scene.add(elt);
        });
    },
    setMouse: function setMouse(x, y) {
        return new THREE.Vector2(x, y);
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TWEEN = __webpack_require__(0);

var items = ['js原理', '正则表达式', '反倒是', '电风扇水电费', '发短信无法', '富兰克林', '妇女节老师', '反对虐杀', 'vwfsfdfsf'];
items = items.concat(items, items, items, items);

var pCount = 20,
    nodeIndx = 0,
    perDuration = 2500,
    inHold = false,
    canvas = document.querySelector('#fontEmitter .container.ca');

var nodePool = [];
nodePool.own = 0;
var canvas2 = document.querySelector('#fontEmitter .container.cb');
var stage = document.querySelector('#fontEmitter');

run();

function run() {
    setTimeout(function () {
        clickNode('ma');
        clickNode('mb');
        for (var i = 0; i < pCount; i++) {
            setTimeout(function () {
                getFromNodePool();
            }, Math.random() * 20000);
        }
    }, 3000);
}

function clickNode(n) {
    var wrap = document.createElement('div'),
        hover = document.createElement('a');

    wrap.appendChild(hover);
    wrap.className = 'hovMov ' + n;
    hover.className = 'hov';
    hover.href = "#";
    hover.innerHTML = items[nodeIndx % items.length];
    nodeIndx++;
    canvas2.appendChild(wrap);
    wrap.addEventListener("animationiteration", ani);
    function ani() {
        nodeIndx++;
        hover.innerHTML = items[nodeIndx % items.length];
    }
}

function getFromNodePool() {

    if (!nodePool.lenght) {
        var ani = function ani() {
            // nodePool.push(move);


            resetOne(move);
        };

        nodePool.own++;
        if (nodePool.own > pCount) {
            return null;
        }

        var wrap = document.createElement('div'),
            move = document.createElement('div'),
            rotate = document.createElement('a');

        move.appendChild(rotate);

        wrap.className = 'directionWrap';
        wrap.style.transform = 'rotateZ(' + (0.5 - Math.random()) * 60 + 'deg)';

        move.sub = rotate;
        move.addEventListener("animationiteration", ani);


        nodePool.push(move);
    }

    var node = nodePool.shift();

    resetOne(node);

    canvas.appendChild(node);
    return node;
}

function resetOne(node) {
    node.style.transform = 'scale(' + (Math.random() * 1.4 + 0.1) + ') translate3d(0px,' + -1 * (Math.random() * 50) + 'px,0px)';

    node.style.left = Math.random() * 50 + 'px';
    node.style.bottom = Math.random() * 150 + 'px';
    node.className = 'move';
    node.sub.className = 'rotate';
    node.sub.innerHTML = items[nodeIndx % items.length];
    nodeIndx++;
}
//
// let emitPos = {
//     x: 0,
//     y: canvas.clientHeight
// }
//
// let starPoint = [
//     {x: emitPos.x, y: emitPos.y-100},
//     {x: emitPos.x, y: emitPos.y-50},
//     {x: emitPos.x+50, y: emitPos.y},
//     {x: emitPos.x+50, y: emitPos.y-50}
// ];
//
// let endPoint = [
//     {x: emitPos.x + 220, y: emitPos.y -100},
//     {x: emitPos.x + 240, y: emitPos.y- 150},
//     {x: emitPos.x+ 200, y: emitPos.y - 220},
//     {x: emitPos.x+ 280, y: emitPos.y- 150}
// ]
//
//
// // firstRound();
//
// function firstRound(){
//     let i = 0;
//     let timer = setInterval(()=>{
//         i++;
//         if(i>pCount){
//             clearInterval(timer);
//         }
//
//         emitOne();
//
//         // console.log(i)
//
//     },1500);
// }
//
//
//
//
// function emitOne(){
//     let node = getNode();
//
//     if(node===null){
//         console.log('等待生产');
//         return;
//     }
//     animateWidthPath(node);
//
// }
//
// function getNode(){
//
//     if(!nodePool.length){
//
//         if(nodePool.own>pCount){
//             return null;
//         }
//
//         nodePool.own++;
//         let node = document.createElement('a');
//
//
//
//         node.additionProperty = {
//             inHold : false,
//             opacity : 0,
//             pos : {x: emitPos.x, y: emitPos.y},
//             vec2:  {
//                 x: Math.random(),
//                 y: Math.random()
//             }
//         }
//
//         node.onmouseover = function(){
//             this.inHold = true;
//             this.tween1.stop();
//             this.tween2.stop();
//             // this.className = 'animated swing';
//
//
//
//         }
//         node.onmouseout = function(){
//             this.inHold = false;
//             this.tween1.start();
//             this.tween2.start();
//             this.className = '';
//
//
//
//         }
//
//         nodePool.push(node);
//     }
//
//     let node = nodePool.shift();
//
//     node.innerHTML = items[nodeIndx % items.length];
//
//     let x = starPoint[nodeIndx % starPoint.length].x;
//     let y = starPoint[nodeIndx % starPoint.length].y;
//     node.style.left = x;
//     node.style.left = y;
//     node.style.fontSize = Math.random()*3 + 9+'px';
//
//     node.className = 'tran1'
//
//     nodeIndx++;
//
//
//
//     node.additionProperty.pos = {x:x,y:y }
//
//     canvas.appendChild(node);
//
//
//
//     return node;
// }
//
//
// function animateWidthPath(node){
//
//     let sTime = Date.now();
//
//     let addiP = node.additionProperty;
//
//     let start = {
//         opacity : 0,
//         x: addiP.pos.x,
//         y: addiP.pos.y,
//         rotation: -70
//     }
//
//
//
//     let ep = endPoint[nodeIndx%endPoint.length];
//
//     let end = {
//         opacity : 0,
//         x: ep.x,
//         y: ep.y,
//         rotation: -60
//     }
//
//
//
//     // console.log(end.x,end.y)
//     let mid = {
//         x: 300 + (0.5-Math.random()*80),
//         y: 180 + (0.5-Math.random()*130),
//         opacity: 0.7,
//         rotation: 0
//     };
//
//     node.tween1 = new TWEEN.Tween(start)
//     .to(mid, 3000)
//     .easing(TWEEN.Easing.Linear.None)
//     .onUpdate(function(){
//
//         // node.style.left = this.x+'px';
//         // node.style.top = this.y+'px';
//         // node.style.opacity = this.opacity;
//         // node.style.transform = 'rotate('+ this.rotation +'deg)';
//
//     })
//     ;
//
//     node.tween2 = new TWEEN.Tween(mid)
//     .to(end, 2500 )
//     .easing(TWEEN.Easing.Linear.None)
//     .onUpdate(function(){
//
//         // node.style.left = this.x+'px';
//         // node.style.top = this.y+'px';
//         // node.style.opacity = this.opacity;
//         // node.style.transform = 'rotate('+ this.rotation +'deg)'
//
//     })
//     .onComplete(function(){
//         canvas.removeChild(node);
//         nodePool.push(node);
//         setTimeout(()=>{
//             emitOne();
//         },Math.random*2000)
//
//     })
//     ;
//
//     node.tween1.chain(node.tween2);
//     // node.tween2.chain(node.tween1);
//     node.tween1.start();
//
//     // let timer = setInterval(()=>{
//     //
//     //     if(Date.now()-sTime > perDuration){
//     //         clearInterval(timer);
//     //         nodePool.push(node);
//     //         canvas.removeChild(node);
//     //     }
//     //
//     //     if(node.inHold===true){
//     //         clearInterval(timer);
//     //         node.className = 'f-hold';
//     //     }
//     //
//     //     curtPos.x += vec2.x ;
//     //     curtPos.y += vec2.y ;
//     //
//     //     node.style.left = curtPos.x;
//     //     node.style.top = curtPos.y;
//     //
//     //
//     // }, 20);
//
// }
//
// function getRandomOriPos(){
//     let seed = 40;
//
//     return {
//         x: (Math.random())*seed,
//         y: canvas.clientHeight + (0.5-Math.random())*seed
//     }
//
// }
// stage.style.background = 'red'
// stage.style.width = window.innerWidth/2 - window.innerHeight*1/7 + 'px';
stage.style.left = window.innerWidth / 2 + 150 + 'px';
// console.log(window.innerWidth)
window.onWindowResize = function () {
    stage.style.left = window.innerWidth / 2 + 150 + 'px';
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base = __webpack_require__(1);
var TWEEN = __webpack_require__(0);
var tool = __webpack_require__(2);
var r = 490;
var f_icoVec = base.getIco(r, 2).vertices;
var group;
var container, controls, stats;
var particlesData = [];
var camera, scene, renderer;
var positions, colors;
var particles;
var pointCloud;
var particlePositions;
var linesMesh;

var particleCount = f_icoVec.length;

var rHalf = 60;
var seed = 1;
var oriPositions = void 0;
var effectController = {
    showDots: true,
    showLines: true,
    minDistance: 220,
    limitConnections: true,
    maxConnections: 50,
    particleCount: f_icoVec.length
};

var sceneWidth = window.innerWidth > 1200 ? window.innerWidth : 1200,
    sceneHeight = 822;

var maxParticleCount = f_icoVec.length;
// particleCount = effectController.particleCount;


init();
animate();
// render();
function initGUI() {
    var gui = new dat.GUI();
    gui.add(effectController, "showDots").onChange(function (value) {
        pointCloud.visible = value;
    });
    gui.add(effectController, "showLines").onChange(function (value) {
        linesMesh.visible = value;
    });
    gui.add(effectController, "minDistance", 10, 300);
    gui.add(effectController, "limitConnections");
    gui.add(effectController, "maxConnections", 0, 30, 1);
    gui.add(effectController, "particleCount", 0, maxParticleCount, 1).onChange(function (value) {
        particleCount = parseInt(value);
        particles.setDrawRange(0, particleCount);
    });
}

function init() {
    // initGUI();
    container = document.getElementById('lineSphere');
    //
    camera = new THREE.PerspectiveCamera(45, sceneWidth / sceneHeight, 1000, 1800);
    camera.position.z = 1750;
    // controls = new THREE.OrbitControls( camera, container );
    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add(group);

    // scene.fog = new THREE.Fog(0xffffff, 1400, 1900)

    // var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
    // helper.material.color.setHex( 0x080808 );
    // helper.material.blending = THREE.AdditiveBlending;
    // helper.material.transparent = true;
    // group.add( helper );


    // var segments = maxParticleCount * maxParticleCount;
    var segments = f_icoVec.length * f_icoVec.length;

    positions = new Float32Array(segments * 3);
    colors = new Float32Array(segments * 3);
    var pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 5,
        opacity: 0.4,
        // blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
    });
    particles = new THREE.BufferGeometry();

    particlePositions = new Float32Array(maxParticleCount * 3);
    oriPositions = new Float32Array(maxParticleCount * 3);
    for (var i = 0; i < f_icoVec.length; i++) {
        var x = f_icoVec[i].x;
        var y = f_icoVec[i].y;
        var z = f_icoVec[i].z;
        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        oriPositions[i * 3] = x;
        oriPositions[i * 3 + 1] = y;
        oriPositions[i * 3 + 2] = z;

        // add it to the geometry

        particlesData.push({
            velocity: new THREE.Vector3(-1 + Math.random() * seed, -1 + Math.random() * seed, -1 + Math.random() * seed),
            numConnections: 0
        });
    }
    particles.setDrawRange(0, particleCount);
    particles.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setDynamic(true));
    // create the particle system
    pointCloud = new THREE.Points(particles, pMaterial);
    group.add(pointCloud);
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));
    geometry.computeBoundingSphere();
    geometry.setDrawRange(0, 0);
    var material = new THREE.LineBasicMaterial({
        // vertexColors: THREE.VertexColors,
        // blending: THREE.AdditiveBlending,
        opacity: 0.4,
        transparent: true,
        // sizeAttenuation: true,
        linewidth: 3
    });
    linesMesh = new THREE.LineSegments(geometry, material);
    group.add(linesMesh);
    // group.scale.set(0.8,0.8,0.8)
    // group.visible = false;
    //
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sceneWidth, sceneHeight);
    renderer.setClearColor(0x000000, 0.0);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);
    //
    // stats = new Stats();
    // container.appendChild( stats.dom );
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    var w = window.innerWidth;

    if (w < 1200) {
        return;
    }

    camera.aspect = w / 822;
    camera.updateProjectionMatrix();
    renderer.setSize(w, 822);
}

function animate() {

    var vertexpos = 0;
    var colorpos = 0;
    var numConnected = 0;
    for (var i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0;
    }for (var i = 0; i < particleCount; i++) {
        // get the particle
        var f_r1 = -1 + Math.random() * seed,
            f_r2 = -1 + Math.random() * seed,
            f_r3 = -1 + Math.random() * seed;
        var particleData = particlesData[i];

        var f_p1 = particlePositions[i * 3];
        var f_p2 = particlePositions[i * 3 + 1];

        if (f_p2 < -240) {
            particlePositions[i * 3] += particleData.velocity.x;
            particlePositions[i * 3 + 1] += particleData.velocity.y;
            particlePositions[i * 3 + 2] += particleData.velocity.z;
        }

        var f_dy = particlePositions[i * 3 + 1] - oriPositions[i * 3 + 1];
        var f_dx = particlePositions[i * 3] - oriPositions[i * 3];
        var f_dz = particlePositions[i * 3 + 2] - oriPositions[i * 3 + 2];

        if (f_dx > rHalf || f_dx < -rHalf) particleData.velocity.y = -particleData.velocity.y;
        if (f_dx < -rHalf || f_dx > rHalf) particleData.velocity.x = -particleData.velocity.x;
        if (f_dz < -rHalf || f_dz > rHalf) particleData.velocity.z = -particleData.velocity.z;
        if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections) continue;
        // Check collision
        for (var j = i + 1; j < particleCount; j++) {
            var particleDataB = particlesData[j];
            if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections) continue;
            var dx = particlePositions[i * 3] - particlePositions[j * 3];
            var dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
            var dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
            var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < effectController.minDistance) {
                particleData.numConnections++;
                particleDataB.numConnections++;
                var alpha = 1.0 - dist / effectController.minDistance;
                positions[vertexpos++] = particlePositions[i * 3];
                positions[vertexpos++] = particlePositions[i * 3 + 1];
                positions[vertexpos++] = particlePositions[i * 3 + 2];
                positions[vertexpos++] = particlePositions[j * 3];
                positions[vertexpos++] = particlePositions[j * 3 + 1];
                positions[vertexpos++] = particlePositions[j * 3 + 2];
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                numConnected++;
            }
        }
    }
    linesMesh.geometry.setDrawRange(0, numConnected * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;
    pointCloud.geometry.attributes.position.needsUpdate = true;
    requestAnimationFrame(animate);
    // stats.update();

    render();
}
group.position.z = -600;

setTimeout(function (elt) {
    scaLine();
}, 200);

// scaLine();

function scaLine() {
    var start = {
        z: -600
    };
    var end = {
        z: 0
    };
    new TWEEN.Tween(start).to(end, 2300).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function () {

        group.position.z = this.z;
    }).start();
}

function render() {

    group.rotation.y -= 0.003;
    renderer.render(scene, camera);
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// const THREE = require('three-js')();
var base = __webpack_require__(1);
var TWEEN = __webpack_require__(0);
var tool = __webpack_require__(2);
var line = __webpack_require__(4);

// const fontUpdate = require('module/sphereFont');
// const fontUpdate = require('module/cssFontSphere');
var _module = __webpack_require__(3);

var sceneWidth = window.innerWidth,
    sceneHeight = window.innerHeight;

// 建立场景
var scene = new THREE.Scene();

// 建立相机

var _base$initCamera = base.initCamera(),
    camera = _base$initCamera.camera;
// 建立渲染器


var renderer = base.initRenderer();
// 灯光
var lights = base.initLight();

tool.sceneAdd(scene, lights);

// 网格模型


var icoMesh = base.getNormalIco(2, 2, 0xfc475b);

icoMesh.scale.set(0.001, 0.001, 0.001);

scene.add(icoMesh);

var _base$initSmallSphere = base.initSmallSphereScene(scene),
    normalIco1 = _base$initSmallSphere.normalIco1,
    normalIco3 = _base$initSmallSphere.normalIco3;

var normalIco = base.getNormalIco(1, 1, 0x000000);

function sphereBounceAni(mesh) {
    var start = {
        scale: 0
    };

    var end = {
        scale: 0.5
    };

    var t1 = new TWEEN.Tween(start).to(end, 600).easing(TWEEN.Easing.Sinusoidal.In).onUpdate(function () {

        icoMesh.scale.x = this.scale;
        icoMesh.scale.y = this.scale;
        icoMesh.scale.z = this.scale;
    });

    var t2 = new TWEEN.Tween({ s: 0.5 }).to({ s: 1 }, 1500).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () {
        var s = this.s;


        icoMesh.scale.set(s, s, s);
    });

    t1.chain(t2);
    t1.start();
}
sphereBounceAni(icoMesh);

function icoRotate(mesh) {
    mesh.rotation.y -= 0.002;
    mesh.rotation.x -= 0.002;
    mesh.rotation.z -= 0.002;
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

var time = 0;

function render() {

    icoRotate(icoMesh);
    TWEEN.update();
    normalIco1.position.x += Math.sin(time++ / 175) / 180;
    normalIco1.position.z += Math.sin(time++ / 275) / 220;
    normalIco3.position.y += Math.cos(time++ / 185) / 250;

    renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    var w = window.innerWidth;

    if (w < 1200) {
        return;
    }

    camera.aspect = w / 822;
    camera.updateProjectionMatrix();
    renderer.setSize(w, 822);
}

/***/ })
/******/ ]);