function emptyFunction()
{
}

function alwaysFalse()
{
	return false;
}

function alwaysTrue()
{
	return true;
}

function self()
{
	return function returnArg(arg)
	{
		return arg;
	};
}

function constant(constantRet)
{
	return function returnConstant()
	{
		return constantRet;
	};
}

function addTo()
{
	var additive = arguments.length > 0 ? arguments[0] : NaN;
	Array.forEach(arguments, function addToAdditive(a, index)
	{
		if(index > 0)
			additive += a;
	});
	return Number.isNaN(additive) ? self : function addAdditiveTo(base)
	{
		return base + additive;
	};
}

function subtractFrom()
{
	return addTo.apply(this, Array.map(arguments, function additiveInverseOf(a)
	{
		return -a;
	}));
}

function multiplyBy()
{
	var multiple = arguments.length > 0 ? arguments[0] : NaN;
	Array.forEach(arguments, function multiplyMultipleBy(m, index)
	{
		if(index > 0)
			multiple *= m;
	});
	return Number.isNaN(multiple) ? self : function multiplyByMultiple(base)
	{
		return base * multiple;
	};
}

function divideBy()
{
	var divisor = arguments.length > 0 ? arguments[0] : NaN;
	Array.forEach(arguments, function divideDivisorBy(d, index)
	{
		if(index > 0)
			divisor *= d;
	});
	return Number.isNaN(divisor) ? self : function divideByDivisor(base)
	{
		return base / divisor;
	};
}

function isPowerOfTwo(value)
{
	return (value & (value - 1)) == 0;
}

function degreesReflectionX(degrees)
{
	return (degrees / Math.abs(degrees)) * (180 - Math.abs(degrees));
}

function degreesReflectionY(degrees)
{
	return wrapDegrees(-degrees);
}

function wrapDegrees(degrees)
{
	return (degrees + 180) % 360 == degrees + 180 ? degrees : degrees - (Math.floor((degrees + 180) / 360) * 360);
}

function averageDegrees(a, b)
{
	return isNaN(a) ? b : isNaN(b) ? a : wrapDegrees((a = wrapDegrees(a)) + 180) == (b = wrapDegrees(b)) ? NaN : (((a == -180 ? 180 * Math.abs(b) / b : a) + (b == -180 ? 180 * Math.abs(a) / a : b) + 720) / 2) - 360;
}

function radiansReflectionX(radians)
{
	return (radians / Math.abs(radians)) * (Math.PI - Math.abs(radians));
}

function radiansReflectionY(radians)
{
	return wrapRadians(-radians);
}

function wrapRadians(radians)
{
	return (radians + Math.PI) % Math.PI2 == radians + Math.PI ? radians : radians - (Math.floor((radians + Math.PI) / Math.PI2) * Math.PI2);
}

function averageRadians(a, b)
{
	return isNaN(a) ? b : isNaN(b) ? a : wrapRadians((a = wrapRadians(a)) + Math.PI) == (b = wrapRadians(b)) ? NaN : (((a == -Math.PI ? Math.PI * Math.abs(b) / b : a) + (b == -Math.PI ? Math.PI * Math.abs(a) / Math.PI : b) + Math.PI * 4) / 2) - Math.PI2;
}

function wrapFunction(func, thisArg)
{
	return function callWrappedFunction()
	{
		return func.apply(thisArg, Array.from(arguments));
	};
}

function wrapEventListener(func, thisArg)
{
	var argStrings = Array.from(arguments).slice(2);
	return function callWrappedEventListener(event)
	{
		event = event || window.event;
		var ret = func.apply(thisArg, argStrings.map(function propertyWithName(name)
		{
			return event[name];
		}));
		if(ret)
			event.preventDefault();
	};
}

function callSuper(thisArg, name)
{
	return Object.getPrototypeOf(Object.getPrototypeOf(thisArg))[name].apply(thisArg, Array.from(arguments).splice(2, arguments.length - 2));
}

function isUnicodeNumber(unicode)
{
	return unicode >= 48 && unicode <= 57;
}

function isUnicodeLowercaseLetter(unicode)
{
	return unicode >= 97 && unicode <= 122;
}

function isUnicodeUppercaseLetter(unicode)
{
	return unicode >= 65 && unicode <= 90;
}

function isUnicodeLetter(unicode)
{
	return isUnicodeLowercaseLetter(unicode) || isUnicodeUppercaseLetter(unicode);
}

function isUnicodeAlphaNumeral(unicode)
{
	return isUnicodeLetter(unicode) || isUnicodeNumber(unicode);
}

function requestText(source, onload)
{
	var request = new XMLHttpRequest();
	request.onload = function onTextLoad() { onload(this.status == 200 ? this.responseText : ""); }
	request.open("GET", source);
	request.send();
}

Object.defineProperty(ElementEventListener.prototype, "element", { get: function getElement()
{
	return this._element;
}, set: function setElement(element)
{

	if(this._element)
		this.onElementDelete();
	if(element)
	{
		this._element = element;
		this.onElementSet();
	}
	else
	{
		this._element = null;
		this.reset();
	}
} });
Object.defineProperty(ElementEventListener.prototype, "onElementDelete", { value: function onElementDelete()
{
	this.eventListeners.events.forEach(function removeEventListenerFromPreviousElement(event)
	{
		this.element.removeEventListener(event, this.eventListeners[event]);
	}, this);
} });
Object.defineProperty(ElementEventListener.prototype, "onElementSet", { value: function onElementSet()
{
	this.eventListeners.events.forEach(function addEventListenerToNewEntry(event)
	{
		this.element.addEventListener(event, this.eventListeners[event]);
	}, this);
} });
Object.defineProperty(ElementEventListener.prototype, "addEventListener", { value: function addEventListener(event, func) 
{
	if(this.eventListeners[event])
		this.removeEventListener(event);
	else
		this.eventListeners.events.push(event);
	var wrappedFunc = this.eventListeners[event] = wrapFunction(func, this);
	if(this.element)
		this.element.addEventListener(event, wrappedFunc);
} });
Object.defineProperty(ElementEventListener.prototype, "removeEventListener", { value: function removeEventListener(event)
{
	if(this.element)
		this.element.removeEventListener(event, this.eventListeners[event]);
	delete this.eventListeners.events[this.eventListeners.events.indexOf(event)];
	delete this.eventListeners[event];
} });
Object.defineProperty(ElementEventListener.prototype, "reset", { value: function reset()
{
} });

function ElementEventListener(parameters)
{
	parameters = parameters || { };
	this.reset();
	this.eventListeners = Object.assign({ events: [ ] }, parameters.eventListeners || { });
	this.element = parameters.element;
}

ElementFocusEventListener.prototype = Object.create(ElementEventListener.prototype);
ElementFocusEventListener.prototype.constructor = ElementFocusEventListener;
Object.defineProperty(ElementFocusEventListener.prototype, "focused", { get: function isFocused()
{
	return this.element && document.hasFocus() && document.activeElement == this.element;
} });

function ElementFocusEventListener(parameters)
{
	ElementEventListener.call(this, parameters);
	this.addEventListener("blur", this.reset);
}

Object.defineProperty(Watcher.prototype, "watchable", { set: function setWatchable(watchable)
{
	if(this.parameters[0] != watchable)
	{
		if(this.parameters[0])
			this.parameters[0].removeWatcher(this);
		this.parameters[0] = watchable;
		watchable.addWatcher(this);
		this.notify();
		return true;
	}
	return false;
} });
Object.defineProperty(Watcher.prototype, "notify", { value: function notify()
{
	this.func.apply(this.thisArg, this.parameters);
} });

function Watcher(watchable, func, thisArg, parameters)
{
	this.func = func;
	this.thisArg = thisArg;
	this.parameters = [ undefined ].concat(parameters);
	this.watchable = watchable;
}

Object.defineProperty(Watchable.prototype, "watch", { value: function watch(func, thisArg, parameters)
{
	return new Watcher(this, func, thisArg, parameters || [ ]);
} });
Object.defineProperty(Watchable.prototype, "addWatcher", { value: function addWatcher(watcher)
{
	if(!this.watchers.includes(watcher))
	{
		this.watchers.push(watcher);
		watcher.watchable = this;
	}
} });
Object.defineProperty(Watchable.prototype, "removeWatcher", { value: function removeWatcher(watcher)
{
	var index = this.watchers.indexOf(watcher);
	if(index >= 0)
	{
		this.watchers.splice(index, 1);
		watcher.watchable = undefined;
	}
} });
Object.defineProperty(Watchable.prototype, "notifyWatchers", { value: function notifyWatchers()
{
	(this.watchers || [ ]).forEach(function notifyWatcher(watcher)
	{
		watcher.notify(this);
	}, this);
} });

function Watchable(parameters)
{
	parameters = parameters || { };
	this.watchers = [ ];
	Array.from(parameters.watchers || [ ]).forEach(function addWatcherFromParameters(watcher)
	{
		this.addWatcher(watcher);
	});
}

WatchableValue.prototype = Object.create(Watchable.prototype);
WatchableValue.prototype.constructor = WatchableValue;
Object.defineProperty(WatchableValue, "returnUnmodified", { value: function returnUnmodified(value)
{
	return value;
} });
Object.defineProperty(WatchableValue.prototype, "callback", { get: function getCallback()
{
	return this._callback;
}, set: function setCallback(callback)
{
	this._callback = callback;
	this.value = this.value;
} });
Object.defineProperty(WatchableValue.prototype, "value", { get: function getValue()
{
	return this._value;
}, set: function setValue(value)
{
	this._value = this.callback(value);
	this.notifyWatchers();
	if(this.parent)
		this.parent.notifyWatchers();
} });

function WatchableValue(parameters)
{
	parameters = parameters || { };
	this.parent = parameters.parent instanceof Watchable ? parameters.parent : null;
	this.callback = parameters.callback instanceof Function ? parameters.callback : WatchableValue.returnUnmodified;
	this.value = parameters.value;
	Watchable.call(this, parameters);
}

Updatable.prototype = Object.create(Watchable.prototype);
Updatable.prototype.constructor = Updatable;
Object.defineProperty(Updatable.prototype, "requestUpdate", { value: function requestUpdate()
{
	if(this.requestUpdates && !Number.isInteger(this.updateRequestIndex))
		this.updateRequestIndex = this.game.pushUpdateRequest(wrapFunction(this.updateInternal, this));
} });
Object.defineProperty(Updatable.prototype, "updateInternal", { value: function updateInternal(delta)
{
	this.updateRequestIndex = undefined;
	this.updatePre(delta);
	this.update(delta);
	this.updatePost(delta);
	this.notifyWatchers();
} });
Object.defineProperty(Updatable.prototype, "updatePre", { value: function updatePre(delta)
{
} });
Object.defineProperty(Updatable.prototype, "update", { value: function update(delta)
{
} });
Object.defineProperty(Updatable.prototype, "updatePost", { value: function updatePost(delta)
{
} });

function Updatable(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.game = parameters.game;
	this.requestUpdates = parameters.requestUpdates == false ? false : true;
}

Vector.prototype = Object.create(Watchable.prototype);
Vector.prototype.constructor = Vector;
Object.defineProperty(Vector, "neverNaN", { value: function nevenNaN(number)
{
	return number || 0;
} });
Object.defineProperty(Vector.prototype, 0, { get: function getX()
{
	return this.x.value;
}, set: function setX(x)
{
	this.x.value = x;
} });
Object.defineProperty(Vector.prototype, "length", { value: 1 });

function Vector(parameters)
{
	Watchable.call(this, parameters = parameters || { });
	this.x = Array.isArray(parameters) ? new WatchableValue({ value: parameters[0] }) : Number.isFinite(parameters.x) ? new WatchableValue({ value: parameters.x }) : parameters.x instanceof WatchableValue ? parameters.x : new WatchableValue();
	this.x.callback = Vector.neverNaN;
	this.x.parent = this;
}

Vector2.prototype = Object.create(Vector.prototype);
Vector2.prototype.constructor = Vector2;
Object.defineProperty(Vector2.prototype, "copy", { value: function copy()
{
	return new Vector2([ this[0], this[1] ]);
} });
Object.defineProperty(Vector2.prototype, "add", { value: function add()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	if(args[0])
		this.x._value = this.x.callback(this[0] + args[0]);
	this.x.notifyWatchers();
	if(args[1])
		this.y._value = this.y.callback(this[1] + args[1]);
	this.y.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector2.prototype, "set", { value: function set()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	this.x._value = this.x.callback(args[0]);
	this.x.notifyWatchers();
	this.y._value = this.y.callback(args[1]);
	this.y.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector2.prototype, 1, { get: function getY()
{
	return this.y.value;
}, set: function setY(y)
{
	this.y.value = y;
} });
Object.defineProperty(Vector2.prototype, "length", { value: 2 });

function Vector2(parameters)
{
	Vector.call(this, parameters = parameters || { });
	this.y = Array.isArray(parameters) ? new WatchableValue({ value: parameters[1] }) : Number.isFinite(parameters.y) ? new WatchableValue({ value: parameters.y }) : parameters.y instanceof WatchableValue ? parameters.y : new WatchableValue();
	this.y.callback = Vector.neverNaN;
	this.y.parent = this;
}

Vector3.prototype = Object.create(Vector2.prototype);
Vector3.prototype.constructor = Vector3;
Object.defineProperty(Vector3.prototype, "copy", { value: function copy()
{
	return new Vector3([ this[0], this[1], this[2] ]);
} });
Object.defineProperty(Vector3.prototype, "add", { value: function add()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	if(args[0])
		this.x._value = this.x.callback(this[0] + args[0]);
	this.x.notifyWatchers();
	if(args[1])
		this.y._value = this.y.callback(this[1] + args[1]);
	this.y.notifyWatchers();
	if(args[2])
		this.z._value = this.z.callback(this[2] + args[2]);
	this.z.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector3.prototype, "set", { value: function set()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	this.x._value = this.x.callback(args[0]);
	this.x.notifyWatchers();
	this.y._value = this.y.callback(args[1]);
	this.y.notifyWatchers();
	this.z._value = this.z.callback(args[2]);
	this.z.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector3.prototype, "rotate", { value: function rotate(x, y, z)
{
	return this.rotateRad(Math.rad(x), Math.rad(y), Math.rad(z));
} });
Object.defineProperty(Vector3.prototype, "rotateRad", { value: function rotateRad(x, y, z)
{
	var sinX = Math.sin(x), cosX = Math.cos(x), sinY = Math.sin(y), cosY = Math.cos(y), sinZ = Math.sin(z), cosZ = Math.cos(z);
	return this.rotateMatrix(mat3.invert([ ], [ 1, 0, 0, 0, cosX, -sinX, 0, sinX, cosX ]), [ cosY, 0, sinY, 0, 1, 0, -sinY, 0, cosY ], [ cosZ, -sinZ, 0, sinZ, cosZ, 0, 0, 0, 1 ]);
} });
Object.defineProperty(Vector3.prototype, "rotateMatrix", { value: function rotateMatrix(x, y, z)
{
	return new Vector3(vec3.transformMat3([ ], vec3.transformMat3([ ], vec3.transformMat3([ ], this, y), x), z));
} });
Object.defineProperty(Vector3.prototype, 2, { get: function getZ()
{
	return this.z.value;
}, set: function setZ(z)
{
	this.z.value = z;
} });
Object.defineProperty(Vector3.prototype, "length", { value: 3 });

function Vector3(parameters)
{
	Vector2.call(this, parameters = parameters || { });
	this.z = Array.isArray(parameters) ? new WatchableValue({ value: parameters[2] }) : Number.isFinite(parameters.z) ? new WatchableValue({ value: parameters.z }) : parameters.z instanceof WatchableValue ? parameters.z : new WatchableValue();
	this.z.callback = Vector.neverNaN;
	this.z.parent = this;
}

RotationVector.prototype = Object.create(Vector.prototype);
RotationVector.prototype.constructor = RotationVector;

function RotationVector(parameters)
{
	Vector.call(this, parameters);
	this.x.callback = wrapDegrees;
}

RotationVector2.prototype = Object.create(Vector2.prototype);
RotationVector2.prototype.constructor = RotationVector2;

function RotationVector2(parameters)
{
	Vector2.call(this, parameters);
	this.x.callback = this.y.callback = wrapDegrees;
}

RotationVector3.prototype = Object.create(Vector3.prototype);
RotationVector3.prototype.constructor = RotationVector3;
function RotationVector3(parameters)
{
	Vector3.call(this, parameters);
	this.x.callback = this.y.callback = this.z.callback = wrapDegrees;
}

Color.prototype = Object.create(Watchable.prototype);
Color.prototype.constructor = Color;
Object.defineProperty(Color, "betweenZeroAndOne", { value: function betweenZeroAndOne(number)
{
	return Math.max(0, Math.min(1, number || 0));
} });
Object.defineProperty(Color.prototype, "copy", { value: function copy()
{
	return new Color([ this[0], this[1], this[2], this[3] ]);
} });
Object.defineProperty(Color.prototype, "multiply", { value: function multiply()
{
	switch(arguments.length)
	{
		case 1:
		{
			this[0] *= arguments[0];
			this[1] *= arguments[0];
			this[2] *= arguments[0];
			break;
		}
		case 3:
		{
			this[0] *= arguments[0];
			this[1] *= arguments[1];
			this[2] *= arguments[2];
			break;
		}
		case 4:
		{
			this[0] *= arguments[0];
			this[1] *= arguments[1];
			this[2] *= arguments[2];
			this[3] *= arguments[3];
			break;
		}
	}
	return this;
} });
Object.defineProperty(Color.prototype, 0, { get: function getR()
{
	return this.r.value;
}, set: function setR(r)
{
	this.r.value = r;
} });
Object.defineProperty(Color.prototype, 1, { get: function getG()
{
	return this.g.value;
}, set: function setG(g)
{
	this.g.value = g;
} });
Object.defineProperty(Color.prototype, 2, { get: function getB()
{
	return this.b.value;
}, set: function setB(b)
{
	this.b.value = b;
} });
Object.defineProperty(Color.prototype, 3, { get: function getA()
{
	return this.a.value;
}, set: function setA(a)
{
	this.a.value = a;
} });
Object.defineProperty(Color.prototype, "length", { value: 4 });

function Color(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	if(Array.isArray(parameters))
	{
		this.r = new WatchableValue({ value: parameters[0] });
		this.g = new WatchableValue({ value: parameters[1] });
		this.b = new WatchableValue({ value: parameters[2] });
		this.a = new WatchableValue({ value: parameters[3] });
	}
	else
	{
		this.r = Number.isFinite(parameters.r) ? new WatchableValue({ value: parameters.r }) : parameters.r instanceof WatchableValue ? parameters.r : new WatchableValue();
		this.g = Number.isFinite(parameters.g) ? new WatchableValue({ value: parameters.g }) : parameters.g instanceof WatchableValue ? parameters.g : new WatchableValue();
		this.b = Number.isFinite(parameters.b) ? new WatchableValue({ value: parameters.b }) : parameters.b instanceof WatchableValue ? parameters.b : new WatchableValue();
		this.a = Number.isFinite(parameters.a) ? new WatchableValue({ value: parameters.a }) : parameters.a instanceof WatchableValue ? parameters.a : new WatchableValue();
	}
	this.r.callback = this.g.callback = this.b.callback = this.a.callback = Color.betweenZeroAndOne;
	this.r.parent = this.g.parent = this.b.parent = this.a.parent = this;
}

Camera.prototype = Object.create(Watchable.prototype);
Camera.prototype.constructor = Camera;
Object.defineProperty(Camera.prototype, "lookAt", { value: function lookAt(vector) 
	{
		this.rotation[0] = Math.deg(Math.atan2(vector[1] - this.position[1], Math.hypot(vector[0] - this.position[0], this.position[2] - vector[2])));
		this.rotation[1] = Math.deg(Math.atan2(vector[0] - this.position[0], this.position[2] - vector[2]));
	}
});
Object.defineProperty(Camera.prototype, "fov", { get: function getFov()
{
	return this._fov;
}, set: function setFov(fov)
{
	this._fov = fov || 45; this.notifyWatchers();
} });
Object.defineProperty(Camera.prototype, "near", { get: function getNear()
{
	return this._near;
}, set: function setNear(near)
{
	this._near = near || .1; this.notifyWatchers(); } });
Object.defineProperty(Camera.prototype, "far", { get: function getFar()
{
	return this._far;
}, set: function setFar(far)
{
	this._far = far || 100;
	this.notifyWatchers();
} });

function Camera(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.position = new Vector3(parameters.position);
	this.rotation = new RotationVector3(parameters.rotation);
	this.fov = parameters.fov;
}

Material.prototype = Object.create(Watchable.prototype);
Material.prototype.constructor = Material;
Object.defineProperty(Material.prototype, "shininess", { get: function getShininess()
{
	return this._shininess.value;
}, set: function setShininess(shininess)
{
	this._shininess.value = shininess;
} });

function Material(parameters)
{
	parameters = parameters || { };
	this._shininess = new WatchableValue(Number.isFinite(parameters.shininess) ? parameters.shininess : 0);
	this.specular = parameters.specular instanceof Color ? parameters.specular : new Color(parameters.specular);
	this.specular.watch(function notifyMaterialOfChange()
	{
		if(this.notifyWatchers)
			this.notifyWatchers();
	}, this);
	Watchable.call(this, parameters);
	this._shininess.parent = this;
}

function CollisionMesh(parameters)
{
	
}

function Physics(parameters)
{
	parameters = parameters || { };
	this.noClip = parameters.noClip || false;
	this.tracable = parameters.tracable || true;
	this.gravatationalIndex = Number.isInteger(parameters.gravatationalIndex) ? parameters.gravatationalIndex : Infinity;
	this.mass = parameters.mass >= 0 ? parameters.mass : 0;
	this.collisionMesh = parameters.collisionMesh instanceof CollisionMesh ? parameters.collisionMesh : new CollisionMesh();
}

Geometry.prototype = Object.create(Updatable.prototype);
Geometry.prototype.constructor = Geometry;
Object.defineProperty(Geometry.prototype, "buildGeometry", { value: function buildGeometry(renderer)
{
} });
Object.defineProperty(Geometry.prototype, "onTextureMapChange", { value: function onTextureMapChange(renderer)
{
	this.buildGeometry(renderer);
} });
Object.defineProperty(Geometry.prototype, "updatePre", { value: function updatePre()
{
	this.buildGeometry();
} });

function Geometry(parameters, layer, vertices, triangles)
{
	Updatable.call(this, parameters = parameters || { });
	this.index = layer.geometries.push(this) - 1;
	this.allocation = layer.triangleBuffer.allocate(vertices, Number.isFinite(triangles) ? triangles : vertices / 2);
	this.render = parameters.render || true;
	this.physics = parameters.physics instanceof Physics ? parameters.physics : new Physics(parameters.physics);
	this.position = parameters.position instanceof Vector3 ? parameters.position : new Vector3(parameters.position);
	this.rotation = parameters.rotation instanceof Vector3 ? parameters.rotation : new RotationVector3(parameters.rotation);
	this.position.watch(this.requestUpdate, this);
	this.rotation.watch(this.requestUpdate, this);
	this.requestUpdate();
}

RectangularPrismGeometry.prototype = Object.create(Geometry.prototype);
RectangularPrismGeometry.prototype.constructor = RectangularPrismGeometry;
Object.defineProperty(RectangularPrismGeometry.prototype, "buildGeometry", { value: function buildGeometry(renderer)
{
	callSuper(this, "buildGeometry", renderer);
	this.requestUpdates = false;
	sv = wrapFunction(this.allocation.setVertex, this.allocation);
	vi = wrapFunction(this.allocation.getVertexIndex, this.allocation);
	st = wrapFunction(this.allocation.setTriangle, this.allocation);

	var halves = [ this.width / 2, this.height / 2, this.depth / 2 ];
	sv(0, [ -halves[0], halves[1], halves[2] ], [ 0, 0 ], [ 1, 0, 0 ]);
	sv(1, [ halves[0], halves[1], halves[2] ], [ 1, 0 ], [ 1, 0, 0 ]);
	sv(2, [ halves[0], -halves[1], halves[2] ], [ 1, 1 ], [ 1, 0, 0 ]);
	sv(3, [ -halves[0], -halves[1], halves[2] ], [ 0, 1 ], [ 1, 0, 0 ]);
	st(0, vi(0), vi(1), vi(3));
	st(1, vi(1), vi(2), vi(3));

	sv(4, [ halves[0], halves[1], halves[2] ], [ 0, 0 ], [ 1, 0, 0 ]);
	sv(5, [ halves[0], halves[1], -halves[2] ], [ 1, 0 ], [ 1, 0, 0 ]);
	sv(6, [ halves[0], -halves[1], -halves[2] ], [ 1, 1 ], [ 1, 0, 0 ]);
	sv(7, [ halves[0], -halves[1], halves[2] ], [ 0, 1 ], [ 1, 0, 0 ]);
	st(2, vi(4), vi(5), vi(7));
	st(3, vi(5), vi(6), vi(7));

	sv(8, [ halves[0], halves[1], -halves[2] ], [ 0, 0 ], [ 1, 0, 0 ]);
	sv(9, [ -halves[0], halves[1], -halves[2] ], [ 1, 0 ], [ 1, 0, 0 ]);
	sv(10, [ -halves[0], -halves[1], -halves[2] ], [ 1, 1 ], [ 1, 0, 0 ]);
	sv(11, [ halves[0], -halves[1], -halves[2] ], [ 0, 1 ], [ 1, 0, 0 ]);
	st(4, vi(8), vi(9), vi(11));
	st(5, vi(9), vi(10), vi(11));

	sv(12, [ -halves[0], halves[1], -halves[2] ], [ 0, 0 ], [ 1, 0, 0 ]);
	sv(13, [ -halves[0], halves[1], halves[2] ], [ 1, 0 ], [ 1, 0, 0 ]);
	sv(14, [ -halves[0], -halves[1], halves[2] ], [ 1, 1 ], [ 1, 0, 0 ]);
	sv(15, [ -halves[0], -halves[1], -halves[2] ], [ 0, 1 ], [ 1, 0, 0 ]);
	st(6, vi(12), vi(13), vi(15));
	st(7, vi(13), vi(14), vi(15));

	sv(16, [ -halves[0], halves[1], -halves[2] ], [ 0, 0 ], [ 1, 0, 0 ]);
	sv(17, [ halves[0], halves[1], -halves[2] ], [ 1, 0 ], [ 1, 0, 0 ]);
	sv(18, [ halves[0], halves[1], halves[2] ], [ 1, 1 ], [ 1, 0, 0 ]);
	sv(19, [ -halves[0], halves[1], halves[2] ], [ 0, 1 ], [ 1, 0, 0 ]);
	st(8, vi(16), vi(17), vi(19));
	st(9, vi(17), vi(18), vi(19));

	sv(20, [ -halves[0], -halves[1], halves[2] ], [ 0, 0 ], [ 1, 0, 0 ]);
	sv(21, [ halves[0], -halves[1], halves[2] ], [ 1, 0 ], [ 1, 0, 0 ]);
	sv(22, [ halves[0], -halves[1], -halves[2] ], [ 1, 1 ], [ 1, 0, 0 ]);
	sv(23, [ -halves[0], -halves[1], -halves[2] ], [ 0, 1 ], [ 1, 0, 0 ]);
	st(10, vi(20), vi(21), vi(23));
	st(11, vi(21), vi(22), vi(23));

	var matrix = mat4.identity([ ]);
	mat4.translate(matrix, matrix, this.position);
	mat4.rotateX(matrix, matrix, Math.rad(this.rotation[0]));
	mat4.rotateY(matrix, matrix, Math.rad(this.rotation[1]));
	mat4.rotateZ(matrix, matrix, Math.rad(this.rotation[2]));
	for(var i = 0; i < 24; i++)
		this.allocation.setMatrix(i, matrix, true);
	this.allocation.applyVertices();

	this.requestUpdates = true;
} });

function RectangularPrismGeometry(layer, parameters)
{
	parameters = parameters || { };
	this.width = parameters.width || 1;
	this.height = parameters.height || 1;
	this.depth = parameters.depth || 1;
	this.texture = parameters.texture instanceof Texture ? parameters.texture : layer.game.renderer.textureMap.textures[0];
	Geometry.call(this, parameters, layer, 24);
}

function ElipticalPrism(parameters)
{
	this.heightSegments = parameters.heightSegments || 10;
	this.widthSegments = parameters.widthSegments || 10;
	this.diameter = parameters.diameter || 1;
	var startVector = new Vector3([ 0, -this.diameter / 2, 0 ]);
	var startNormal = new Vector3([ 0, -1, 0 ]);
	for(var i = 0; i < this.heightSegments; i++)
	{
		var vector = vec3.transformMat3([ ], vec3.transformMat3([ ], vec3.transformMat3([ ], [ startVector[0], startVector[1], startVector[2] ], matrixY), matrixX), matrixZ);
		var normal = vec3.transformMat3([ ], vec3.transformMat3([ ], vec3.transformMat3([ ], [ startNormal[0], startNormal[1], startNormal[2] ], matrixY), matrixX), matrixZ);
		for(var j = 0; j < this.widthSegments; j++)
		{
			this.lie;
		}
	}
}

Object.defineProperty(Timestamp, "merge", { value: function mergeTimestamps()
{
	var params = { };
	var fromTime = NaN;
	var toTime = NaN;
	for(var i = arguments.length - 1; i >= 0; i--)
	{
		var timestamp = arguments[i];
		if(timestamp instanceof Timestamp)
		{
			params = Object.merge(true, { }, params, timestamp.params);
			fromTime = fromTime ? Math.min(fromTime, timestamp.fromTime) : timestamp.fromTime;
			toTime = toTime ? Math.max(toTime, timestamp.fromTime + timestamp.time) : timestamp.fromTime + timestamp.time;
		}
	}
	return new Timestamp(JSON.parse(JSON.stringify(params)), fromTime, toTime - fromTime);	
} });
Object.defineProperty(Timestamp, "splitAll", { value: function splitAllTimestamps()
{
	var timestamps = [ ];
	var splitPoints = [ ];
	for(var i = 0; i < arguments.length; i++)
	{
		var  timestamp = arguments[i];
		if(timestamp instanceof Timestamp)
		{
			timestamps.push(timestamp);
			var toTime = timestamp.fromTime + timestamp.time;
			if(splitPoints.indexOf(timestamp.fromTime) < 0)
				splitPoints.push(timestamp.fromTime);
			if(splitPoints.indexOf(toTime) < 0)
				splitPoints.push(toTime);
		}
	}
	splitPoints.sort();
	var splitTimestamps = [ ];
	for(var i = 0; i < timestamps.length; i++)
	{
		var timestamp = timestamps[i];
		var splitTimestamp = timestamp.split.apply(timestamp, splitPoints);
		for(var j = 0; j < splitTimestamp.length; j++)
		{
			var splitTimestampSegment = splitTimestamp[j];
			var index = splitPoints.indexOf(splitTimestampSegment.fromTime);
			var a = splitTimestamps[index];
			if(!a)
				a = splitTimestamps[index] = [ ];
			a.push(splitTimestampSegment);
		}
	}
	timestamps = [ ];
	for(var i = 0; i < splitTimestamps.length; i++)
		timestamps.push(Timestamp.merge.apply(this, splitTimestamps[i]));
	return timestamps;
} });
Object.defineProperty(Timestamp.prototype, "isInTimestamp", { value: function isInTimestamp(time)
{
	return this.fromTime < time && this.fromTime + this.time > time;
} });
Object.defineProperty(Timestamp.prototype, "copy", { value: function copy()
{
	return new Timestamp(JSON.parse(JSON.stringify(this.params)), this.fromTime, this.time);
} });
Object.defineProperty(Timestamp.prototype, "split", { value: function split()
{
	var times = Array.from(arguments);
	var timestamp = this;
	var json = JSON.stringify(this.params);
	times = times.filter(wrapFunction(this.isInTimestamp, this));
	times.push(this.fromTime, this.fromTime + this.time);
	times.sort();
	var timestamps = [ ];
	for(var i = 0; i < times.length - 1; i++)
	{
		var fromTime = times[i];
		timestamps.push(new Timestamp(JSON.parse(json), fromTime, times[i + 1] - fromTime));
	}
	return timestamps;
} });

function Timestamp(params, fromTime, time)
{
	this.params = params || { };
	this.fromTime = fromTime || 0;
	this.time = time || 0;
}
Object.defineProperty(Control.prototype, "addControllers", { value: function addControllers()
{
	Array.forEach(parameters, function addControllerIfAbsent(controller)
	{
		if(!this.controllers.includes(controller))
			this.controllers.push(controller);
	}, this);
	return this;
} });
Object.defineProperty(Control.prototype, "reset", { value: function reset()
{
	this.mouseControllers.forEach(function deactivateMouseController(controller)
	{
		var controller = this.controls.controllers["mouse." + controller];
		if(controller)
			constroller.splice(controller.indexOf(this), 1);
	}, this);
	this.keyboardControllers.forEach(function deactivateKeyboardController(controller)
	{ 
		var controller = this.controls.controllers["keyboard." + controller];
		if(controller)
			controller.splice(controller.indexOf(this), 1);
	}, this);
	this.gamepadControllers.forEach(function deactivateGamepadController(controller)
	{
		var controller = this.controls.controllers["gamepad." + controller];
		if(controller)
			controller.splice(controller.indexOf(this), 1);
	}, this);
	this.defaultMouseControllers.forEach(function activateMouseController(controller)
	{
		var controllerName = "mouse." + controller;
		if(!this.controls.controllers[controllerName])
			this.controls.controllers[controllerName] = [ ];
		this.controls.controllers[controllerName].push(this);
	}, this);
	this.defaultKeyboardControllers.forEach(function activateKeyboardController(controller)
	{
		var controllerName = "keyboard." + controller;
		if(!this.controls.controllers[controllerName])
			this.controls.controllers[controllerName] = [ ];
		this.controls.controllers[controllerName].push(this);
	}, this);
	this.defaultGamepadControllers.forEach(function activateGamepadController(controller)
	{
		var controllerName = "gamepad." + controller;
		if(!this.controls.controllers[controllerName])
			this.controls.controllers[controllerName] = [ ];
		this.controls.controllers[controllerName].push(this);
	}, this);
	this.mouseControllers = Array.from(this.defaultMouseControllers);
	this.keyboardControllers = Array.from(this.defaultKeyboardControllers);
	this.gamepadControllers = Array.from(this.defaultGamepadControllers);
} });

function Control(controls, name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers)
{
	this.controls = controls;
	this.name = name;
	this.func = func;
	this.type = type;
	this.mouseControllerFilter = mouseControllerFilter || alwaysFalse;
	this.keyboardControllerFilter = keyboardControllerFilter || alwaysFalse;
	this.gamepadControllerFilter = gamepadControllerFilter || alwaysFalse;
	this.defaultMouseControllers = Array.from(defaultMouseControllers);
	this.defaultKeyboardControllers = Array.from(defaultKeyboardControllers);
	this.defaultGamepadControllers = Array.from(defaultGamepadControllers);
	this.mouseControllers = [ ];
	this.keyboardControllers = [ ];
	this.gamepadControllers = [ ];
	this.reset();
}

Mouse.prototype = Object.create(ElementEventListener.prototype);
Mouse.prototype.constructor = Mouse;
Object.defineProperty(Mouse, "movementFilter", { value: function isMouseMovement(controller)
{
	return controller == "movement";
} });
Object.defineProperty(Mouse, "buttonFilter", { value: function isMouseButton(controller)
{
	return controller.startsWith("button");
} });
Object.defineProperty(Mouse, "wheelFilter", { value: function isMouseWheel(controller)
{
	return controller == "wheel";
} });
Object.defineProperty(Mouse.prototype, "onButtonDown", { value: function onButtonDown(button)
{
	if(this.controls.focused)
	{
		var buttonArray = this.buttonArrays[button];
		if(!buttonArray)
			buttonArray = this.buttonArrays[button] = [ ];
		var params;
		if(buttonArray.length == 0 || buttonArray[keyArray.length - 1].time < Infinity)
		{
			params = { };
			buttonArray.push(this.timestamps.push(new Timestamp(params, Date.now(), Infinity)) - 1);
		}
		this.controls.getControls("mouse.button" + button).forEach(function processControl(control)
		{
			switch(control.type)
			{
				case 1:
				{
					var instaFuncParams = { };
					instaFuncParams.setPropertyAt("mouse." + control.name, true);
					control.func(instaFuncParams);
					break;
				}
				case 2:
				{
					if(params)
						params.setPropertyAt("mouse." + control.name, true);
					break;
				}
			}
		}, this);
	}
} });
Object.defineProperty(Mouse.prototype, "onButtonUp", { value: function onButtonUp(button)
{
	if(this.controls.focused)
	{
		var now = Date.now();
		(this.buttonArrays[button] || [ ]).forEach(function setButtonTimestampToDefinite(index)
		{
			var timestamp = this.timestamps[index];
			if(timestamp && timestamp.time == Infinity)
				timestamp.time = now - timestamp.fromTime
		}, this);
		delete this.buttonArrays[button];
	}
} });
Object.defineProperty(Mouse.prototype, "onMouseMove", { value: function onMouseMove(movementX, movementY)
{
	if(this.controls.focused)
	{
		this.lastMovementTime = this.lastMovementTime || Date.now();
		this.movementX += movementX;
		this.movementY += movementY;
		var movementInfo = [ Math.deg(Math.atan2(movementX, movementY)), Math.hypot(movementX, movementY) ];
		var instantControlFunctions = { list: [ ] };
		this.controls.getControls("mouse.movement").forEach(function pushControlFunctionIfInstantControl(control)
		{
			if(control.type == 1)
			{
				var params;
				if(instantControlFunctions[control.func])
					params = instantControlFunctions[control.func];
				else
				{
					instantControlFunctions.list.push(control.func);
					instantControlFunctions[control.func] = params = { };
				}
				params.setPropertyAt("mouse." + control.name, movementInfo);
				control.func(params);
			}
		});
		instantControlFunctions.list.forEach(function callInstantControlFunction(instantControlFunction)
		{
			instantControlFunction(instantControlFunctions[instantControlFunction]);
		});
	}
} });
Object.defineProperty(Mouse.prototype, "update", { value: function update(last, now)
{
	if(this.lastMovementTime && (this.movementX || this.movementY))
	{
		var params = { };
		var movementInfo = [ Math.deg(Math.atan2(this.movementX, this.movementY)), Math.hypot(this.movementX, this.movementY) ];
		this.controls.getControls("mouse.movement").forEach(function setControlRotaryParameter(control)
		{
			if(control.type == 2)
				params.setPropertyAt("mouse." + control.name, movementInfo);
		});
		this.timestamps.push(new Timestamp(params, this.lastMovementTime, now - this.lastMovementTime));
		this.lastMovementTime = NaN;
		this.movementX = this.movementY = 0;
	}
} });
Object.defineProperty(Mouse.prototype, "reset", { value: function reset()
{
	this.lastMovementTime = NaN;
	this.movementX = this.movementY = 0;
	this.timestamps = [ ];
	this.buttonArrays = { };
} });

function Mouse(parameters)
{
	parameters = parameters || { };
	ElementEventListener.call(this, parameters);
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	this.addEventListener("mousedown", wrapEventListener(this.onButtonDown, this, "button"));
	this.addEventListener("mouseup", wrapEventListener(this.onButtonUp, this, "button"));
	this.addEventListener("mousemove", wrapEventListener(this.onMouseMove, this, "movementX", "movementY"));
}

Keyboard.prototype = Object.create(ElementEventListener.prototype);
Keyboard.prototype.constructor = Keyboard;
Object.defineProperty(Keyboard, "keyFilter", { value: function isKeyboardKey(controller)
{
	return true;
} });
Object.defineProperty(Keyboard, "getKey", { value: function keyToString(key)
{
	if(key == " ")
		return "spacebar";
	else if(key.startsWith("Arrow"))
		return key.substring(5).toLowerCase();
	return key.toLowerCase();
} });
Object.defineProperty(Keyboard.prototype, "processKeyDown", { value: function processKeyDown(key)
{
	this.onKeyDown(Keyboard.getKey(key));
} });
Object.defineProperty(Keyboard.prototype, "onKeyDown", { value: function onKeyDown(key)
{
	if(this.controls.focused)
	{
		var keyArray = this.keyArrays[key];
		if(!keyArray)
			keyArray = this.keyArrays[key] = [ ];
		var params;
		if(keyArray.length == 0 || keyArray[keyArray.length - 1].time < Infinity)
		{
			params = { };
			keyArray.push(this.timestamps.push(new Timestamp(params, Date.now(), Infinity)) - 1);
		}
		this.controls.getControls("keyboard." + key).forEach(function processControl(control)
		{
			switch(control.type)
			{
				case 1:
				{
					var instaFuncParams = { };
					instaFuncParams.setPropertyAt("keyboard." + control.name, true);
					control.func(instaFuncParams);
					break;
				}
				case 2:
				{
					if(params)
						params.setPropertyAt("keyboard." + control.name, true);
					break;
				}
			}
		}, this);
	}
} });
Object.defineProperty(Keyboard.prototype, "processKeyUp", { value: function processKeyUp(key)
{
	this.onKeyUp(Keyboard.getKey(key));
} });
Object.defineProperty(Keyboard.prototype, "onKeyUp", { value: function onKeyUp(key)
{
	if(this.controls.focused)
	{
		var now = Date.now();
		(this.keyArrays[key] || [ ]).forEach(function setKeyTimestampToDefinite(index)
		{
			var timestamp = this.timestamps[index];
			if(timestamp && timestamp.time == Infinity)
				timestamp.time = now - timestamp.fromTime
		}, this);
		delete this.keyArrays[key];
	}
} });
Object.defineProperty(Keyboard.prototype, "reset", { value: function reset()
{
	this.timestamps = [ ];
	this.keyArrays = { };
} });

function Keyboard(parameters)
{
	parameters = parameters || { };
	ElementEventListener.call(this, parameters);
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	this.addEventListener("keydown", wrapEventListener(this.processKeyDown, this, "key"));
	this.addEventListener("keyup", wrapEventListener(this.processKeyUp, this, "key"));
}

Gamepad.prototype = Object.create(ElementFocusEventListener.prototype);
Gamepad.prototype.constructor = Gamepad;
Object.defineProperty(Gamepad, "buttonFilter", { value: function isGamepadButton(controller)
{
	return controller.startsWith("button");
} });
Object.defineProperty(Gamepad, "analogFilter", { value: function isGamepadAnalogStick(controller)
{
	return controller.startsWith("analog");
} });
Object.defineProperty(Gamepad.prototype, "update", { value: function update(last, now)
{
	var gamepads = navigator.getGamepads();
	for(var i = 0; i < gamepads.length; i++)
	{
		var gamepad = gamepads[i];
		if(gamepad)
		{
			var params = { };
			for(var j = 0; j < Math.floor(gamepad.axes.length / 2); j++)
			{
				var analogX = gamepad.axes[j * 2];
				var analogY = -gamepad.axes[(j * 2) + 1];
				var deadZone = this.controls.game.options.controls.gamepad.deadZone;
				if(Math.abs(analogX) < deadZone)
					analogX = 0;
				if(Math.abs(analogY) < deadZone)
					analogY = 0;
				var controller = "analog" + j;
				if(analogX != 0 || analogY != 0)
				{
					var analogInfo = [ Math.deg(Math.atan2(analogX, analogY)), Math.hypot(analogX, analogY) ];
					this.controls.getControls("gamepad." + controller).forEach(function setControlRotaryParameter(control)
					{
						params.setPropertyAt("gamepad." + control.name, analogInfo);
					});
				}
			}
			for(var j = 0; j < gamepad.buttons.length; j++)
			{
				var buttonPressed = gamepad.buttons[j].pressed;
				var controller = "button" + j;
				if(buttonPressed)
				{
					this.controls.getControls("gamepad." + controller).forEach(function setControlButtonParameter(control)
					{
						params.setPropertyAt("gamepad." + control.name, true);
					}, this);
				}
			}
			if(Object.entries(params).length > 0)
				this.timestamps.push(new Timestamp(params, last, now - last));
		}
	}
} });

function Gamepad(parameters)
{
	this.timestamps = [ ];
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	ElementFocusEventListener.call(this, parameters);
}

Controls.prototype = Object.create(ElementEventListener.prototype);
Controls.prototype.constructor = Controls;
Object.defineProperty(Controls.prototype, "focused", { get: function isFocused()
{
	return this.element && document.hasFocus() && document.activeElement == this.element && (!this.requiresPointerLock || document.pointerLockElement == this.element);
} });
Object.defineProperty(Controls.prototype, "onElementDelete", { value: function onElementDelete()
{
	callSuper(this, "onElementDelete");
	this.keyboard.element = this.mouse.element = this.gamepad.element = undefined;
} });
Object.defineProperty(Controls.prototype, "onElementSet", { value: function onElementSet()
{
	callSuper(this, "onElementSet");
	this.keyboard.element = this.mouse.element = this.gamepad.element = this.element;
} });
Object.defineProperty(Controls.prototype, "addControl", { value: function addControl(name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers)
{
	var control = this.controls[name] = new Control(this, name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers);
	if(type == 2)
		this.addControlsLoopFunc(func);
} });
Object.defineProperty(Controls.prototype, "getControl", { value: function getControl(name)
{
	return this.controls[name] || this.nullKeyBinding;
} });
Object.defineProperty(Controls.prototype, "getControls", { value: function getControls(controller)
{
	return this.controllers[controller] || [ ];
} });
Object.defineProperty(Controls.prototype, "addControlsLoopFunc", { value: function addControlsLoopFunc(func)
{
	var index = this.controlsLoopFuncs.indexOf(func);
	if(index < 0)
		index = this.controlsLoopFuncs.push(func) - 1;
	this.controlsLoopFuncs[0][index - 1] = (this.controlsLoopFuncs[0][index - 1] || 0) + 1;
} });
Object.defineProperty(Controls.prototype, "removeControlsLoopFunc", { value: function removeControlsLoopFunc(func)
{
	var index = this.controlsLoopFuncs.indexOf(func);
	if(index >= 0)
	{
		var funcs = (this.controlsLoopFuncs[0][index - 1] || 0) - 1;
		if(funcs <= 0)
		{
			this.controlsLoopFuncs[index] = null;
		}
	}
} });
Object.defineProperty(Controls.prototype, "startControlsLoop", { value: function startControlsLoop()
{
	this.controlsLoopTimeout = setTimeout(this.controlsLoop, 0, this);
} });
Object.defineProperty(Controls.prototype, "stopControlsLoop", { value: function stopControlsLoop()
{
	clearTimeout(this.controlsLoopTimeout);
} });
Object.defineProperty(Controls.prototype, "controlsLoop", { value: function controlsLoop(controls)
{
	controls.controlsLoopTimeout = setTimeout(controls.controlsLoop, 0, controls);
	if(controls.focused)
	{
		var now = Date.now();
		controls.mouse.update(controls.lastControlsLoop || now, now);
		controls.gamepad.update(controls.lastControlsLoop || now, now);
		var timestamps = Timestamp.splitAll.apply(null, function processControlTimestamps()
		{	
			var timestamps = [ ];
			Array.forEach(arguments, function addControlTimestamps(ts)
			{
				ts.forEach(function addControlTimestamp(timestamp, index, array)
				{
					if(timestamp.time == Infinity)
					{
						var newTimestamp = timestamp.copy();
						newTimestamp.time = now - newTimestamp.fromTime;
						timestamps.push(newTimestamp);
						timestamp.fromTime = now;
					}
					else
					{
						timestamps.push(timestamp);
						delete array[index];
					}
				});
			});
			return timestamps;
		}(controls.mouse.timestamps, controls.keyboard.timestamps, controls.gamepad.timestamps));
		for(var i = 1; i < controls.controlsLoopFuncs.length; i++)
			controls.controlsLoopFuncs[i](timestamps, controls.lastControlsLoop, now);
		controls.lastControlsLoop = now;
	}
} });
Object.defineProperty(Controls.prototype, "unload", { value: function unload()
{
	this.endControlsLoop();
} });

function Controls(parameters)
{
	parameters = parameters || { };
	this.game = parameters.game;
	this.nullControl = new Control(this, "null", emptyFunction, 0, undefined, undefined, undefined, [ ], [ ], [ ]);
	this.controls = { };
	this.controllers = { };
	this.controlsLoopFuncs = [ [ ] ];
	if(!parameters.mouse)
		parameters.mouse = { };
	parameters.mouse.controls = this;
	if(!parameters.keyboard)
		parameters.keyboard = { };
	parameters.keyboard.controls = this;
	if(!parameters.gamepad)
		parameters.gamepad = { };
	parameters.gamepad.controls = this;
	this.mouse = parameters.mouse instanceof Mouse ? parameters.mouse : new Mouse(parameters.mouse);
	this.keyboard = parameters.keyboard instanceof Keyboard ? parameters.keyboard : new Keyboard(parameters.keyboard);
	this.gamepad = parameters.gamepad instanceof Gamepad ? parameters.gamepad : new Gamepad(parameters.gamepad);
	ElementEventListener.call(this, parameters);
}

Object.defineProperty(Texture.prototype, "getAbsoluteU", { value: function getAbsoluteU(relativeU)
{
	var uvs = this.textureMap[this.index];
	if(!uvs)
		return NaN;
	var uStart = uvs[0];
	return uStart + relativeU * uvs[2];
} });
Object.defineProperty(Texture.prototype, "getAbsoluteV", { value: function getAbsoluteV(relativeV)
{
	var uvs = this.textureMap[this.index];
	if(!uvs)
		return NaN;
	var vStart = uvs[1];
	return vStart + relativeV * uvs[3];
} });

function Texture(index, textureMap, image)
{
	this.index = index;
	this.textureMap = textureMap;
	this.image = image;
}

Object.defineProperty(TextureMap, "textureComparator", { value: function textureComparator(a, b)
{
	return b.image.height - a.image.height || b.image.width - a.image.width || a.index - b.index;
} });
Object.defineProperty(TextureMap, "boxComparator", { value: function boxComparator(a, b)
{
	return a[0] - b[0] || a[1] - b[1];
} });
Object.defineProperty(TextureMap, "calculateTextureUVs", { value: function calculateTextureUVs(length, textures)
{
	var availableBoxesMap = [ [ 0 ] ];
	availableBoxesMap[-1] = [ 0 ];
	availableBoxesMap[0][-1] = [ 0 ];
	var availableBoxes = [ [ 0, 0, length, length] ];
	var splitBoxesWidth = NaN;
	var splitBoxesHeight = NaN;
	var splitBoxes = [ ];
	var textureUVs = [ ];
	for(var i = 0; textureUVs && i < textures.length; i++)
	{
		var texture = textures[i];
		var width = texture.image.width;
		var height = texture.image.height;
		if(width != splitBoxesWidth && height != splitBoxesHeight)
		{
			availableBoxes.forEach(function shiftAvailableBoxIndexInMap(availableBox)
			{
				availableBoxesMap[availableBox[0]][availableBox[1]] += splitBoxes.length;
			});
			splitBoxes.forEach(function addSplitBoxIndexToMap(splitBox, index)
			{
				if(!availableBoxesMap[-1].includes(splitBox[0]))
					availableBoxesMap[-1].push(splitBox[0]);
				var vArray = availableBoxesMap[splitBox[0]];
				if(!vArray)
				{
					vArray = availableBoxesMap[splitBox[0]] = [ ];
					vArray[-1] = [ ];
					availableBoxesMap[-1].push(splitBox[0]);
				}
				vArray[splitBox[1]] = index;
				vArray[-1].push(splitBox[1]);
				vArray[-1].sort();
			});
			availableBoxesMap[-1].sort();
			availableBoxes = splitBoxes.concat(availableBoxes);
			splitBoxes = [ ];
			var overlappingBoxes = [ ];
			for(var j = 0; j < availableBoxes.length; j++)
			{
				var availableBox = availableBoxes[j];
				if(availableBox)
				{
					var quadrants = [ [ [ availableBox[0], availableBox[1], width, height ] ], [ [ availableBox[0], availableBox[1] - height, width, height ] ], [ [ availableBox[0] - width, availableBox[1], width, height ] ], [ [ availableBox[0] - width, availableBox[1] - height, width, height ] ] ];
					var boxesInArea = [ [ ], [ ], [ ], [ ] ];
					quadrants.forEach(function reduceQuadrantBounds(quadrant, quadrantIndex)
					{
						var quadrantBox = quadrant[0];
						if(quadrantBox[0] < 0 || quadrantBox[1] < 0)
							return;
						for(var k = 0, u = availableBoxesMap[-1][0]; k < availableBoxesMap[-1].length && u < quadrantBox[0] + quadrantBox[2]; u = availableBoxesMap[-1][++k])
						{
							if(u < quadrantBox[0])
								continue;
							var vArray = availableBoxesMap[u];
							for(var l = 0, v = vArray[-1][0]; l < vArray[-1].length && v < quadrantBox[1] + quadrantBox[3]; v = vArray[-1][++l])
							{
								if(v < quadrantBox[1])
									continue;
								var affectedBox = availableBoxes[vArray[v]];
								quadrant.forEach(function reduceQuadrantBoundsByIntersectingBoxes(remainingBox, index)
								{
									if(remainingBox[0] >= affectedBox[0] && remainingBox[1] >= affectedBox[1] && remainingBox[0] + remainingBox[2] <= affectedBox[0] + affectedBox[2] && remainingBox[1] + remainingBox[3] <= affectedBox[1] + affectedBox[3])
										delete quadrant[index];
									else if(remainingBox[1] == affectedBox[1] && remainingBox[3] == affectedBox[3])
									{
										var leftBox = [ remainingBox[0], remainingBox[1], remainingBox[1], Math.max(affectedBox[0] - remainingBox[0], 0), remainingBox[3] ];
										var rightBox = [ affectedBox[0] + affectedBox[2], remainingBox[1], Math.max(remainingBox[0] + remainingBox[2] - affectedBox[0] - affectedBox[2], 0), remainingBox[3] ];
										var replacedRemaining;
										if(leftBox[2] * leftBox[3] > 0)
											replacedRemaining = quadrant[index] = leftBox;
										if(rightBox[2] * rightBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(rightBox);
											else
												quadrant[index] = rightBox;
									}
									else
									{
										var topBox = [ remainingBox[0], remainingBox[1], remainingBox[2], Math.max(affectedBox[1] - remainingBox[1], 0) ];
										var bottomBox = [ remainingBox[0], affectedBox[1] + affectedBox[3], remainingBox[2], Math.max(remainingBox[1] + remainingBox[3] - affectedBox[1] - affectedBox[3], 0) ];
										var leftBox = [ remainingBox[0], affectedBox[1], Math.max(affectedBox[0] - remainingBox[0], 0), affectedBox[3] ];
										var rightBox = [ affectedBox[0] + affectedBox[2], affectedBox[1], Math.max(remainingBox[0] + remainingBox[2] - affectedBox[0] - affectedBox[2], 0), affectedBox[3] ];
										var replacedRemaining;
										if(topBox[2] * topBox[3] > 0)
											replacedRemaining = quadrant[index] = topBox;
										if(bottomBox[2] * bottomBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(bottomBox);
											else
												replacedRemaining = quadrant[index] = bottomBox;
										if(leftBox[2] * leftBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(leftBox);
											else
												replacedRemaining = quadrant[index] = leftBox;
										if(rightBox[2] * rightBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(rightBox);
											else
												quadrant[index] = rightBox;
									}
								});
								boxesInArea[quadrantIndex].push(vArray[v]);
							}
						}
						if(!quadrant.find(WatchableValue.returnUnmodified))
						{
							var splitBoxIndex = splitBoxes.push(quadrantBox) - 1;
							boxesInArea[quadrantIndex].forEach(function addIndexToOverlappingBoxes(boxInArea)
							{
								if(overlappingBoxes[boxInArea])
									overlappingBoxes[boxInArea].push(splitBoxIndex);
								else
									overlappingBoxes[boxInArea] = [ splitBoxIndex ];
							});
						}
					});
				}
			}
			overlappingBoxes.forEach(function divideOverlappingBoxBySplitBoxes(splitBoxIndices, overlappingBoxIndex)
			{
				var overlappingBox = availableBoxes[overlappingBoxIndex];
				var vArray = availableBoxesMap[overlappingBox[0]];
				if(vArray[-1].length <= 1)
					if(availableBoxesMap[-1].length <= 1)
					{
						availableBoxesMap = [ ];
						availableBoxesMap[-1] = [ ];
					}
					else
					{
						delete availableBoxesMap[overlappingBox[0]];
						availableBoxesMap[-1].splice(availableBoxesMap[-1].indexOf(overlappingBox[0]), 1);
					}
				else
				{
					delete vArray[overlappingBox[1]];
					vArray[-1].splice(vArray[-1].indexOf(overlappingBox[1]), 1);
				}
				delete availableBoxes[overlappingBoxIndex];
				var uDivisionPoints = [ overlappingBox[0], overlappingBox[0] + overlappingBox[2] ];
				var vDivisionPoints = [ overlappingBox[1], overlappingBox[1] + overlappingBox[3] ];
				splitBoxIndices.forEach(function addDivisionPoints(splitBoxIndex)
				{
					var splitBox = splitBoxes[splitBoxIndex];
					if(!uDivisionPoints.includes(splitBox[0]))
						uDivisionPoints.push(splitBox[0]);
					if(!uDivisionPoints.includes(splitBox[0] + splitBox[2]))
						uDivisionPoints.push(splitBox[0] + splitBox[2]);
					if(!vDivisionPoints.includes(splitBox[1]))
						vDivisionPoints.push(splitBox[1]);
					if(!vDivisionPoints.includes(splitBox[1] + splitBox[3]))
						vDivisionPoints.push(splitBox[1] + splitBox[3]);
				});
				uDivisionPoints.sort();
				vDivisionPoints.sort();
				for(var j = 0, u = uDivisionPoints[0]; j + 1 < uDivisionPoints.length; u = uDivisionPoints[++j])
					for(var k = 0, v = vDivisionPoints[0]; k + 1 < vDivisionPoints.length; v = vDivisionPoints[++k])
					{
						if(splitBoxIndices.every(function isUVInSplitBox(splitBoxIndex)
						{
							var splitBox = splitBoxes[splitBoxIndex];
							return u < splitBox[0] || u >= splitBox[0] + splitBox[2] || v < splitBox[1] || v >= splitBox[1] + splitBox[3];
						}))
						{
							var newBoxIndex = availableBoxes.push([ u, v, uDivisionPoints[j + 1] - u, vDivisionPoints[k + 1] - v ]) - 1;
							var vArray = availableBoxesMap[u];
							if(!vArray)
							{
								vArray = availableBoxesMap[u] = [ ];
								vArray[-1] = [ ];
								availableBoxesMap[-1].push(u);
							}
							vArray[v] = newBoxIndex;
							vArray[-1].push(v);
							vArray[-1].sort();
						}
					}
			});
			splitBoxesWidth = width;
			splitBoxesHeight = height;
			splitBoxes.reverse();
		}
		var splitBox = splitBoxes.pop();
		if(splitBox)
			textureUVs.push(splitBox);
		else
			textureUVs = undefined;
	}
	return textureUVs;
} });
Object.defineProperty(TextureMap.prototype, "loadTextures", { value: function loadTextures(imageLocations)
{
	var ret = [ ];
	var textures = Array.from(this.textures);
	var loadedImages = textures.length;
	var restitchIfAllLoaded = wrapFunction(function restitchIfAllLoaded()
	{
		loadedImages++;
		if(loadedImages == textures.length)
			this.restitchTextures(textures);
	}, this);
	imageLocations.forEach(function requestTexture(imageLocation)
	{
		var image = new Image();
		var index = textures.length;
		var texture = new Texture(index, this, image);
		textures.push(texture);
		ret.push(texture);
		var removeListeners = function removeTextureisteners(image)
		{
			image.removeEventListener("load", onload);
			image.removeEventListener("error", onerror);
		}
		var onload = function onTextureLoad()
		{
			removeListeners(this);
			restitchIfAllLoaded();
		}
		var onerror = function onTextureError()
		{
			texture.index = 0;
			onload();
		}
		image.addEventListener("load", onload);
		image.addEventListener("error", onerror);
		image.src = imageLocation;
	}, this);
	if(imageLocations.length == 0)
		setTimeout(wrapFunction(function delayedRestitchTextures()
		{
			this.restitchTextures(textures);
		}, this), 0);
	return ret;
} });
Object.defineProperty(TextureMap.prototype, "restitchTextures", { value: function restitchTextures(textures)
{
	textures.sort(TextureMap.textureComparator);
	var stitchedPixels = 0;
	textures.forEach(function addAreaToStitchedPixels(texture)
	{
		stitchedPixels += texture.image.width * texture.image.height;
	});
	var textureUVs;
	var i = Math.ceil(Math.log2(stitchedPixels));
	for(; Math.pow(2, i) < Infinity && !textureUVs;)
		textureUVs = TextureMap.calculateTextureUVs(Math.pow(2, ++i), textures);
	var stitchCanvas = document.createElement("canvas");
	stitchCanvas.width = stitchCanvas.height = Math.pow(2, i);
	var stitchContext = stitchCanvas.getContext("2d");
	textureUVs.forEach(function addTextureToStitched(textureUV, index)
	{
		var texture = textures[index];
		stitchContext.drawImage(texture.image, textureUV[0], textureUV[1], textureUV[2], textureUV[3]);
		this[texture.index] = textureUV.map(function divideUVByStitchedLength(element)
		{
			return element / Math.pow(2, i);
		});
	}, this);
	this.stitched.src = stitchCanvas.toDataURL();
	this.stitched.addEventListener("load", this.onStichedLoad = wrapFunction(function onStitchedTextureMapLoad()
	{
		this.stitched.removeEventListener("load", this.onStitchedLoad);
		this.onStitchedLoad = undefined;
		this.renderer.bindTextureMap();
	}, this));
} });

function TextureMap(parameters)
{
	parameters = parameters || { };
	this.renderer = parameters.renderer;
	this.stitched = new Image();
	var missingImage = new Image();
	this.textures = [ new Texture(0, this, missingImage) ];
	var missingCanvas = document.createElement("canvas");
	missingCanvas.height = missingCanvas.width = 4;
	var missingContext = missingCanvas.getContext("2d");
	var missingImageData = missingContext.createImageData(4, 4);
	for(var x = 0; x < missingImageData.width; x++)
		for(var y = 0; y < missingImageData.height; y++)
			missingImageData.data.set([ Math.max(0, (x + 1) * 64 - 1), Math.max(0, (y + 1) * 64 - 1), Math.max(0, (x + y * missingImageData.width + 1) * 16 - 1), 255 ], (x + y * missingImageData.width) * 4);
	missingContext.putImageData(missingImageData, 0, 0);
	this.stitched.src = missingImage.src = missingCanvas.toDataURL();
	this.stitched.addEventListener("load", this.onStichedLoad = wrapFunction(function onStitchedTextureMapLoad()
	{
		this.stitched.removeEventListener("load", this.onStitchedLoad);
		this.onStitchedLoad = undefined;
		this.renderer.bindTextureMap();
	}, this));
	this[0] = [ 0, 0, 1, 1 ];
}

Object.defineProperty(GeometryAllocation.prototype, "putVector", { get: function getPutVector()
{
	return wrapFunction(this.triangleBuffer.vertexBuffer.vectors instanceof Float32Array ? function putVectorIntoTypedArray(vector, vectorIndex)
	{
		this.triangleBuffer.vertexBuffer.vectors.set(vector, vectorIndex);
	} : function putVectorIntoArray(vector, vectorIndex)
	{
		this.triangleBuffer.vertexBuffer.vectors.splice.apply(this.triangleBuffer.vertexBuffer.vectors, [ vectorIndex, 3 ].concat(vector));
	}, this);
} });
Object.defineProperty(GeometryAllocation.prototype, "putUV", { get: function getPutUV()
{
	return wrapFunction(this.triangleBuffer.vertexBuffer.uvs instanceof Float32Array ? function putUVIntoTypedArray(uv, uvIndex)
	{
		this.triangleBuffer.vertexBuffer.uvs.set(uv, uvIndex);
	} : function putUVIntoArray(uv, uvIndex)
	{
		this.triangleBuffer.vertexBuffer.uvs.splice.apply(this.triangleBuffer.vertexBuffer.uvs, [ uvIndex, 2 ].concat(uv));
	}, this);
} });
Object.defineProperty(GeometryAllocation.prototype, "putNormal", { get: function getPutNormal()
{
	return wrapFunction(this.triangleBuffer.vertexBuffer.normals instanceof Float32Array ? function putNormalIntoTypedArray(normal, normalIndex)
	{
		this.triangleBuffer.vertexBuffer.normals.set(normal, normalIndex);
	} : function putNormalIntoArray(normal, normalIndex)
	{
		this.triangleBuffer.vertexBuffer.normals.splice.apply(this.triangleBuffer.vertexBuffer.normals, [ normalIndex, 3 ].concat(normal));
	}, this);
} });
Object.defineProperty(GeometryAllocation.prototype, "putMatrix", { get: function getPutMatrix()
{
	return wrapFunction(this.triangleBuffer.vertexBuffer.matrices instanceof Float32Array ? function putMatrixIntoTypedArray(matrix, matrixIndex)
	{
		this.triangleBuffer.vertexBuffer.matrices.set(matrix, matrixIndex);
	} : function putMatrixIntoArray(matrix, matrixIndex)
	{
		this.triangleBuffer.vertexBuffer.matrices.splice.apply(this.triangleBuffer.vertexBuffer.matrices, [ matrixIndex, 16 ].concat(matrix));
	}, this);
} });

Object.defineProperty(GeometryAllocation.prototype, "disallocate", { value: function disallocate()
{
	this.buffer.allocations.splice(this.index, 1);
	var disallocations = [ ];
	var i = 0;
	var range = null;
	var allocation = this;
	this.buffer.disallocations.forEach(function expandExistingDisallocations(disallocation)
	{
		if(range)
		{
			if(range[1] >= disallocation[0])
			{
				if(range[1] <= disallocation[1])
				{
					disallocations.push([ disallocations.pop()[0], disallocation[1] ]);
					range = null;
				}
				else
					disallocations.push([ disallocations.pop()[0], range[1] ]);
				return;
			}
		}
		for(; i < allocation.ranges.length; i++)
		{
			range = allocation.ranges[i];
			if((range[0] >= disallocation[0] && range[0] <= disallocation[1]) || (range[1] >= disallocation[0] && range[1] <= disallocation[1]))
			{
				range = [ Math.min(range[0], disallocation[0]), Math.max(range[1], disallocation[1]) ];
				disallocations.push(range);
				i++;
				return;
			}
			else if(range[0] > disallocation[1] && range[0] > disallocation[1])
				break;
			else
				disallocations.push(range);
		}
		range = null;
		disallocations.push(disallocation);
	});
	this.buffer.disallocations = disallocations;
	this.buffer.triangles = new Uint16Array(Array.from(this.buffer.triangles).splice(this.triangleRange[0], this.triangleRange[1] - this.triangleRange[0]));
} });
Object.defineProperty(GeometryAllocation.prototype, "setVector", { value: function setVector(vertex, vector)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.putVector(vector, index * 3);
		this.triangleBuffer.vertexBuffer.vectors.modified = true;
	}
	return index;
} });
Object.defineProperty(GeometryAllocation.prototype, "setUV", { value: function setUV(vertex, uv)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.putUV(uv, index * 2);
		this.triangleBuffer.vertexBuffer.uvs.modified = true;
	}
	return index;
} });
Object.defineProperty(GeometryAllocation.prototype, "setNormal", { value: function setNormal(vertex, normal)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.putNormal(normal, index * 3);
		this.triangleBuffer.vertexBuffer.normals.modified = true;
	}
	return index;
} });
Object.defineProperty(GeometryAllocation.prototype, "setMatrix", { value: function setMatrix(vertex, matrix, preventApplication)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		if(preventApplication)
			this.unappliedMatrices[vertex] = Array.from(matrix);
		else
		{
			this.putMatrix(matrix, index * 16);
			this.triangleBuffer.vertexBuffer.matrices.modified = true;
		}
	}
} });
Object.defineProperty(GeometryAllocation.prototype, "setVertex", { value: function setVertex(vertex, vector, uv, normal, matrix)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.putVector(vector || [ 0, 0, 0 ], index * 3);
		this.putUV(uv || [ 0, 0 ], index * 2);
		this.putNormal(normal || [ 0, 0, 0 ], index * 3);
		this.putMatrix(matrix || mat4.identity([ ]), index* 16);
		this.triangleBuffer.vertexBuffer.vectors.modified = this.triangleBuffer.vertexBuffer.uvs.modified = this.triangleBuffer.vertexBuffer.normals.modified = this.triangleBuffer.vertexBuffer.matrices.modifed = true;
	}
	return index;
} });
Object.defineProperty(GeometryAllocation.prototype, "applyVertices", { value: function applyVertices()
{
	var putMatrix = wrapFunction(this.triangleBuffer.vertexBuffer.matrices instanceof Float32Array ? function putMatrixIntoTypedArray(matrix, matrixIndex)
	{
		this.triangleBuffer.vertexBuffer.matrices.set(matrix, matrixIndex);
	} : function putMatrixIntoArray(matrix, matrixIndex)
	{
		this.triangleBuffer.vertexBuffer.matrices.splice.apply(this.triangleBuffer.vertexBuffer.matrices, [ matrixIndex, 16 ].concat(matrix));
	}, this);
	this.unappliedMatrices.forEach(function applyVertexMatrix(matrix, vertex)
	{
		var index = this.getVertexIndex(vertex);
		if(index)
			putMatrix(matrix, index * 16);
	}, this);
	this.triangleBuffer.vertexBuffer.matrices.modified = true;
	this.unappliedMatrices = [ ];
} });

Object.defineProperty(GeometryAllocation.prototype, "getVertexIndex", { value: function getVertexIndex(vertex)
{
	var vertices = 0;
	var range = this.vertexRanges.find(function isVertexWithinRange(range)
	{
		vertices += range[1] - range[0];
		return vertices >= vertex;
	}) || [ 0, vertices - vertex ];
	return range[1] - vertices + vertex;
} });
Object.defineProperty(GeometryAllocation.prototype, "setTriangleCorner", { value: function setTriangleCorner(triangle, corner, vertex)
{
	var index = this.getTriangleIndex(triangle);
	if(index)
	{
		this.triangleBuffer.triangles[index + corner] = vertex;
		this.triangleBuffer.triangles.modified = true;
	}
	return index;
} });
Object.defineProperty(GeometryAllocation.prototype, "setTriangle", { value: function setTriangle(triangle, cornerVertex0, cornerVertex1, cornerVertex2)
{
	var index = this.getTriangleIndex(triangle);
	if(index)
	{
		this.triangleBuffer.triangles[index] = cornerVertex0;
		this.triangleBuffer.triangles[index + 1] = cornerVertex1;
		this.triangleBuffer.triangles[index + 2] = cornerVertex2;
		this.triangleBuffer.triangles.modified = true;
	}
	return index;
} });
Object.defineProperty(GeometryAllocation.prototype, "getTriangleIndex", { value: function getTriangleIndex(triangle)
{
	return (this.triangleRange[1] - this.triangleRange[0] > triangle ? this.triangleRange[0] + triangle : 0) * 3;
} });

function GeometryAllocation(triangleBuffer, index, vertexRanges, triangleRange)
{
	this.triangleBuffer = triangleBuffer;
	this.index = index;
	this.vertexRanges = vertexRanges;
	this.triangleRange = triangleRange;
	this.unappliedMatrices = [ ];
}

Object.defineProperty(TriangleBuffer.prototype, "allocate", { value: function allocate(vertexCount, triangleCount)
{
	triangleCount = triangleCount || vertexCount;
	var vertexRanges = [ ];
	var allocated = 0;
	var disallocations = [ ];
	this.vertexBuffer.disallocations.forEach(function addRangeToAllocate(disallocation)
	{
		var to = Math.min(disallocation[0] + Math.max(vertexCount - allocated, 0), disallocation[1]);
		if(allocated < vertexCount)
			vertexRanges.push([ disallocation[0], to ]);
		allocated += to - disallocation[0];
		if(to != disallocation[1])
		disallocations.push([ to, disallocation[1] ]);
	});
	this.disallocations = disallocations;
	var vectors = this.vertexBuffer.vectors instanceof Float32Array ? Array.from(this.vertexBuffer.vectors) : this.vertexBuffer.vectors;
	var uvs = this.vertexBuffer.uvs instanceof Float32Array ? Array.from(this.vertexBuffer.uvs) : this.vertexBuffer.uvs;
	var normals = this.vertexBuffer.normals instanceof Float32Array ? Array.from(this.vertexBuffer.normals) : this.vertexBuffer.normals;
	var matrices = this.vertexBuffer.matrices instanceof Float32Array ? Array.from(this.vertexBuffer.matrices) : this.vertexBuffer.matrices;
	var identityMatrix = mat4.identity([ ]);
	vertexRanges.forEach(function addVertexToRange(range)
	{
		for(var i = range[0]; i < range[1]; i++)
		{
			var xyzIndex = i * 3;
			var uvIndex = i * 2;
			vectors[xyzIndex] = vectors[xyzIndex + 1] = vectors[xyzIndex + 2] = uvs[uvIndex] = uvs[uvIndex + 1] = normals[xyzIndex] = normals[xyzIndex + 1] = normals[xyzIndex + 2] = 0;
			matrices.splice.apply(matrices, [ i * 16, 0 ].concat(identityMatrix));
		}
	});
	this.vertexBuffer.vectors = vectors;
	this.vertexBuffer.uvs = uvs;
	this.vertexBuffer.normals = normals;
	this.vertexBuffer.matrices = matrices;
	var triangleBuffer = this.triangles.glBuffer;
	var triangles = this.triangles instanceof Uint16Array ? Array.from(this.triangles) : this.triangles;
	this.triangles = triangles.concat(new Array(triangleCount * 3).fill(0));
	this.triangles.glBuffer = triangleBuffer;
	var allocation = new GeometryAllocation(this, this.vertexBuffer.allocations.length, vertexRanges, [ this.triangles.length / 3 - triangleCount, this.triangles.length / 3 ]);
	this.vertexBuffer.allocations.push(allocation);
	return allocation;
} });

function TriangleBuffer(vertexBuffer)
{
	this.vertexBuffer = vertexBuffer;
	this.triangles = [ 0, 0, 0 ];
}

function VertexBuffer()
{
	this.allocations = [ ];
	this.disallocations = [ [ 1, Infinity ] ];
	this.vectors = [ 0, 0, 0 ];
	this.uvs = [ 0, 0 ];
	this.normals = [ 0, 0, 0 ];
	this.matrices = mat4.identity([ ]);
}

Renderer.prototype = Object.create(ElementEventListener.prototype);
Renderer.prototype.constructor = Renderer;
Object.defineProperty(Renderer.prototype, "clearColor", { get: function getClearColor()
{
	return this._clearColor;
},
set: function setClearColor(clearColor)
{
	if(this._clearColor)
	{
		this._clearColor.removeWatcher(this.clearColorWatcher);
		delete this._clearColor.modified;
	}
	this._clearColor = clearColor;
	this.clearColorWatcher = this._clearColor.watch(function markClearColorAsModified()
	{
		this.clearColor.modified = true;
	}, this);
} });
Object.defineProperty(Renderer.prototype, "animate", { value: function animate(now)
{
	now /= 1000;
	if(this.then)
	{
		var delta = now - this.then;
		this.render();
	}
	this.then = now;
	this.nextAnimationFrame = requestAnimationFrame(wrapFunction(this.animate, this));
} });
Object.defineProperty(Renderer.prototype, "render", { value: function render(delta)
{
	var updateRequests = this.updateRequests;
	this.updateRequests = [ ];
	updateRequests.forEach(function callUpdateRequest(request)
	{
		if(request(delta))
		{
			index = this.updateRequests.push(request) - 1;
			if(request.reindexListener)
				request.reindexListener(index);
		}
	}, this);
	return true;
} });
Object.defineProperty(Renderer.prototype, "resize", { value: function resize()
{
	this.game.level.view.aspect = this.game.gui.view.aspect = window.innerWidth / window.innerHeight;
} });
Object.defineProperty(Renderer.prototype, "bindTextureMap", { value: function bindTextureMap()
{
} });
Object.defineProperty(Renderer.prototype, "unload", { value: function unload()
{
	cancelAnimationFrame(this.nextAnimationFrame);
	this.layers.forEach(function unloadLayer(layer)
	{
		layer.unload();
	});
} });

function Renderer(parameters)
{
	parameters = parameters || { };
	this.game = parameters.game;
	this.clearColor = new Color([ 1, 1, 1, 1 ]);
	if(!parameters.textureMap)
		parameters.textureMap = { };
	parameters.textureMap.renderer = this;
	this.textureMap = parameters.textureMap instanceof TextureMap ? parameters.textureMap : new TextureMap(parameters.textureMap);
	this.registeredLights = Number.isInteger(parameters.registeredLights) ? parameters.registeredLights : 0;
	this.updateRequests = Array.isArray(parameters.updateRequests) ? parameters.updateRequests : Array.from(parameters.updateRequests);
	this.layers = Array.isArray(parameters.layers) ? parameters.layers : Array.from(parameters.layers);
	this.vertexBuffer = new VertexBuffer();
	this.layers.forEach(function assignTriangleBufferToLayer(layer)
	{
		layer.triangleBuffer = new TriangleBuffer(this.vertexBuffer);
	}, this);
	this.resizeWrapper = wrapFunction(this.resize, this);
	ElementEventListener.call(this, parameters);
}

WebGLRenderer.prototype = Object.create(Renderer.prototype);
WebGLRenderer.prototype.constructor = WebGLRenderer;
Object.defineProperty(WebGLRenderer.prototype, "onElementDelete", { value: function onElementDelete()
{
	delete this.gl;
} });
Object.defineProperty(WebGLRenderer.prototype, "onElementSet", { value: function onElementSet()
{
	callSuper(this, "onElementSet");
	if(this.element.getContext)
	{
		this.gl = this.element.getContext("webgl2") || this.game.element.getContext("webgl") || this.game.element.getContext("experimental-webgl");
		this.setup();
		if(!this.shaders)
			this.requestShaders("default");
	}
} });
Object.defineProperty(WebGLRenderer.prototype, "setup", { value: function setup()
{
	this.gl.clearDepth(1);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.cullFace(this.gl.FRONT);
} });
Object.defineProperty(WebGLRenderer.prototype, "requestShaders", { value: function requestShaders(name)
{
	var shader = this.game.directory.shaders[name];
	var rawVertex;
	var rawFragment;
	var compileShaders = wrapFunction(function compileShaders()
	{
		if(rawVertex && rawFragment)
		{
			this.shaders = new GLSLShaders(this, { program: shader, vertex: { raw: rawVertex, canReformat: shader.vertex.canReformat, format: shader.vertex.format }, fragment: { raw: rawFragment, canReformat: shader.fragment.canReformat, format: shader.fragment.format } });
		}
	}, this);
	requestText("resources/shaders/" + shader.vertex.source, function compileIfFragmentPresent(text)
	{
		rawVertex = text;
		compileShaders();
	});
	requestText("resources/shaders/" + shader.fragment.source, function compileIfVertexPresent(text)
	{
		rawFragment = text;
		compileShaders();
	});	
} });
Object.defineProperty(WebGLRenderer.prototype, "render", { value: function render(delta)
{
	if(this.gl)
	{
		if(this.textureMap.modified)
		{
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.gl.createTexture());
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureMap.stitched);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
			this.gl.generateMipmap(this.gl.TEXTURE_2D);
			this.gl.activeTexture(this.gl.TEXTURE0);
			this.textureMap.modified = false;
			this.layers.forEach(function notifyLayerOfTextureMapChange(layer)
			{
				layer.onTextureMapChange(this);
			});
			this.textureMap.modified = false;
		}
		if(callSuper(this, "render", delta) && this.shaders)
		{
			var recompiled = this.shaders.tryRecompileShaders(this);
			if(this.clearColor.modified)
			{
				this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
				this.clearColor.modified = false;
			}
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
			if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) != this.shaders.program)
				this.gl.useProgram(this.shaders.program);
			if(!(this.vertexBuffer.vectors instanceof Float32Array) || recompiled)
			{
				var vectors = this.vertexBuffer.vectors = new Float32Array(this.vertexBuffer.vectors);
				if(!this.vectorGlBuffer)
					this.bindShaderAttribute(this.vectorGlBuffer = this.gl.createBuffer(), this.shaders.attributes.position, { });
				vectors.modified = true;
			}
			if(!(this.vertexBuffer.uvs instanceof Float32Array) || recompiled)
			{
				var uvs = this.vertexBuffer.uvs = new Float32Array(this.vertexBuffer.uvs);
				if(!this.uvGlBuffer)
					this.bindShaderAttribute(this.uvGlBuffer = this.gl.createBuffer(), this.shaders.attributes.textureCoordinate, { components: 2 });
				uvs.modified = true;
			}
			if(!(this.vertexBuffer.normals instanceof Float32Array) || recompiled)
			{
				var normals = this.vertexBuffer.normals = new Float32Array(this.vertexBuffer.normals);
				if(!this.normalGlBuffer)
					this.bindShaderAttribute(this.normalGlBuffer = this.gl.createBuffer(), this.shaders.attributes.normalDirection, { });
				normals.modified = true;
			}
			if(!(this.vertexBuffer.matrices instanceof Float32Array) || recompiled)
			{
				var matrices = this.vertexBuffer.matrices = new Float32Array(this.vertexBuffer.matrices);
				if(!this.matrixGlBuffer)
				{
					this.matrixGlBuffer = this.gl.createBuffer();
					for(var matrixVector = 0; matrixVector < 4; matrixVector++)
						this.bindShaderAttribute(this.matrixGlBuffer, this.shaders.attributes.vertexMatrix + matrixVector, { components: 4, stride: 64, offset: matrixVector * 16 });
				}
				matrices.modified = true;
			}
			if(this.vertexBuffer.vectors.modified)
			{
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vectorGlBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexBuffer.vectors, this.gl.DYNAMIC_DRAW);
				this.vertexBuffer.vectors.modified = false;
			}
			if(this.vertexBuffer.uvs.modified)
			{
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvGlBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexBuffer.uvs, this.gl.DYNAMIC_DRAW);
				this.vertexBuffer.uvs.modified = false;
			}
			if(this.vertexBuffer.normals.modified)
			{
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalGlBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexBuffer.normals, this.gl.DYNAMIC_DRAW);
				this.vertexBuffer.normals.modified = false;
			}
			if(this.vertexBuffer.matrices.modified)
			{
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.matrixGlBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexBuffer.matrices, this.gl.DYNAMIC_DRAW);
				this.vertexBuffer.matrices.modified = false;
			}
			var reassignTriangleBuffer = false;
			var shiftRequired = false;
			var preceedingTriangles = 0;
			this.layers.forEach(function shiftLayerTrianglesIfRequired(layer)
			{
				if(shiftRequired || layer.registeredTriangles < layer.triangleBuffer.triangles.length / 3)
				{
					layer.registeredTriangles = Math.pow(2, Math.ceil(Math.log2(layer.triangleBuffer.triangles.length / 3)));
					layer.preceedingTriangles = preceedingTriangles;
					var glBuffer = layer.triangleBuffer.triangles.glBuffer;
					layer.triangleBuffer.triangles = Array.from(layer.triangleBuffer.triangles).concat(new Array(layer.registeredTriangles * 3 - layer.triangleBuffer.triangles.length).fill(0));
					layer.triangleBuffer.triangles.glBuffer = glBuffer;
					preceedingTriangles += layer.registeredTriangles;
					shiftRequired = true;
				}
				else
					reassignTriangleBuffer = layer.triangleBuffer.triangles.modified;
			});
			if(shiftRequired)
			{
				this.triangleArrayBuffer = new ArrayBuffer(preceedingTriangles * 6);
				this.layers.forEach(function assignTrianglesToArrayBufferIfNotArrayBufferView(layer)
				{
					var originalTriangles = layer.triangleBuffer.triangles;
					layer.triangleBuffer.triangles = new Uint16Array(this.triangleArrayBuffer, layer.preceedingTriangles * 6, layer.registeredTriangles * 3);
					layer.triangleBuffer.triangles.set(originalTriangles);
				}, this);
				reassignTriangleBuffer = true;
			}
			if(!this.triangleGlBuffer)
				this.triangleGlBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleGlBuffer);
			if(reassignTriangleBuffer)
			{
				this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleArrayBuffer, this.gl.DYNAMIC_DRAW);
				this.layers.forEach(function markTrianglesAsUnmodified(layer)
				{
					layer.triangleBuffer.triangles.modified = false;
				});
			}
			if(this.game.materials.modified)
			{
				this.game.materials.forEach(function pushMaterialToGPUIfModified(material, materialIndex)
				{
					if(material.modified)
					{
						var materialUniforms = this.shaders.uniforms.materials[materialIndex];
						this.gl.uniform1f(materialUniforms.shininess, material.shininess);
						this.gl.uniform3f(materialUniforms.specularColor, material.specular[0], material.specular[1], material.specular[2]);
						material.modified = false;
					}
				}, this);
				this.game.materials.modified = false
			}
			this.layers.forEach(function drawLayer(layer, layerIndex)
			{
				if(layerIndex < this.shaders.registeredLayers)
				{
					var layerUniforms = this.shaders.uniforms.layers[layerIndex];
					if(layer.overlayColor.modified || recompiled)
					{
						this.gl.uniform4fv(layerUniforms.overlayColor, new Float32Array(layer.overlayColor));
						layer.overlayColor.modified = false;
					}
					this.gl.uniform1i(layerUniforms.lightCount, layer.lights.length);
					if(layer.lights.modified || recompiled)
					{
						layer.lights.forEach(function pushLightToGPUIfModified(light, lightIndex)
						{
							if(light.modified || recompiled)
							{
								var lightUniforms = layerUniforms.lights[lightIndex];
								this.gl.uniform1f(lightUniforms.ambience, light.ambience);
								this.gl.uniform1f(lightUniforms.attenuation, light.attenuation);
								var position = light.position;
								this.gl.uniform3f(lightUniforms.position, position[0], position[1], position[2]);
								var direction = light.direction;
								this.gl.uniform3f(lightUniforms.direction, light.direction[0], light.direction[1], light.direction[2]);
								var processedColor = light.processedColor;
								this.gl.uniform3f(lightUniforms.color, processedColor[0], processedColor[1], processedColor[2]);
								this.gl.uniform1i(lightUniforms.orthographic, light.orthographic);
								light.modified = false;
							}
						}, this);
						layer.lights.modified = false
					}
					if(layer.view.matrix.modified || recompiled)
					{
						this.gl.uniformMatrix4fv(layerUniforms.viewMatrix, false, layer.view.matrix);
						layer.view.matrix.modified = false;
					}
					this.gl.uniform1i(this.shaders.uniforms.renderingLayer, layerIndex);
					if(this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING) == this.triangleGlBuffer)
						this.gl.drawElements(this.gl.TRIANGLES, layer.triangleBuffer.triangles.length, this.gl.UNSIGNED_SHORT, layer.preceedingTriangles * 6);
				}
			}, this);
			return true;
		}
		return false;
	}
	callSuper(this, "render", delta);
	return false;
} });
Object.defineProperty(WebGLRenderer.prototype, "bindShaderAttribute", { value: function bindShaderAttribute(buffer, location, parameters)
{
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
	this.gl.vertexAttribPointer(location, parameters.components || 3, parameters.type || this.gl.FLOAT, parameters.normalize || false, parameters.stride || 0, parameters.offset || 0);
} });
Object.defineProperty(WebGLRenderer.prototype, "resize", { value: function resize()
{
	callSuper(this, "resize");
	this.gl.viewport(0, 0, innerWidth, innerHeight);
	this.game.element.width = innerWidth; this.game.element.height = innerHeight;
} });
Object.defineProperty(WebGLRenderer.prototype, "bindTextureMap", { value: function bindTextureMap()
{
	this.textureMap.modified = true;
} });

function WebGLRenderer(parameters)
{
	parameters = parameters || { };
	Renderer.call(this, parameters);
	this.triangleArrayBuffer = new ArrayBuffer(0);
}

Object.defineProperty(GLSLShaders.prototype, "populateProgram", { value: function populateProgram(program, parameters)
{
	program.canReformat = parameters.canReformat ? wrapFunction(new Function("renderer", parameters.canReformat), this) : alwaysFalse;
	program.preFormat = parameters.preFormat ? wrapFunction(new Function("renderer", parameters.preFormat), this) : self;
	return program;
} });
Object.defineProperty(GLSLShaders.prototype, "populateShader", { value: function populateShader(shader, parameters)
{
	shader.raw = parameters.raw || "";
	shader.canReformat = parameters.canReformat ? wrapFunction(new Function("renderer", parameters.canReformat), this) : alwaysFalse;
	shader.format = parameters.format ? wrapFunction(new Function("renderer", "raw", parameters.format), this) : self; 
	return shader;
} });
Object.defineProperty(GLSLShaders.prototype, "tryRecompileShaders", { value: function tryRecompileShaders(renderer)
{
	var program = this.program;
	var relink = this.program.canReformat(renderer);
	if(relink)
	{
		this.program.preFormat(renderer);
		this.compileShader(renderer, this.vertex);
		this.compileShader(renderer, this.fragment);
	}
	else
	{
		relink = this.tryRecompileShader(renderer, this.vertex) || relink;
		relink = this.tryRecompileShader(renderer, this.fragment) || relink;
	}
	if(relink)
	{
		renderer.gl.linkProgram(program);
		this.populateVariables(renderer);
	}
	return relink;
} });
Object.defineProperty(GLSLShaders.prototype, "tryRecompileShader", { value: function tryRecompileShader(renderer, shader)
{
	if(shader.canReformat(renderer))
	{
		this.compileShader(renderer, shader);
		return true;
	}
	return false;
} });
Object.defineProperty(GLSLShaders.prototype, "compileShader", { value: function compileShader(renderer, shader)
{
	renderer.gl.shaderSource(shader, shader.format(renderer, shader.raw));
	renderer.gl.compileShader(shader);
} });
Object.defineProperty(GLSLShaders.prototype, "populateVariables", { value: function populateVariables(renderer)
{
	this.attributes = this.getAttributes(renderer);
	this.uniforms = this.getUniforms(renderer);
	renderer.gl.enableVertexAttribArray(this.attributes.position);
	renderer.gl.enableVertexAttribArray(this.attributes.textureCoordinate);
	renderer.gl.enableVertexAttribArray(this.attributes.normalDirection);
	for(var i = 0; i < 4; i++)
		renderer.gl.enableVertexAttribArray(this.attributes.vertexMatrix + i);
} });
Object.defineProperty(GLSLShaders.prototype, "getAttributes", { value: function getAttributes(renderer)
{
	var attributes =
	{
		layerAndMaterial: renderer.gl.getAttribLocation(this.program, "aLayerAndMaterial"),
		position: renderer.gl.getAttribLocation(this.program, "aPosition"),
		textureCoordinate: renderer.gl.getAttribLocation(this.program, "aTextureCoordinate"),
		normalDirection: renderer.gl.getAttribLocation(this.program, "aNormalDirection"),
		vertexMatrix: renderer.gl.getAttribLocation(this.program, "aVertexMatrix")
	};
	return attributes;
} });
Object.defineProperty(GLSLShaders.prototype, "getUniforms", { value: function getUniforms(renderer)
{
	var uniforms =
	{
		uSampler: renderer.gl.getUniformLocation(this.program, "uSampler"),
		renderingLayer: renderer.gl.getUniformLocation(this.program, "uRenderingLayer"),
		layers: [ ],
		materials: [ ]
	};
	for(var i = 0; i < this.registeredLayers; i++)
	{
		var layerString = "uLayers[{0}]".format(i);
		layer = uniforms.layers[i] =
		{
			overlayColor: renderer.gl.getUniformLocation(this.program, layerString + ".overlayColor"),
			viewMatrix: renderer.gl.getUniformLocation(this.program, layerString + ".viewMatrix"),
			lightCount: renderer.gl.getUniformLocation(this.program, layerString + ".lightCount"),
			lights: [ ]
		};
		for(var j = 0; j < this.registeredLights; j++)
		{
			var lightString = layerString + ".lights[{0}]".format(j);
			layer.lights[j] =
			{
				ambience: renderer.gl.getUniformLocation(this.program, lightString + ".ambience"),
				attenuation: renderer.gl.getUniformLocation(this.program, lightString + ".attenuation"),
				position: renderer.gl.getUniformLocation(this.program, lightString + ".position"),
				direction: renderer.gl.getUniformLocation(this.program, lightString + ".direction"),
				color: renderer.gl.getUniformLocation(this.program, lightString + ".color"),
				orthographic: renderer.gl.getUniformLocation(this.program, lightString + ".orthographic")
			};
		}
	}
	for(var i = 0; i < this.registeredMaterials; i++)
	{
		var materialString = "uMaterials[{0}]".format(i);
		uniforms.materials[i] =
		{
			shininess: renderer.gl.getUniformLocation(this.program, materialString + ".shininess"),
			specularColor: renderer.gl.getUniformLocation(this.program, materialString + ".specularColor")
		};
	}
	return uniforms;
} });

function GLSLShaders(renderer, parameters)
{
	parameters = parameters || { };
	this.program = this.populateProgram(renderer.gl.createProgram(), parameters.program || { });
	this.vertex = this.populateShader(renderer.gl.createShader(renderer.gl.VERTEX_SHADER), parameters.vertex || { });
	this.fragment = this.populateShader(renderer.gl.createShader(renderer.gl.FRAGMENT_SHADER), parameters.fragment || { });
	this.program.preFormat(renderer);
	this.compileShader(renderer, this.vertex);
	this.compileShader(renderer, this.fragment);
	renderer.gl.attachShader(this.program, this.vertex);
	renderer.gl.attachShader(this.program, this.fragment);
	renderer.gl.linkProgram(this.program);
	this.populateVariables(renderer);
}

View.prototype = Object.create(Updatable.prototype);
View.prototype.constructor = View;
Object.defineProperty(View.prototype, "aspect", { get: function getAspect()
{
	return this._aspect;
}, set: function setAspect(aspect)
{
	this._aspect = aspect;
	this.requestUpdate();
} });
Object.defineProperty(View.prototype, "near", { get: function getNear()
{
	return this._near;
}, set: function setNear(near)
{
	this._near = near;
	this.requestUpdate();
} });
Object.defineProperty(View.prototype, "far", { get: function getFar()
{
	return this._far;
}, set: function setFar(far)
{
	this._far = far;
	this.requestUpdate();
} });

function View(parameters)
{
	parameters = parameters || { };
	Updatable.call(this, parameters);
	this.matrix = new Float32Array(mat4.create());
	this.matrix.defaultMatrix = true;
	this.matrix.modified = true;
	this.aspect = window.innerWidth / window.innerHeight;
	this.near = parameters.near || .1;
	this.far = parameters.far || 100;
}

PerspectiveView.prototype = Object.create(View.prototype);
PerspectiveView.prototype.constructor = PerspectiveView;
Object.defineProperty(PerspectiveView.prototype, "update", { value: function update()
{
	if(this.camera)
	{
		var position = (this.camera || { }).position;
		var rotation = (this.camera || { }).rotation;
		mat4.perspective(this.matrix, Math.rad(this.camera.fov), this.aspect, this.near, this.far);
		mat4.rotateX(this.matrix, this.matrix, Math.rad(-rotation[0]));
		mat4.rotateY(this.matrix, this.matrix, Math.rad(rotation[1]));
		mat4.rotateZ(this.matrix, this.matrix, Math.rad(rotation[2]));
		mat4.translate(this.matrix, this.matrix, [ -position[0], -position[1], -position[2] ]);
		this.matrix.identityMatrix = false;
		this.matrix.modified = true;
	}
	else if(!this.matrix.identityMatrix)
	{
		mat4.identity(this.matrix)
		this.matrix.identityMatrix = true;
		this.matrix.modified = true;
	}
} });
Object.defineProperty(PerspectiveView.prototype, "camera", { get: function getCamera()
{
	return this._camera;
}, set: function setCamera(camera)
{
	if(this._camera)
	{
		this._camera.removeWatcher(this.cameraWatcher);
		this._camera.position.removeWatcher(this.positionWatcher);
		this._camera.rotation.removeWatcher(this.rotationWatcher);
	}
	if(camera)
	{
		this.cameraWatcher = camera.watch(this.requestUpdate, this);
		this.positionWatcher = camera.position.watch(this.requestUpdate, this);
		this.rotationWatcher = camera.rotation.watch(this.requestUpdate, this);
	}
	else
	{
		this.cameraWatcher = undefined;
		this.positionWatcher = undefined;
		this.rotationWatcher = undefined;
		this.requestUpdate();
	}
	this._camera = camera; 
} });

function PerspectiveView(parameters)
{
	parameters = parameters || { };
	View.call(this, parameters);
	this.camera = parameters.camera;
}

OrthographicView.prototype = Object.create(View.prototype);
OrthographicView.prototype.constructor = OrthographicView;
Object.defineProperty(OrthographicView.prototype, "horizontal", { set: function setHorizontal(horizontal)
{
	this.left = -(this.right = horizontal / 2);
} });
Object.defineProperty(OrthographicView.prototype, "vertical", { set: function setVertical(vertical)
{
	this.bottom = -(this.top = vertical / 2);
} });
Object.defineProperty(OrthographicView.prototype, "left", { get: function getLeft()
{
	return this._left;
}, set: function setLeft(left)
{
	this._left = left;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicView.prototype, "right", { get: function getRight()
{
	return this._right;
}, set: function setRight(right)
{
	this._right = right;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicView.prototype, "bottom", { get: function getBottom()
{
	return this._bottom;
}, set: function setBottom(bottom)
{
	this._bottom = bottom;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicView.prototype, "top", { get: function getTop()
{
	return this._top;
}, set: function setTop(top)
{
	this._top = top;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicView.prototype, "update", { value: function update()
{
	mat4.ortho(this.matrix, this.left * this.aspect, this.right * this.aspect, this.bottom, this.top, this.near, this.far);
} });

function OrthographicView(parameters)
{
	parameters = parameters || { };
	View.call(this, parameters);
	this.left = parameters.left || parameters.horizontal / -2 || -1;
	this.right = parameters.right || parameters.horizontal / 2 || 1;
	this.bottom = parameters.bottom || parameters.vertical / -2 || -1;
	this.top = parameters.top || parameters.vertical / 2 || 1;
}

Light.prototype = Object.create(Watchable.prototype);
Light.prototype.constructor = Light;
Object.defineProperty(Light.prototype, "processedColor", { get: function getProcessedColor()
{
	return this.color.copy().multiply(this.intensity);
} });

function Light(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.ambience = Number.isFinite(parameters.ambience) ? parameters.ambience : 1;
	this.attenuation = Number.isFinite(parameters.attenuation) ? parameters.attenuation : 0;
	this.position = parameters.position instanceof Vector3 ? parameters.position : new Vector3(parameters.position);
	this.direction = parameters.direction instanceof Vector3 ? parameters.direction : new Vector3(parameters.direction);
	this.color = parameters.color instanceof Color ? parameters.color : new Color(parameters.color || [ 1, 1, 1 ]);
	this.orthographic = parameters.orthographic == false ? false : true;
	this.intensity = Number.isFinite(parameters.intensity) ? parameters.intensity : 1;
}

Layer.prototype = Object.create(Watchable.prototype);
Layer.prototype.constructor = Layer;
Object.defineProperty(Layer.prototype, "overlayColor", { get: function getOverlayColor()
{
	return this._overlayColor;
},
set: function setOverlayColor(overlayColor)
{
	if(this._overlayColor)
	{
		this._overlayColor.removeWatcher(this.overlayColorWatcher);
		delete this._overlayColor.modified;
	}
	this._overlayColor = overlayColor;
	this.overlayColorWatcher = this._overlayColor.watch(function markOverlayColorAsModified()
	{
		this.overlayColor.modified = true;
	}, this);
} });
Object.defineProperty(Layer.prototype, "lights", { get: function getLights()
{
	return this._lights;
}, set: function setLights(lights)
{
	if(this._lights)
		this._lights.forEach(function removeLightWatcher(light, index)
		{
			light.removeWatcher(this._lights.watchers[index]);
			delete light.modified;
		}, this);
	this._lights = lights;
	this._lights.watchers = [ ];
	this._lights.forEach(function watchLight(light, index)
	{
		this._lights.watchers[index] = light.watch(function marklLightAsModified()
		{
			this.lights.modified = light.modified = true;
		}, this);
	}, this);
} });
Object.defineProperty(Layer.prototype, "light", { set: function setLight(light)
{
	light.watch(function markLightAsModified()
	{
		this.lights.modified = light.modified = true;
	}, this);
	this.lights.push(light);
} });

Object.defineProperty(Layer.prototype, "onTextureMapChange", { value: function onTextureMapChange(renderer)
{
	this.geometries.forEach(function notifyGeometryOfTextureMapChange(geometry)
	{
		geometry.onTextureMapChange(renderer);
	});
} });

function Layer(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.game = parameters.game;
	this.geometries = [ ];
	this.overlayColor = new Color([ 1, 1, 1, 1 ]);
	if(!parameters.view)
		parameters.view = { };
	parameters.view.game = this.game;
	this.view = parameters.view instanceof View ? parameters.view : new View(parameters.view);
	this.lights = Array.isArray(parameters.lights) ? parameters.lights : [ ];
	if(!parameters.controls)
		parameters.controls = { };
	parameters.controls.game = this.game;
	this.controls = new Controls(parameters.controls);
	this.registeredTriangles = 0;
}

Gui.prototype = Object.create(Layer.prototype);
Gui.prototype.constructor = Gui;
Object.defineProperty(Gui.prototype, "unload", { value: function unload() { } });

function Gui(parameters)
{
	parameters = parameters || { };
	Layer.call(this, parameters);
	this.view = parameters.view instanceof OrthographicView ? parameters.view : new OrthographicView(parameters.view);
}

Object.defineProperty(Player.prototype, "updateCameraPosition", { value: function updateCameraPosition()
{
	this.camera.position.set(this.position.copy().add(this.headOffset));
} });
Object.defineProperty(Player.prototype, "instantControls", { value: function instantControls(params)
{
	var mouse = params.mouse;
	var lookAngle = NaN;
	var lookDistance = 0;
	if(mouse.instalook)
	{
		lookAngle = averageDegrees(lookAngle, mouse.instalook.horizontal ? degreesReflectionX(mouse.instalook.horizontal[0]) : NaN);
		lookDistance = mouse.instalook.horizontal ? Math.max(Math.min(mouse.instalook.horizontal[1], 2), lookDistance) : lookDistance;
	}
	if(!isNaN(lookAngle))
	{
		this.camera.rotation[0] = Math.max(Math.min(this.camera.rotation[0] + Math.cos(Math.rad(lookAngle)) * lookDistance, 90), -90);
		this.camera.rotation[1] += Math.sin(Math.rad(lookAngle)) * lookDistance;
	}
} });
Object.defineProperty(Player.prototype, "controlsLoop", { value: function controlsLoop(timestamps, last, now)
{
	timestamps.forEach(function timeBasedMove(timestamp)
	{
		var positionOffset = [ 0, 0, 0 ];
		var mouse = timestamp.params.mouse || { };
		var keyboard = timestamp.params.keyboard || { };
		var gamepad = timestamp.params.gamepad || { };
		var lookAngle = NaN;
		var lookDistance = 0;
		if(keyboard.look)
		{
			lookAngle = averageDegrees(lookAngle, averageDegrees(averageDegrees(keyboard.look.downwards ? 180 : NaN, keyboard.look.upwards ? 0 : NaN), averageDegrees(keyboard.look.leftwards ? -90 : NaN, keyboard.look.rightwards ? 90 : NaN)));
			lookDistance = 1;
		}
		if(gamepad.look)
		{
			lookAngle = averageDegrees(lookAngle, averageDegrees(averageDegrees(gamepad.look.downwards ? 180 : NaN, gamepad.look.upwards ? 0 : NaN), averageDegrees(gamepad.look.leftwards ? -90 : NaN, gamepad.look.rightwards ? 90 : NaN)));
			lookAngle = averageDegrees(lookAngle, gamepad.look.horizontal ? gamepad.look.horizontal[0] : NaN);
			lookDistance = gamepad.look.horizontal ? Math.max(Math.min(gamepad.look.horizontal[1], 1), lookDistance) : lookDistance;
		}
		if(!isNaN(lookAngle))
		{
			this.camera.rotation[0] = Math.max(Math.min(this.camera.rotation[0] + Math.cos(Math.rad(lookAngle)) * lookDistance, 90), -90);
			this.camera.rotation[1] += Math.sin(Math.rad(lookAngle)) * lookDistance;
		}
		var moveAngle = NaN;
		var moveDistance = 1;
		if(keyboard.movement)
		{
			moveAngle = averageDegrees(moveAngle, averageDegrees(averageDegrees(keyboard.movement.forwards ? 0 : NaN, keyboard.movement.backwards ? 180 : NaN), averageDegrees(keyboard.movement.leftwards ? -90 : NaN, keyboard.movement.rightwards ? 90 : NaN)));
			positionOffset[1] += ((keyboard.movement.upwards ? 1 : 0) + (keyboard.movement.downwards ? -1 : 0)) * timestamp.time / 1000;
		}
		if(gamepad.movement)
		{
			moveAngle = averageDegrees(moveAngle, averageDegrees(averageDegrees(gamepad.movement.forwards ? 0 : NaN, gamepad.movement.backwards ? 180 : NaN), averageDegrees(gamepad.movement.leftwards ? -90 : NaN, gamepad.movement.rightwards ? 90 : NaN)));
			moveAngle = averageDegrees(moveAngle, gamepad.movement.horizontal ? gamepad.movement.horizontal[0] : NaN);
			moveDistance = gamepad.movement.horizontal ? gamepad.movement.horizontal[1] : moveDistance;
			positionOffset[1] += ((gamepad.movement.upwards ? 1 : 0) + (gamepad.movement.downwards ? -1 : 0)) * timestamp.time / 1000;
		}
		if(!isNaN(moveAngle))
		{
			positionOffset[0] += Math.sin(Math.rad(this.camera.rotation[1]) + Math.rad(moveAngle)) * timestamp.time / 1000 * moveDistance;
			positionOffset[2] -= Math.cos(Math.rad(this.camera.rotation[1]) + Math.rad(moveAngle)) * timestamp.time / 1000 * moveDistance;
		}
		if(keyboard)
		{
		}
		this.position.add(positionOffset);
	}, this);
} });

function Player(parameters)
{
	parameters = parameters || { };
	this.level = parameters.level;
	this.camera = new Camera(parameters.camera);
	this.position = parameters.position instanceof Vector3 ? parameters.position : new Vector3(parameters.position);
	this.headOffset = parameters.eyeOffset instanceof Vector3 ? parameters.headOffset : new Vector3(parameters.eyeOffset || [ 0, 1, 0 ]);
	this.position.watch(this.updateCameraPosition, this);
	this.headOffset.watch(this.updateCameraPosition, this);
	this.headRotation = parameters.headRotation instanceof RotationVector3 ? parameters.headRotation : new RotationVector3(parameters.headRotation);
	this.controlsLoopWrapped = wrapFunction(this.controlsLoop, this);
}

Level.prototype = Object.create(Layer.prototype);
Level.prototype.constructor = Level;
Object.defineProperty(Level.prototype, "unload", { value: function unload()
{
} });

function Level(parameters)
{
	parameters = parameters || { };
	Layer.call(this, parameters);
	if(!parameters.player)
		parameters.player = { };
	parameters.player.level = this;
	this.player = new Player(parameters.player);
	this.controls.requiresPointerLock = true;
	this.view = parameters.view instanceof PerspectiveView ? parameters.view : new PerspectiveView(Object.assign(parameters.view || { }, { camera: this.player.camera }));
}

Game.prototype = Object.create(ElementEventListener.prototype);
Game.prototype.constructor = Game;
Object.defineProperty(Game.prototype, "activeControlsArray", { get: function getActiveControlsArray()
{
	return this._activeControlsArray;
},
set: function setActiveControlsArray(controlsArray)
{
	if(this._activeControlsArray)
		this._activeControlsArray.forEach(function setActiveControlElementToUndefined(activeControl)
		{
			activeControl.stopControlsLoop();
			activeControl.element = undefined;
		});
	this._activeControlsArray = controlsArray || [ ];
	this._activeControlsArray.forEach(function setActiveControlElementToCurrent(activeControl)
	{
		activeControl.element = this.element;
		activeControl.startControlsLoop();
	}, this);
} });
Object.defineProperty(Game.prototype, "activeControls", { set: function setActiveControls(controls)
{
	if(controls instanceof Controls)
	{
		this.activeControlsArray.push(controls);
		controls.element = this.element;
		controls.startControlsLoop();
	}
} });
Object.defineProperty(Game.prototype, "materials", { get: function getMaterials()
{
	return this._materials;
}, set: function setMaterials(materials)
{
	if(this._materials)
		this._materials.forEach(function unwatchMaterial(material, index)
		{
			material.unwatch(this._materials.watchers[index]);
		}, this);
	this._materials = materials || [ ];
	this._materials.watchers = [ ]
	this._materials.forEach(function watchMaterial(material, index)
	{
		this._materials.watchers[index] = material.watch(function markMaterialAsModified()
		{
			this.materials.modified = material.modified = true;
		}, this);
	}, this);
} });
Object.defineProperty(Game.prototype, "material", { set: function setMaterial(material)
{
	if(material instanceof Material)
	{
		this.materials.watchers[this.materials.push(material) - 1] = material.watch(function markMaterialAsModified()
		{
			this.materials.modified = material.modified = true;
		}, this);
	}
} });
Object.defineProperty(Game.prototype, "onElementDelete", { value: function onElementDelete()
{
	callSuper(this, "onElementDelete");
	if(this.element.requestFullscreen == this.element.webkitRequestFullscreen || this.element.requestFullscreen == this.element.mozRequestFullScreen || this.element.requestFullscreen == this.element.msRequestFullscreen)
		delete this.element.requestFullscreen;
	if(this.element.requestPointerLock == this.element.webkitRequestPointerLock || this.element.requestPointerLock == this.element.mozRequestPointerLock)
		delete this.element.requestPointerLock;
	this.renderer.element = this.controls.element = undefined;
} });
Object.defineProperty(Game.prototype, "onElementSet", { value: function onElementSet()
{
	callSuper(this, "onElementSet");
	this.element.requestFullscreen = this.element.requestFullscreen || this.element.webkitRequestFullscreen || this.element.mozRequestFullScreen || this.element.msRequestFullscreen;
	this.element.requestPointerLock = this.element.requestPointerLock || this.element.webkitRequestPointerLock || this.element.mozRequestPointerLock;
	this.renderer.element = this.element;
	this.renderer.layers.forEach(function setLayerControlsElement(layer)
	{
		layer.controls.element = this.element;
	}, this);
} });
Object.defineProperty(Game.prototype, "pushUpdateRequest", { value: function pushUpdateRequest(request)
{
	return this.renderer.updateRequests.push(request) - 1;
}, writable: true });
Object.defineProperty(Game.prototype, "replaceUpdateRequest", { value: function replaceUpdateRequest(request, index)
{
	var oldRequest = this.renderer.updateRequests[index];
	this.renderer.updateRequests[index] = request;
	return oldRequest;
} });
Object.defineProperty(Game.prototype, "pullUpdateRequest", { value: function pullUpdateRequest(index)
{
	delete this.renderer.updateRequests[index];
}, writable: true });
Object.defineProperty(Game.prototype, "unload", { value: function unload(event)
{
	this.save();
	this.controls.unload();
	this.renderer.unload();
	this.removeEventListener("contextmenu");
	window.removeEventListener("beforeunload", this.unloadWrapper);
	return "g";
} });
Object.defineProperty(Game.prototype, "save", { value: function save()
{
} });

function Game(parameters)
{
	parameters = parameters || { };
	if(!parameters.renderer)
		parameters.renderer = { };
	parameters.renderer.game = this;
	var updateRequests = parameters.renderer.updateRequests || [ ];
	this.pushUpdateRequest = function pushUpdateRequest(request)
	{
		return updateRequests.push(request);
	};
	this.replaceUpdateRequest = function replaceUpdateRequest(request, index)
	{
		var oldRequest = updateRequests[index];
		updateRequests[index] = request;
		return oldRequest;
	};
	this.pullUpdateRequest = function pullUpdateRequest(index)
	{
		delete updateRequests[index];
	};
	this.directory = parameters.directory || { };
	this.options = { controls: { gamepad: { deadZone: .3 } } };
	this.materials = [ ];
	if(!parameters.gui)
		parameters.gui = { };
	parameters.gui.game = this;
	this.gui = new Gui(parameters.gui);
	if(!parameters.level)
		parameters.level = { };
	parameters.level.game = this;
	this.level = new Level(parameters.level);
	this.activeControlsArray = [ ];
	if(parameters.renderer)
		parameters.renderer.layers = [ this.gui, this.level ].concat(parameters.renderer.layers || [ ]);
	else
		parameters.renderer = { layers: [ this.gui, this.level ] };
	parameters.renderer.updateRequests = updateRequests;
	this.renderer = new WebGLRenderer(parameters.renderer);
	this.pushUpdateRequest = Game.prototype.pushUpdateRequest;
	this.replaceUpdateRequest = Game.prototype.replaceUpdateRequest;
	this.pullUpdateRequest = Game.prototype.pullUpdateRequest;
	window.addEventListener("resize", this.renderer.resizeWrapper);
	window.addEventListener("beforeunload", this.unloadWrapper = wrapFunction(this.unload, this));
	ElementEventListener.call(this, parameters);
	this.addEventListener("contextmenu", wrapEventListener(function preventContextMenu(preventDefault) { return true; }, this));
	this.addEventListener("click", function requestPointerLockOnElement()
	{
		if(this.activeControlsArray.some(function requiresPointerLock(activeControls)
		{
			return activeControls.requiresPointerLock;
		}) && this.element.requestPointerLock)
			this.element.requestPointerLock();
	});
	this.renderer.animate();
	this.activeControls = this.level.controls;
}