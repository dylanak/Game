function emptyFunction()
{
}

function self(arg)
{
	return arg;
}

function constant(constantRet)
{
	return function returnConstant()
	{
		return constantRet;
	};
}

function isBaseOf(base, value)
{
	return (Math.log10(value) / Math.log10(base)) % 1 == 0;
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
	request.addEventListener("load", function onTextLoad()
	{
		onload(this.status == 200 ? this.responseText : "");
	});
	request.open("GET", source);
	request.send();
	return request;
}

Object.defineProperties(ElementEventListener.prototype = Object.create(Object.prototype),
{
	constructor: { value: ElementEventListener },
	element: { get: function getElement()
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
	} },
	onElementDelete: { value: function onElementDelete()
	{
		this.eventListeners.events.forEach(function removeEventListenerFromPreviousElement(event)
		{
			this.element.removeEventListener(event, this.eventListeners[event]);
		}, this);
	} },
	onElementSet: { value: function onElementSet()
	{
		this.eventListeners.events.forEach(function addEventListenerToNewEntry(event)
		{
			this.element.addEventListener(event, this.eventListeners[event]);
		}, this);
	} },
	addEventListener: { value: function addEventListener(event, func) 
	{
		if(this.eventListeners[event])
			this.removeEventListener(event);
		else
			this.eventListeners.events.push(event);
		var wrappedFunc = this.eventListeners[event] = func.bind(this);
		if(this.element)
			this.element.addEventListener(event, wrappedFunc);
	} },
	removeEventListener: { value: function removeEventListener(event)
	{
		if(this.element)
			this.element.removeEventListener(event, this.eventListeners[event]);
		delete this.eventListeners.events[this.eventListeners.events.indexOf(event)];
		delete this.eventListeners[event];
	} },
	reset: { value: function reset()
	{
	} }
});

function ElementEventListener(parameters)
{
	parameters = parameters || { };
	this.reset();
	this.eventListeners = Object.assign({ events: [ ] }, parameters.eventListeners || { });
	this.element = parameters.element;
}

Object.defineProperties(ElementFocusEventListener.prototype = Object.create(ElementEventListener.prototype), 
{
	constructor: { value: ElementFocusEventListener },
	focused: { get: function isFocused()
	{
		return this.element && document.hasFocus() && document.activeElement == this.element;
	} }
});

function ElementFocusEventListener(parameters)
{
	ElementEventListener.call(this, parameters);
	this.addEventListener("blur", this.reset);
}

Object.defineProperties(Watcher.prototype = Object.create(Object.prototype),
{
	constructor: { value: Watcher },
	watching: { get: function getWatching()
	{
		return this._watching;
	}, set: function setWatching(watching)
	{
		if(this.watching != watching)
		{
			if(this.watching)
				this.watching.removeWatcher(this);
			this._watching = watching;
			this.watching.addWatcher(this);
			this.notify();

		}
	} },
	notify: { value: function notify(oldValue)
	{
		this.func(this.watching, oldValue);
	} }
});

function Watcher(func, watching)
{
	this.func = func;
}

Object.defineProperties(Watchable.prototype = Object.create(Object.prototype),
{
	constructor: { value: Watchable },
	watch: { value: function watch(func)
	{
		var watcher = new Watcher(func);
		watcher.watching = this;
		return watcher;
	} },
	addWatcher: { value: function addWatcher(watcher)
	{
		if(!this.watchers.includes(watcher))
		{
			this.watchers.push(watcher);
			watcher.watching = this;
		}
	} },
	removeWatcher: { value: function removeWatcher(watcher)
	{
		var index = this.watchers.indexOf(watcher);
		if(index >= 0)
		{
			this.watchers.splice(index, 1);
			watcher.watching = undefined;
		}
	} },
	notifyWatchers: { value: function notifyWatchers(oldValue)
	{
		(this.watchers || [ ]).forEach(function notifyWatcher(watcher)
		{
			watcher.notify(oldValue);
		}, this);
	} }
});

function Watchable(parameters)
{
	parameters = parameters || { };
	this.watchers = [ ];
	Array.from(parameters.watchers || [ ]).forEach(function addWatcherFromParameters(watcher)
	{
		this.addWatcher(watcher);
	}, this);
}

Object.defineProperties(WatchableValue.prototype = Object.create(Watchable.prototype),
{
	constructor: { value: WatchableValue },
	callback: { get: function getCallback()
	{
		return this._callback;
	}, set: function setCallback(callback)
	{
		this._callback = callback;
		this.value = this.value;
	} },
	value: { get: function getValue()
	{
		return this._value;
	}, set: function setValue(value)
	{
		var oldValue = this._value;
		this._value = this.callback(value, oldValue);
		this.notifyWatchers(oldValue);
		if(this.parent)
			this.parent.notifyWatchers();
	} }
});

function WatchableValue(parameters)
{
	parameters = parameters || { };
	this.parent = parameters.parent instanceof Watchable ? parameters.parent : null;
	this.callback = parameters.callback instanceof Function ? parameters.callback : self;
	this.value = parameters.value;
	Watchable.call(this, parameters);
}

Object.defineProperties(Updatable,
{
	update: { value: function update(delta)
	{
		this.updateRequestIndex = undefined;
		this.update.forEach(function fireUpdateCallback(update)
		{
			update(delta);
		});
		this.notifyWatchers();
	} }
});
Object.defineProperties(Updatable.prototype = Object.create(Watchable.prototype),
{
	constructor: { value: Updatable },
	requestUpdate: { value: function requestUpdate()
	{
		if(this.requestUpdates && !Number.isInteger(this.updateRequestIndex))
			this.updateRequestIndex = this.game.pushUpdateRequest(this.update[-1].bind(this));
	} }
});

function Updatable(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.game = parameters.game;
	this.requestUpdates = parameters.requestUpdates == false ? false : true;
	this.update = [ ];
	this.update[-1] = Updatable.update.bind(this);
}

var Vector = [ ];

Vector[0] = function BaseVector(parameters)
{
	Watchable.call(this, parameters);
};
Object.defineProperties(Vector,
{
	neverNaN: { value: function neverNaN(value)
	{
		return value || 0;
	} },
	elements: { value: [ "x", "y", "z", "w" ] }
});
Object.defineProperties(Vector[0].prototype = Object.create(Watchable.prototype),
{
	constructor: { value: Vector[0] }
});
Vector.elements.forEach(function addVectorIWithElementI(elementName, elementIndex)
{
	var watchableElementName = "_" + elementName;
	var iMinus1VectorPrototype = Vector[elementIndex];
	var vectorIPrototype = function VectorI(parameters)
	{
		parameters = parameters || { };
		iMinus1VectorPrototype.call(this, parameters);
		value = this[watchableElementName] = parameters.length ? new WatchableValue({ parent: this, callback: Vector.neverNaN, value: parameters[elementIndex] }) : Number.isFinite(parameters[elementName]) ? new WatchableValue({ value: parameters[elementName] }) : parameters[watchableElementName] instanceof WatchableValue ? parameters[watchableElementName] : new WatchableValue();
		value.callback = Vector.neverNaN;
		value.parent = this;
	};
	var addCallbacks = [ ];
	var setCallbacks = [ ];
	for(let i = 0; i <= elementIndex; i++)
	{
		let eln = Vector.elements[i];
		let weln = "_" + eln;
		addCallbacks[i] = function addElementInVector(args, vector)
		{
			if(args[i])
			{
				vector[weln]._value += args[i];
				vector[weln].notifyWatchers();
			}
		};
		setCallbacks[i] = function setElementInVector(args, vector)
		{
			if(args[i])
			{
				vector[weln]._value = args[i];
				vector[weln].notifyWatchers();
			}
		};
	}
	var vectorIProperties =
	{
		constructor: { value: vectorIPrototype },
		copy: { value: function copy()
		{
			return new vectorIPrototype(Array.from(this));
		} },
		add: { value: function add()
		{
			var args = arguments;
			if((args[0] || [ ]).length)
				args = args[0];
			addCallbacks.forEach(function callAddCallback(addCallback)
			{
				addCallback(args, this);
			}, this);
			this.notifyWatchers();
			return this;
		} },
		set: { value: function set()
		{
			var args = arguments;
			if((args[0] || [ ]).length)
				args = args[0];
			setCallbacks.forEach(function callSetCallback(setCallback)
			{
				setCallback(args, this);
			}, this);
			this.notifyWatchers();
			return this;
		} },
		length: { value: elementIndex + 1 }
	};
	vectorIProperties[elementIndex] = vectorIProperties[elementName] = { get: function getElement()
	{
		return this[watchableElementName].value;
	}, set: function setElement(element)
	{
		this[watchableElementName].value = element;
	} };
	Object.defineProperties(vectorIPrototype.prototype = Object.create(iMinus1VectorPrototype.prototype), vectorIProperties);
	Vector[elementIndex + 1] = vectorIPrototype;
});

var RotationVector = [ ];

Object.defineProperties(RotationVector,
{
	callbackSetters: { value: [ ] }
});
Vector.forEach(function addRotationVectorI(vectorIPrototype, index)
{
	var elementName = Vector.elements[index - 1];
	var watchableElementName = "_" + elementName;
	if(elementName)
		RotationVector.callbackSetters.push(function setCallback(vector)
		{
			vector[watchableElementName].callback = wrapRadians;
		});
	var callbackSetters = Array.from(RotationVector.callbackSetters);
	var rotationVectorIPrototype = function RotationVectorI(parameters)
	{
		vectorIPrototype.call(this, parameters);
		callbackSetters.forEach(function callCallbackSetter(callbackSetter)
		{
			callbackSetter(this);
		}, this);
	};
	Object.defineProperties(rotationVectorIPrototype.prototype = Object.create(vectorIPrototype.prototype),
	{
		constructor: { value: rotationVectorIPrototype },
		copy: { value: function copy()
		{
			return new rotationVectorIPrototype(Array.from(this));
		} }

	});
	RotationVector[index] = rotationVectorIPrototype;
});

var AdditiveVector = [ ];

Object.defineProperties(AdditiveVector,
{
	baseValueSetters: { value: [ ] },
	baseValueWatchers: { value: [ ] },
	watchableValueSetters: { value: [ ] },
	childVectorWatchers: { value: [ ] }
});
Vector.forEach(function addAdditiveVectorI(vectorIPrototype, index)
{
	var elementName = Vector.elements[index - 1];
	var watchableElementName = "_" + elementName;
	var baseElementName = "base" + (elementName ? elementName.toUpperCase() : undefined);
	if(elementName)
	{
		var childVectorElementWatcher = function changeElementByNewMinusOld(newWatchable, old)
		{
			this[watchableElementName]._value += newWatchable.value - old || 0;
			this[watchableElementName].notifyWatchers();
			this.notifyWatchers();
		};
		var addElementsFromChildVectors = function addElementsFromChildVectors()
		{
			var value = this[baseElementName].value;
			(this.childVectors || [ ]).forEach(function addElementFromChildVector(childVector)
			{
				value += (childVector[elementName] || 0);
			});
			return value;
		};
		AdditiveVector.baseValueSetters.push(function setBaseValue(vector, parameters)
		{
			baseValue = vector[baseElementName] = Number.isFinite(parameters[elementName]) ? new WatchableValue({ value: parameters[elementName] }) : parameters[baseElementName] instanceof WatchableValue ? parameters[baseElementName] : new WatchableValue();
			baseValue.callback = Vector.neverNaN;
		});
		AdditiveVector.watchableValueSetters.push(function setWatchableValue(vector)
		{
			vector[watchableElementName] = new WatchableValue({ parent: vector, callback: addElementsFromChildVectors.bind(vector) });
		});
		AdditiveVector.baseValueWatchers.push(function watchBaseValue(vector)
		{
			vector[baseElementName].watch(childVectorElementWatcher.bind(vector));
		});
		AdditiveVector.childVectorWatchers.push(function watchChildVectorElement(vector, childVector)
		{
			childVector[watchableElementName].watch(childVectorElementWatcher.bind(vector));
		});
	}
	var baseValueSetters = Array.from(AdditiveVector.baseValueSetters);
	var watchableValueSetters = Array.from(AdditiveVector.watchableValueSetters);
	var baseValueWatchers = Array.from(AdditiveVector.baseValueWatchers);
	var childVectorWatchers = Array.from(AdditiveVector.childVectorWatchers);
	var additiveVectorIPrototype = function AdditiveVectorI(parameters)
	{
		parameters = parameters || { };
		vectorIPrototype.call(this, parameters);
		var childVectors = parameters.childVectors;
		if(!parameters.childVectors && parameters.length && parameters[0] instanceof vectorIPrototype)
			childVectors = parameters;
		this.childVectors = childVectors;
		baseValueSetters.forEach(function callBaseValueSetter(baseValueSetter)
		{
			baseValueSetter(this, parameters);
		}, this);
		watchableValueSetters.forEach(function callWatchableValueSetter(watchableValueSetter)
		{
			watchableValueSetter(this);
		}, this);
		baseValueWatchers.forEach(function callBaseValueWatcher(baseValueWatcher)
		{
			baseValueWatcher(this);
		}, this);
		this.childVectors.forEach(function watchChildVectorElements(childVector)
		{
			childVectorWatchers.forEach(function callChildVectorWatcher(childVectorWatcher)
			{
				childVectorWatcher(this, childVector);
			}, this);
		}, this);
	}
	var additiveVectorProperties =
	{
		constructor: { value: additiveVectorIPrototype }
	};
	for(let element = 0; element < index; element++)
	{
		let eln = Vector.elements[element];
		let weln = "_" + eln;
		let beln = "base" + eln.toUpperCase();
		additiveVectorProperties[element] = additiveVectorProperties[eln] = { get: function getElement()
		{
			return this[weln].value;
		},
		set: function setElement(value)
		{
			this[beln].value = value;
		} }
	}
	Object.defineProperties(additiveVectorIPrototype.prototype = Object.create(vectorIPrototype.prototype), additiveVectorProperties);
	AdditiveVector[index] = additiveVectorIPrototype;
});

var MultiplicativeVector = [ ];

Object.defineProperties(MultiplicativeVector,
{
	baseValueSetters: { value: [ ] },
	baseValueWatchers: { value: [ ] },
	watchableValueSetters: { value: [ ] },
	childVectorWatchers: { value: [ ] }
});
Vector.forEach(function addMultiplicativeVectorI(vectorIPrototype, index)
{
	var elementName = Vector.elements[index - 1];
	var watchableElementName = "_" + elementName;
	var baseElementName = "base" + (elementName ? elementName.toUpperCase() : undefined);
	if(elementName)
	{
		var childVectorElementWatcher = function changeElementByNewOverOld(newWatchable, old)
		{
			this[watchableElementName]._value *= newWatchable.value / old || 1;
			this[watchableElementName].notifyWatchers();
			this.notifyWatchers();
		};
		var multiplyElementsFromChildVectors = function multiplyElementsFromChildVectors()
		{
			var value = this[baseElementName];
			(this.childVectors || [ ]).forEach(function multiplyElementFromChildVector(childVector)
			{
				value *= (childVector[elementName] || 1);
			});
			return value;
		};
		MultiplicativeVector.baseValueSetters.push(function setBaseValue(vector, parameters)
		{
			baseValue = vector[baseElementName] = Number.isFinite(parameters[elementName]) ? new WatchableValue({ value: parameters[elementName] }) : parameters[baseElementName] instanceof WatchableValue ? parameters[baseElementName] : new WatchableValue();
			baseValue.callback = Vector.neverNaN;
		});
		MultiplicativeVector.watchableValueSetters.push(function setWatchableValue(vector)
		{
			vector[watchableElementName] = new WatchableValue({ parent: vector, callback: multiplyElementsFromChildVectors.bind(vector) });
		});
		MultiplicativeVector.baseValueWatchers.push(function watchBaseValue(vector)
		{
			vector[baseElementName].watch(childVectorElementWatcher.bind(vector));
		});
		MultiplicativeVector.childVectorWatchers.push(function watchChildVectorElement(vector, childVector)
		{
			childVector[watchableElementName].watch(childVectorElementWatcher.bind(vector));
		});
	}
	var baseValueSetters = Array.from(MultiplicativeVector.baseValueSetters);
	var watchableValueSetters = Array.from(MultiplicativeVector.watchableValueSetters);
	var baseValueWatchers = Array.from(MultiplicativeVector.baseValueWatchers);
	var childVectorWatchers = Array.from(MultiplicativeVector.childVectorWatchers);
	var multiplicativeVectorIPrototype = function MultiplicativeVectorI(parameters)
	{
		parameters = parameters || { };
		vectorIPrototype.call(this, parameters);
		var childVectors = parameters.childVectors;
		if(!parameters.childVectors && parameters.length && parameters[0] instanceof vectorIPrototype)
			childVectors = parameters;
		this.childVectors = childVectors;
		baseValueSetters.forEach(function callBaseValueSetter(baseValueSetter)
		{
			baseValueSetter(this, parameters);
		}, this);
		watchableValueSetters.forEach(function callWatchableValueSetter(watchableValueSetter)
		{
			watchableValueSetter(this);
		}, this);
		baseValueWatchers.forEach(function callBaseValueWatcher(baseValueWatcher)
		{
			baseValueWatcher(this);
		}, this);
		this.childVectors.forEach(function watchChildVectorElements(childVector)
		{
			childVectorWatchers.forEach(function callChildVectorWatcher(childVectorWatcher)
			{
				childVectorWatcher(this, childVector);
			}, this);
		}, this);
	}
	var multiplicativeVectorProperties =
	{
		constructor: { value: multiplicativeVectorIPrototype }
	};
	for(let element = 0; element < index; element++)
	{
		let eln = Vector.elements[element];
		let weln = "_" + eln;
		let beln = "base" + eln.toUpperCase();
		multiplicativeVectorProperties[element] = multiplicativeVectorProperties[eln] = { get: function getElement()
		{
			return this[weln].value;
		},
		set: function setElement(value)
		{
			this[beln].value = value;
		} }
	}
	Object.defineProperties(multiplicativeVectorIPrototype.prototype = Object.create(vectorIPrototype.prototype), multiplicativeVectorProperties);
	MultiplicativeVector[index] = multiplicativeVectorIPrototype;
});

Object.defineProperties(Color,
{
	betweenZeroAndOne: { value: function betweenZeroAndOne(number)
	{
		return Math.max(0, Math.min(1, number || 0));
	} }
});
Object.defineProperties(Color.prototype = Object.create(Watchable.prototype),
{
	constructor: { value: Color },
	copy: { value: function copy()
	{
		return new Color([ this[0], this[1], this[2], this[3] ]);
	} },
	multiply: { value: function multiply()
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
	} },
	0: { get: function getR()
	{
		return this.r.value;
	}, set: function setR(r)
	{
		this.r.value = r;
	} },
	1: { get: function getG()
	{
		return this.g.value;
	}, set: function setG(g)
	{
		this.g.value = g;
	} },
	2: { get: function getB()
	{
		return this.b.value;
	}, set: function setB(b)
	{
		this.b.value = b;
	} },
	3: { get: function getA()
	{
		return this.a.value;
	}, set: function setA(a)
	{
		this.a.value = a;
	} },
	length: { value: 4 }
});

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

Object.defineProperties(MovingObject.prototype = Object.create(Updatable.prototype),
{
	constructor: { value: MovingObject }
});

function MovingObject(parameters)
{
	parameters = parameters || { };
	Updatable.call(this, parameters);
	this.position = parameters.position instanceof Vector[3] ? parameters.position : new Vector[3](parameters.position);
	this.rotation = parameters.rotation instanceof RotationVector[3] ? parameters.rotation : new RotationVector[3](parameters.rotation);
	this.position.watch(this.requestUpdate.bind(this));
	this.rotation.watch(this.requestUpdate.bind(this));
}

Object.defineProperties(Material.prototype = Object.create(Watchable.prototype),
{
	constructor: { value: Material },
	shininess: { get: function getShininess()
	{
		return this._shininess.value;
	}, set: function setShininess(shininess)
	{
		this._shininess.value = shininess;
	} }
});

function Material(parameters)
{
	parameters = parameters || { };
	this._shininess = new WatchableValue(Number.isFinite(parameters.shininess) ? parameters.shininess : 0);
	this.specular = parameters.specular instanceof Color ? parameters.specular : new Color(parameters.specular);
	this.specular.watch(function notifyMaterialOfChange()
	{
		if(this.notifyWatchers)
			this.notifyWatchers();
	}.bind(this));
	Watchable.call(this, parameters);
	this._shininess.parent = this;
}

Object.defineProperties(CollisionMesh.prototype = Object.create(Object.prototype),
{
	constructor: { value: CollisionMesh }
});

function CollisionMesh(parameters)
{
}

Object.defineProperties(Physics.prototype = Object.create(Object.prototype),
{
	constuctor: { value: Physics }
});

function Physics(parameters)
{
	parameters = parameters || { };
	this.noClip = parameters.noClip || false;
	this.tracable = parameters.tracable || true;
	this.gravatationalIndex = Number.isInteger(parameters.gravatationalIndex) ? parameters.gravatationalIndex : Infinity;
	this.mass = parameters.mass >= 0 ? parameters.mass : 0;
	this.collisionMesh = parameters.collisionMesh instanceof CollisionMesh ? parameters.collisionMesh : new CollisionMesh();
}

Object.defineProperties(GeometryBuilder,
{
	updateGeometry: 	{ value: function updateGeometry()
	{
		this.transformationMatrix = mat4.translate(this.transformationMatrix || [ ], mat4.identity([ ]), this.position);
		mat4.rotateX(this.transformationMatrix, this.transformationMatrix, this.rotation[0]);
		mat4.rotateY(this.transformationMatrix, this.transformationMatrix, this.rotation[1]);
		mat4.rotateZ(this.transformationMatrix, this.transformationMatrix, this.rotation[2]);
		if(this.updateVertices())
			this.buildTriangles();
	} }
});
Object.defineProperties(GeometryBuilder.prototype = Object.create(Object.prototype),
{
	constructor: { value: GeometryBuilder }
});

function GeometryBuilder(parameters)
{
	var json = parameters.json;
	if(!json)
	{
		this.errored = true;
		console.error("The json at \"{0}\" is either non-existant or empty.".format(parameters.path));
	}
	var version = Number.parseFloat(json.version);
	if(!this.errored && !Number.isFinite(version))
	{
		this.errored = true;
		console.error("The version specified at \"{0}\"/version is either not a number, not finite, or non-existant.".format(parameters.path));
	}
	var properties = [ ];
	var propertiesJson = json.properties || { };
	if(propertiesJson.order instanceof Array)
	{
		propertiesJson.order.forEach(function putOrderedProperty(propertyName, propertyIndex)
		{
			if(!this.errored)
				if(propertyName != "order" && propertiesJson[propertyName])
				{
					properties[propertyIndex] = propertyName;
				}
				else
				{
					this.errored = true;
					console.error("\"{0}\" is listed in \"{0}\"/properties/order but is not actually a property.".format(propertyName, parameters.path));
				}
		}, this);
		delete propertiesJson.order;
	}
	else
	{
		this.errored = true;
		console.error("The order specified at \"{0}\"/properties/order is non-existant".format(parameters.path));
	}
	if(!this.errored && Object.keys(propertiesJson).length < properties.length)
	{
		this.errored = true;
		console.error("There are more properties ({0}) at \"{1}\"/properties than specified in the order at \"{1}\"/properties/order ({2}).".format(Object.keys(propertiesJson.length), paramters.path, properties.length));
	}
	var geometryPrototypeProperties =
	{
		builder: { value: this },
		updateVertices: { value: function updateVertices()
		{
			this.vertexCache = [ ];
			var rebuildTriangles = this.builder.updateVertices.apply(undefined, [ this.cacheVertex ].concat(this.properties));
			if(!rebuildTriangles && this.allocation)
			{
				this.vertexCache.forEach(function putVertex(vertex)
				{
					this.allocation.setVertex.apply(this.allocation, vertex);
				}, this);
				return false;
			}
			return true;
		} },
		buildTriangles: { value: function buildTriangles()
		{
			this.triangleCache = [ ];
			var allocationInfo = this.builder.buildTriangles.apply(undefined, [ this.cacheTriangle ].concat(this.properties));
			if(!this.allocation)
			{
				this.allocation = this.layer.triangleBuffer.allocate(allocationInfo[0], allocationInfo[1]);
				this.vertexCache.forEach(function putVertex(vertex)
				{
					this.allocation.setVertex.apply(this.allocation, vertex);
				}, this);
			}
			this.triangleCache.forEach(function putTriangle(triangle)
			{
				this.allocation.setTriangle(triangle[0], this.allocation.getVertexIndex(triangle[1]), this.allocation.getVertexIndex(triangle[2]), this.allocation.getVertexIndex(triangle[3]));
			}, this);
		} }
	};
	var defaults = [ ];
	properties.forEach(function addPropertyToGeometryPrototye(propertyName, propertyIndex)
	{
		if(!this.errored)
		{
			var propertyJson = propertiesJson[propertyName];
			var defaultValue = defaults[propertyIndex] = propertyJson.default ? new Function(propertyJson.default)() : undefined;
			var valueTransformer = propertyJson.transformer ? new Function("value", propertyJson.transformer) : self;
			geometryPrototypeProperties[propertyName] =
			{
				get: function getProperty()
				{
					return this.properties[propertyIndex];
				}, set: function setProperty(value)
				{
					this.properties[propertyIndex] = valueTransformer(value) || defaultValue;
					this.requestUpdate();
				}
			};
		}
	}, this);
	if(!this.errored)
	{
		this.geometryPrototype = function GeometryPrototype(parameters)
		{
			parameters = parameters || { };
			this.layer = parameters.layer;
			MovingObject.call(this, Object.assign({ game: this.layer.game }, parameters));
			this.update[10] = GeometryBuilder.updateGeometry.bind(this);
			this.index = this.layer.geometries.push(this) - 1;
			this.texture = parameters.texture instanceof Texture ? parameters.texture : this.layer.game.renderer.textureMap.textures[0];
			this.position.watch(this.requestUpdate.bind(this));
			this.rotation.watch(this.requestUpdate.bind(this));
			this.textureWatcher = this.texture.watch(this.requestUpdate.bind(this));
			this.properties = Array.from(defaults);
			this.cacheVertex = this.builder.cacheVertex.bind(this);
			this.cacheTriangle = this.builder.cacheTriangle.bind(this);
			this.matrix = mat4.identity([ ]);
		};
		Object.defineProperties(this.geometryPrototype.prototype = Object.create(MovingObject.prototype), Object.assign(
		{
			constructor: { value: this.geometryPrototype },
		}, geometryPrototypeProperties));
		Object.defineProperties(this,
		{
			version: { value: version },
			defaults: { value: defaults },
			updateVertices: { value: json.updateVertices ? Reflect.construct.call(undefined, Function, [ "vertex" ].concat(properties).concat([ json.updateVertices ])) : constant(false) },
			buildTriangles: { value: json.buildTriangles ? Reflect.construct.call(undefined, Function, [ "triangle" ].concat(properties).concat([ json.buildTriangles ])) : constant([ 0, 0 ]) },
			cacheVertex: { value: function cacheVertex(index, vector, uv, normal, matrix)
			{
				uv = this.texture.getAbsoluteUV(uv || [ 0, 0 ]);
				matrix = matrix || mat4.identity([ ]);
				this.vertexCache[index] = [ index, vector, uv, normal, mat4.multiply(matrix || [ ], this.transformationMatrix, matrix || mat4.identity([ ])) ];
			} },
			cacheTriangle: { value: function cacheTriangle(index, corner0, corner1, corner2)
			{
				this.triangleCache[index] = [ index, corner0, corner1, corner2 ];
			} }
		});
	}
}

Object.defineProperties(Timestamp,
{
	merge: { value: function mergeTimestamps()
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
	} },
	splitAll: { value: function splitAllTimestamps()
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
	} }
});
Object.defineProperties(Timestamp.prototype = Object.create(Object.prototype), 
{
	constructor: { value: Timestamp },
	isInTimestamp: { value: function isInTimestamp(time)
	{
		return this.fromTime < time && this.fromTime + this.time > time;
	} },
	copy: { value: function copy()
	{
		return new Timestamp(JSON.parse(JSON.stringify(this.params)), this.fromTime, this.time);
	} },
	split: { value: function split()
	{
		var times = Array.from(arguments);
		var timestamp = this;
		var json = JSON.stringify(this.params);
		times = times.filter(this.isInTimestamp.bind(this));
		times.push(this.fromTime, this.fromTime + this.time);
		times.sort();
		var timestamps = [ ];
		for(var i = 0; i < times.length - 1; i++)
		{
			var fromTime = times[i];
			timestamps.push(new Timestamp(JSON.parse(json), fromTime, times[i + 1] - fromTime));
		}
		return timestamps;
	} }
});

function Timestamp(params, fromTime, time)
{
	this.params = params || { };
	this.fromTime = fromTime || 0;
	this.time = time || 0;
}

Object.defineProperties(Control.prototype = Object.create(Object.prototype),
{
	constructor: { value: Control },
	addControllers: { value: function addControllers()
	{
		Array.forEach(parameters, function addControllerIfAbsent(controller)
		{
			if(!this.controllers.includes(controller))
				this.controllers.push(controller);
		}, this);
		return this;
	} },
	reset: { value: function reset()
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
	} }
});

function Control(controls, name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers)
{
	this.controls = controls;
	this.name = name;
	this.func = func;
	this.type = type;
	this.mouseControllerFilter = mouseControllerFilter || constant(false);
	this.keyboardControllerFilter = keyboardControllerFilter || constant(false);
	this.gamepadControllerFilter = gamepadControllerFilter || constant(false);
	this.defaultMouseControllers = Array.from(defaultMouseControllers);
	this.defaultKeyboardControllers = Array.from(defaultKeyboardControllers);
	this.defaultGamepadControllers = Array.from(defaultGamepadControllers);
	this.mouseControllers = [ ];
	this.keyboardControllers = [ ];
	this.gamepadControllers = [ ];
	this.reset();
}

Object.defineProperties(Mouse,
{
	movementFilter: { value: function isMouseMovement(controller)
	{
		return controller == "movement";
	} },
	buttonFilter: { value: function isMouseButton(controller)
	{
		return controller.startsWith("button");
	} },
	wheelFilter: { value: function isMouseWheel(controller)
	{
		return controller == "wheel";
	} }
});
Object.defineProperties(Mouse.prototype = Object.create(ElementEventListener.prototype),
{
	constructor: { value: Mouse },
	onButtonDown: { value: function onButtonDown(event)
	{
		if(this.controls.focused)
		{
			var button = (event || window.event).button;
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
	} },
	onButtonUp: { value: function onButtonUp(event)
	{
		if(this.controls.focused)
		{
			var button = (event || window.event).button;
			var now = Date.now();
			(this.buttonArrays[button] || [ ]).forEach(function setButtonTimestampToDefinite(index)
			{
				var timestamp = this.timestamps[index];
				if(timestamp && timestamp.time == Infinity)
					timestamp.time = now - timestamp.fromTime
			}, this);
			delete this.buttonArrays[button];
		}
	} },
	onMouseMove: { value: function onMouseMove(event)
	{
		if(this.controls.focused)
		{
			var movementX = (event || window.event).movementX;
			var movementY = (event || window.event).movementY;
			this.lastMovementTime = this.lastMovementTime || Date.now();
			this.movementX += movementX;
			this.movementY += movementY;
			var movementInfo = [ Math.atan2(movementX, movementY), Math.hypot(movementX, movementY) ];
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
	} },
	update: { value: function update(last, now)
	{
		if(this.lastMovementTime && (this.movementX || this.movementY))
		{
			var params = { };
			var movementInfo = [ Math.atan2(this.movementX, this.movementY), Math.hypot(this.movementX, this.movementY) ];
			this.controls.getControls("mouse.movement").forEach(function setControlRotaryParameter(control)
			{
				if(control.type == 2)
					params.setPropertyAt("mouse." + control.name, movementInfo);
			});
			this.timestamps.push(new Timestamp(params, this.lastMovementTime, now - this.lastMovementTime));
			this.lastMovementTime = NaN;
			this.movementX = this.movementY = 0;
		}
	} },
	reset: { value: function reset()
	{
		this.lastMovementTime = NaN;
		this.movementX = this.movementY = 0;
		this.timestamps = [ ];
		this.buttonArrays = { };
	} }
});

function Mouse(parameters)
{
	parameters = parameters || { };
	ElementEventListener.call(this, parameters);
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	this.addEventListener("mousedown", this.onButtonDown.bind(this));
	this.addEventListener("mouseup", this.onButtonUp.bind(this));
	this.addEventListener("mousemove", this.onMouseMove.bind(this));
}

Object.defineProperties(Keyboard,
{
	keyFilter: { value: function isKeyboardKey(controller)
	{
		return true;
	} },
	getKey: { value: function keyToString(key)
	{
		if(key == " ")
			return "spacebar";
		else if(key.startsWith("Arrow"))
			return key.substring(5).toLowerCase();
		return key.toLowerCase();
	} }
});
Object.defineProperties(Keyboard.prototype = Object.create(ElementEventListener.prototype),
{
	constructor: { value: Keyboard },
	onKeyDown: { value: function onKeyDown(event)
	{
		if(this.controls.focused)
		{
			var key = Keyboard.getKey((event || window.event).key);
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
	} },
	onKeyUp: { value: function onKeyUp(event)
	{
		if(this.controls.focused)
		{
			var key = Keyboard.getKey((event || window.event).key);
			var now = Date.now();
			(this.keyArrays[key] || [ ]).forEach(function setKeyTimestampToDefinite(index)
			{
				var timestamp = this.timestamps[index];
				if(timestamp && timestamp.time == Infinity)
					timestamp.time = now - timestamp.fromTime
			}, this);
			delete this.keyArrays[key];
		}
	} },
	reset: { value: function reset()
	{
		this.timestamps = [ ];
		this.keyArrays = { };
	} }
});

function Keyboard(parameters)
{
	parameters = parameters || { };
	ElementEventListener.call(this, parameters);
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	this.addEventListener("keydown", this.onKeyDown.bind(this));
	this.addEventListener("keyup", this.onKeyUp.bind(this));
}
Object.defineProperties(Gamepad,
{
	buttonFilter: { value: function isGamepadButton(controller)
	{
		return controller.startsWith("button");
	} },
	analogFilter: { value: function isGamepadAnalogStick(controller)
	{
		return controller.startsWith("analog");
	} }
});
Object.defineProperties(Gamepad.prototype = Object.create(ElementFocusEventListener.prototype),
{
	constructor: { value: Gamepad },
	update: { value: function update(last, now)
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
						var analogInfo = [ Math.atan2(analogX, analogY), Math.hypot(analogX, analogY) ];
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
	} }
});

function Gamepad(parameters)
{
	this.timestamps = [ ];
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	ElementFocusEventListener.call(this, parameters);
}

Object.defineProperties(Controls.prototype = Object.create(ElementEventListener.prototype),
{
	constructor: { value: Controls },
	focused: { get: function isFocused()
	{
		return this.element && document.hasFocus() && document.activeElement == this.element && (!this.requiresPointerLock || document.pointerLockElement == this.element);
	} },
	onElementDelete: { value: function onElementDelete()
	{
		callSuper(this, "onElementDelete");
		this.keyboard.element = this.mouse.element = this.gamepad.element = undefined;
	} },
	onElementSet: { value: function onElementSet()
	{
		callSuper(this, "onElementSet");
		this.keyboard.element = this.mouse.element = this.gamepad.element = this.element;
	} },
	addControl: { value: function addControl(name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers)
	{
		var control = this.controls[name] = new Control(this, name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers);
		if(type == 2)
			this.addControlsLoopFunc(func);
	} },
	getControl: { value: function getControl(name)
	{
		return this.controls[name] || this.nullKeyBinding;
	} },
	getControls: { value: function getControls(controller)
	{
		return this.controllers[controller] || [ ];
	} },
	addControlsLoopFunc: { value: function addControlsLoopFunc(func)
	{
		var index = this.controlsLoopFuncs.indexOf(func);
		if(index < 0)
			index = this.controlsLoopFuncs.push(func) - 1;
		this.controlsLoopFuncs[0][index - 1] = (this.controlsLoopFuncs[0][index - 1] || 0) + 1;
	} },
	removeControlsLoopFunc: { value: function removeControlsLoopFunc(func)
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
	} },
	startControlsLoop: { value: function startControlsLoop()
	{
		this.controlsLoopTimeout = setTimeout(this.controlsLoop, 0, this);
	} },
	stopControlsLoop: { value: function stopControlsLoop()
	{
		clearTimeout(this.controlsLoopTimeout);
	} },
	controlsLoop: { value: function controlsLoop(controls)
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
	} },
	unload: { value: function unload()
	{
		this.endControlsLoop();
	} }
});

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

Object.defineProperties(Texture.prototype = Object.create(Watchable.prototype),
{
	constructor: Texture,
	getAbsoluteU: { value: function getAbsoluteU(relativeU)
	{
		var uvs = this.textureMap[this.index];
		if(!uvs)
			return NaN;
		return uvs[0] + relativeU * uvs[2];
	} },
	getAbsoluteV: { value: function getAbsoluteV(relativeV)
	{
		var uvs = this.textureMap[this.index];
		if(!uvs)
			return NaN;
		return uvs[1] + relativeV * uvs[3];
	} },
	getAbsoluteUV: { value: function getAbsoluteUV(relativeUV)
	{
		var uvs = this.textureMap[this.index];
		if(!uvs)
			return [ NaN, NaN ];
		return [ uvs[0] + relativeUV[0] * uvs[2], uvs[1] + relativeUV[1] * uvs[3] ];
	} }
});

function Texture(index, textureMap, image)
{
	Watchable.call(this);
	this.index = index;
	this.textureMap = textureMap;
	this.image = image;
}

Object.defineProperties(TextureMap,
{
	textureComparator: { value: function textureComparator(a, b)
	{
		return b.image.height - a.image.height || b.image.width - a.image.width || a.index - b.index;
	} },
	boxComparator: { value: function boxComparator(a, b)
	{
		return a[0] - b[0] || a[1] - b[1];
	} },
	calculateTextureUVs: { value: function calculateTextureUVs(length, textures)
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
							if(!quadrant.find(self))
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
	} }
});
Object.defineProperties(TextureMap.prototype = Object.create(Object.prototype),
{
	constructor: { value: TextureMap },
	loadTextures: { value: function loadTextures(imageLocations, readyFunction)
	{
		var ret = [ ];
		var textures = Array.from(this.textures);
		var loadedImages = textures.length;
		var restitchIfAllLoaded = function restitchIfAllLoaded()
		{
			loadedImages++;
			if(loadedImages == textures.length)
				setTimeout(function delayedRestitchTextures()
				{
					this.restitchTextures(textures, readyFunction.bind(undefined, ret));
				}.bind(this), 0);
		}.bind(this);
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
			setTimeout(function delayedRestitchTextures()
			{
				this.restitchTextures(textures);
			}.bind(this), 0);
		return ret;
	} },
	restitchTextures: { value: function restitchTextures(textures, readyFunction)
	{
		textures.sort(TextureMap.textureComparator);
		var stitchedPixels = 0;
		textures.forEach(function addAreaToStitchedPixels(texture)
		{
			stitchedPixels += texture.image.width * texture.image.height;
		});
		var textureUVs;
		var i = Math.ceil(Math.log2(Math.sqrt(stitchedPixels)));
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
		this.length = textureUVs.length;
		this.stitched.src = stitchCanvas.toDataURL();
		this.stitched.addEventListener("load", this.onStichedLoad = function onStitchedTextureMapLoad()
		{
			this.stitched.removeEventListener("load", this.onStitchedLoad);
			this.onStitchedLoad = undefined;
			this.renderer.bindTextureMap();
			(readyFunction || emptyFunction)();
			this.textures.forEach(function notifyTextureOfUpdate(texture)
			{
				texture.notifyWatchers();
			});
		}.bind(this));
	} }
});

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
	this.stitched.addEventListener("load", this.onStichedLoad = function onStitchedTextureMapLoad()
	{
		this.stitched.removeEventListener("load", this.onStitchedLoad);
		this.onStitchedLoad = undefined;
		this.renderer.bindTextureMap();
	}.bind(this));
	this[0] = [ 0, 0, 1, 1 ];
	this.length = 1;
}

Object.defineProperties(GeometryAllocation.prototype = Object.create(Object.prototype), 
{
	constructor: { value: GeometryAllocation },
	putVector: { get: function getPutVector()
	{
		return (this.triangleBuffer.vertexBuffer.vectors instanceof Float32Array ? function putVectorIntoTypedArray(vector, vectorIndex)
		{
			this.triangleBuffer.vertexBuffer.vectors.set(vector, vectorIndex);
		} : function putVectorIntoArray(vector, vectorIndex)
		{
			this.triangleBuffer.vertexBuffer.vectors.splice.apply(this.triangleBuffer.vertexBuffer.vectors, [ vectorIndex, 3 ].concat(vector));
		}).bind(this);
	} },
	putUV: { get: function getPutUV()
	{
		return (this.triangleBuffer.vertexBuffer.uvs instanceof Float32Array ? function putUVIntoTypedArray(uv, uvIndex)
		{
			this.triangleBuffer.vertexBuffer.uvs.set(uv, uvIndex);
		} : function putUVIntoArray(uv, uvIndex)
		{
			this.triangleBuffer.vertexBuffer.uvs.splice.apply(this.triangleBuffer.vertexBuffer.uvs, [ uvIndex, 2 ].concat(uv));
		}).bind(this);
	} },
	putNormal: { get: function getPutNormal()
	{
		return (this.triangleBuffer.vertexBuffer.normals instanceof Float32Array ? function putNormalIntoTypedArray(normal, normalIndex)
		{
			this.triangleBuffer.vertexBuffer.normals.set(normal, normalIndex);
		} : function putNormalIntoArray(normal, normalIndex)
		{
			this.triangleBuffer.vertexBuffer.normals.splice.apply(this.triangleBuffer.vertexBuffer.normals, [ normalIndex, 3 ].concat(normal));
		}).bind(this);
	} },
	putMatrix: { get: function getPutMatrix()
	{
		return (this.triangleBuffer.vertexBuffer.matrices instanceof Float32Array ? function putMatrixIntoTypedArray(matrix, matrixIndex)
		{
			this.triangleBuffer.vertexBuffer.matrices.set(matrix, matrixIndex);
		} : function putMatrixIntoArray(matrix, matrixIndex)
		{
			this.triangleBuffer.vertexBuffer.matrices.splice.apply(this.triangleBuffer.vertexBuffer.matrices, [ matrixIndex, 16 ].concat(matrix));
		}).bind(this);
	} },
	disallocate: { value: function disallocate()
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
	} },
	setVector: { value: function setVector(vertex, vector)
	{
		var index = this.getVertexIndex(vertex);
		if(index)
		{
			this.putVector(vector, index * 3);
			this.triangleBuffer.vertexBuffer.vectors.modified = true;
		}
		return index;
	} },
	setUV: { value: function setUV(vertex, uv)
	{
		var index = this.getVertexIndex(vertex);
		if(index)
		{
			this.putUV(uv, index * 2);
			this.triangleBuffer.vertexBuffer.uvs.modified = true;
		}
		return index;
	} },
	setNormal: { value: function setNormal(vertex, normal)
	{
		var index = this.getVertexIndex(vertex);
		if(index)
		{
			this.putNormal(normal, index * 3);
			this.triangleBuffer.vertexBuffer.normals.modified = true;
		}
		return index;
	} },
	setMatrix: { value: function setMatrix(vertex, matrix, preventApplication)
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
	} },
	setVertex: { value: function setVertex(vertex, vector, uv, normal, matrix)
	{
		var index = this.getVertexIndex(vertex);
		if(index)
		{
			this.putVector(vector || [ 0, 0, 0 ], index * 3);
			this.putUV(uv || [ 0, 0 ], index * 2);
			this.putNormal(normal || [ 0, 0, 0 ], index * 3);
			this.putMatrix(matrix || mat4.identity([ ]), index * 16);
			this.triangleBuffer.vertexBuffer.vectors.modified = this.triangleBuffer.vertexBuffer.uvs.modified = this.triangleBuffer.vertexBuffer.normals.modified = this.triangleBuffer.vertexBuffer.matrices.modified = true;
		}
		return index;
	} },
	applyVertices: { value: function applyVertices()
	{
		var putMatrix = this.putMatrix;
		this.unappliedMatrices.forEach(function applyVertexMatrix(matrix, vertex)
		{
			var index = this.getVertexIndex(vertex);
			if(index)
				putMatrix(matrix, index * 16);
		}, this);
		this.triangleBuffer.vertexBuffer.matrices.modified = true;
		this.unappliedMatrices = [ ];
	} },
	getVertexIndex: { value: function getVertexIndex(vertex)
	{
		var vertices = 0;
		var range = this.vertexRanges.find(function isVertexWithinRange(range)
		{
			vertices += range[1] - range[0];
			return vertices >= vertex;
		}) || [ 0, vertices - vertex ];
		return range[1] - vertices + vertex;
	} },
	setTriangleCorner: { value: function setTriangleCorner(triangle, corner, vertex)
	{
		var index = this.getTriangleIndex(triangle);
		if(index)
		{
			this.triangleBuffer.triangles[index + corner] = vertex;
			this.triangleBuffer.triangles.modified = true;
		}
		return index;
	} },
	setTriangle: { value: function setTriangle(triangle, cornerVertex0, cornerVertex1, cornerVertex2)
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
	} },
	getTriangleIndex: { value: function getTriangleIndex(triangle)
	{
		return (this.triangleRange[1] - this.triangleRange[0] > triangle ? this.triangleRange[0] + triangle : 0) * 3;
	} }
});

function GeometryAllocation(triangleBuffer, index, vertexRanges, triangleRange)
{
	this.triangleBuffer = triangleBuffer;
	this.index = index;
	this.vertexRanges = vertexRanges;
	this.triangleRange = triangleRange;
	this.unappliedMatrices = [ ];
}

Object.defineProperties(TriangleBuffer.prototype = Object.create(Object.prototype),
{
	constructor: { value: TriangleBuffer },
	allocate: { value: function allocate(vertexCount, triangleCount)
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
		this.vertexBuffer.disallocations = disallocations;
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
		var triangles = this.triangles instanceof Uint16Array ? Array.from(this.triangles) : this.triangles;
		this.triangles = triangles.concat(new Array(triangleCount * 3).fill(0));
		var allocation = new GeometryAllocation(this, this.vertexBuffer.allocations.length, vertexRanges, [ this.triangles.length / 3 - triangleCount, this.triangles.length / 3 ]);
		this.vertexBuffer.allocations.push(allocation);
		return allocation;
	} }
});

function TriangleBuffer(vertexBuffer)
{
	this.vertexBuffer = vertexBuffer;
	this.triangles = [ 0, 0, 0 ];
}

Object.defineProperties(VertexBuffer.prototype = Object.create(Object.prototype),
{
	constructor: { value: VertexBuffer }
});

function VertexBuffer()
{
	this.allocations = [ ];
	this.disallocations = [ [ 1, Infinity ] ];
	this.vectors = [ 0, 0, 0 ];
	this.uvs = [ 0, 0 ];
	this.normals = [ 0, 0, 0 ];
	this.matrices = mat4.identity([ ]);
}

Object.defineProperties(Renderer.prototype = Object.create(ElementEventListener.prototype),
{
	constructor: { value: Renderer },
	clearColor: { get: function getClearColor()
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
		}.bind(this));
	} },
	animate: { value: function animate(now)
	{
		now /= 1000;
		if(this.then)
			this.render(now - this.then);
		this.then = now;
		this.nextAnimationFrame = requestAnimationFrame(this.animate.bind(this));
	} },
	render: { value: function render(delta)
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
	} },
	resize: { value: function resize()
	{
		this.game.level.view.aspect = this.game.gui.view.aspect = window.innerWidth / window.innerHeight;
	} },
	bindTextureMap: { value: function bindTextureMap()
	{
	} },
	unload: { value: function unload()
	{
		cancelAnimationFrame(this.nextAnimationFrame);
		this.layers.forEach(function unloadLayer(layer)
		{
			layer.unload();
		});
	} }
});

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
	this.resizeWrapper = this.resize.bind(this);
	ElementEventListener.call(this, parameters);
}

Object.defineProperties(WebGLRenderer.prototype = Object.create(Renderer.prototype),
{
	constructor: { value: WebGLRenderer },
	onElementDelete: { value: function onElementDelete()
	{
		delete this.gl;
	} },
	onElementSet: { value: function onElementSet()
	{
		callSuper(this, "onElementSet");
		if(this.element.getContext)
		{
			this.gl = this.element.getContext("webgl2") || this.game.element.getContext("webgl") || this.game.element.getContext("experimental-webgl");
			this.setup();
			if(!this.shaders)
				this.requestShaders("default");
		}
	} },
	setup: { value: function setup()
	{
		this.gl.clearDepth(1);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.depthFunc(this.gl.LEQUAL);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.cullFace(this.gl.FRONT);
	} },
	requestShaders: { value: function requestShaders(name)
	{
		var shader = this.game.directory.shaders[name];
		var rawVertex;
		var rawFragment;
		var compileShaders = function compileShaders()
		{
			if(rawVertex && rawFragment)
			{
				this.shaders = new GLSLShaders(this, { program: shader, vertex: { raw: rawVertex, canReformat: shader.vertex.canReformat, format: shader.vertex.format }, fragment: { raw: rawFragment, canReformat: shader.fragment.canReformat, format: shader.fragment.format } });
			}
		}.bind(this);
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
	} },
	render: { value: function render(delta)
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
	} },
	bindShaderAttribute: { value: function bindShaderAttribute(buffer, location, parameters)
	{
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.vertexAttribPointer(location, parameters.components || 3, parameters.type || this.gl.FLOAT, parameters.normalize || false, parameters.stride || 0, parameters.offset || 0);
	} },
	resize: { value: function resize()
	{
		callSuper(this, "resize");
		this.gl.viewport(0, 0, innerWidth, innerHeight);
		this.game.element.width = innerWidth; this.game.element.height = innerHeight;
	} },
	bindTextureMap: { value: function bindTextureMap()
	{
		this.textureMap.modified = true;
	} }
});

function WebGLRenderer(parameters)
{
	parameters = parameters || { };
	Renderer.call(this, parameters);
	this.triangleArrayBuffer = new ArrayBuffer(0);
}

Object.defineProperties(GLSLShaders.prototype = Object.create(Object.prototype),
{
	constructor: { value: GLSLShaders },
	populateProgram: { value: function populateProgram(program, parameters)
	{
		program.canReformat = parameters.canReformat ? new Function("renderer", parameters.canReformat).bind(this) : constant(false);
		program.preFormat = parameters.preFormat ? new Function("renderer", parameters.preFormat).bind(this) : self;
		return program;
	} },
	populateShader: { value: function populateShader(shader, parameters)
	{
		shader.raw = parameters.raw || "";
		shader.canReformat = parameters.canReformat ? new Function("renderer", parameters.canReformat).bind(this) : constant(false);
		shader.format = parameters.format ? new Function("renderer", "raw", parameters.format).bind(this) : self; 
		return shader;
	} },
	tryRecompileShaders: { value: function tryRecompileShaders(renderer)
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
	} },
	tryRecompileShader: { value: function tryRecompileShader(renderer, shader)
	{
		if(shader.canReformat(renderer))
		{
			this.compileShader(renderer, shader);
			return true;
		}
		return false;
	} },
	compileShader: { value: function compileShader(renderer, shader)
	{
		renderer.gl.shaderSource(shader, shader.format(renderer, shader.raw));
		renderer.gl.compileShader(shader);
	} },
	populateVariables: { value: function populateVariables(renderer)
	{
		this.attributes = this.getAttributes(renderer);
		this.uniforms = this.getUniforms(renderer);
		renderer.gl.enableVertexAttribArray(this.attributes.position);
		renderer.gl.enableVertexAttribArray(this.attributes.textureCoordinate);
		renderer.gl.enableVertexAttribArray(this.attributes.normalDirection);
		for(var i = 0; i < 4; i++)
			renderer.gl.enableVertexAttribArray(this.attributes.vertexMatrix + i);
	} },
	getAttributes: { value: function getAttributes(renderer)
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
	} },
	getUniforms: { value: function getUniforms(renderer)
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
	} }
});

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

Object.defineProperties(View.prototype = Object.create(Updatable.prototype),
{
	constructor: { value: View },
	aspect: { get: function getAspect()
	{
		return this._aspect.value;
	}, set: function setAspect(aspect)
	{
		this._aspect.value = aspect;
	} },
	near: { get: function getNear()
	{
		return this._near.value;
	}, set: function setNear(near)
	{
		this._near.value = near;
	} },
	far: { get: function getFar()
	{
		return this._far.value;
	}, set: function setFar(far)
	{
		this._far.value = far;
	} },
	viewer: { get: function getViewer()
	{
		return this._viewer;
	},
	set: function setViewer(viewer)
	{
		this._viewer = this.viewerWatcher.watching = viewer;
	} }
});

function View(parameters)
{
	parameters = parameters || { };
	Updatable.call(this, parameters);
	this.viewerWatcher = new Watcher(this.requestUpdate.bind(this));
	this.viewer = parameters.viewer;
	this.matrix = new Float32Array(mat4.create());
	this.matrix.defaultMatrix = true;
	this.matrix.modified = true;
	this._aspect = new WatchableValue({ value: window.innerWidth / window.innerHeight });
	this._aspect.watch(this.requestUpdate.bind(this));
	this._aspect.parent = this;
	this._near = Number.isFinite(parameters.near) ? new WatchableValue({ value: Math.abs(parameters.near) }) : parameters._near instanceof WatchableValue ? parameters._near : new WatchableValue({ value: .1 });
	this._near.watch(this.requestUpdate.bind(this));
	this._near.parent = this;
	this._far = Number.isFinite(parameters.far) ? new WatchableValue({ value: Math.max(Math.abs(parameters.far), this.near) }) : parameters._far instanceof WatchableValue ? parameters._far : new WatchableValue({ value: 100 });
	this._far.watch(this.requestUpdate.bind(this));
	this._far.parent = this;
}

Object.defineProperties(PerspectiveView,
{
	update: { value: function update()
	{
		mat4.perspective(this.matrix, this.fov, this.aspect, this.near, this.far);
		mat4.rotateX(this.matrix, this.matrix, -this.viewer.rotation[0]);
		mat4.rotateY(this.matrix, this.matrix, this.viewer.rotation[1]);
		mat4.rotateZ(this.matrix, this.matrix, this.viewer.rotation[2]);
		mat4.translate(this.matrix, this.matrix, [ -this.viewer.position[0], -this.viewer.position[1], -this.viewer.position[2] ]);
		this.matrix.identityMatrix = false;
		this.matrix.modified = true;
	} }
});
Object.defineProperties(PerspectiveView.prototype = Object.create(View.prototype),
{
	construcor: { value: PerspectiveView },
	fov: { get: function getFov()
	{
		return this._fov.value;
	}, set: function setFov(fov)
	{
		this._fov.value = fov || Math.PI / 4;
	} }
});

function PerspectiveView(parameters)
{
	parameters = parameters || { };
	View.call(this, parameters);
	this._fov = Number.isFinite(parameters.fov) ? new WatchableValue({ value: Math.abs(parameters.fov) }) : parameters._fov instanceof WatchableValue ? parameters._fov : new WatchableValue({ value: Math.PI / 4 });
	this._fov.watch(this.requestUpdate.bind(this));
	this._fov.parent = this;
	this.update[10] = PerspectiveView.update.bind(this);
}

Object.defineProperties(OrthographicView,
{
	update: { value: function update()
	{
		mat4.ortho(this.matrix, this.left * this.aspect, this.right * this.aspect, this.bottom, this.top, this.near, this.far);
	} }
});

Object.defineProperties(OrthographicView.prototype = Object.create(View.prototype),
{
	constructor: { value: OrthographicView },
	horizontal: { set: function setHorizontal(horizontal)
	{
		this.left = -(this.right = horizontal / 2);
	} },
	vertical: { set: function setVertical(vertical)
	{
		this.bottom = -(this.top = vertical / 2);
	} },
	left: { get: function getLeft()
	{
		return this._left;
	}, set: function setLeft(left)
	{
		this._left = left;
		this.requestUpdate();
	} },
	right: { get: function getRight()
	{
		return this._right;
	}, set: function setRight(right)
	{
		this._right = right;
		this.requestUpdate();
	} },
	bottom: { get: function getBottom()
	{
		return this._bottom;
	}, set: function setBottom(bottom)
	{
		this._bottom = bottom;
		this.requestUpdate();
	} },
	top: { get: function getTop()
	{
		return this._top;
	}, set: function setTop(top)
	{
		this._top = top;
		this.requestUpdate();
	} }
});

function OrthographicView(parameters)
{
	parameters = parameters || { };
	View.call(this, parameters);
	this.update[10] = OrthographicView.update.bind(this);
	this.left = parameters.left || parameters.horizontal / -2 || -1;
	this.right = parameters.right || parameters.horizontal / 2 || 1;
	this.bottom = parameters.bottom || parameters.vertical / -2 || -1;
	this.top = parameters.top || parameters.vertical / 2 || 1;
}

Object.defineProperties(Player.prototype = Object.create(MovingObject.prototype),
{
	constructor: { value: Player },
	instantControls: { value: function instantControls(params)
	{
		var mouse = params.mouse;
		var lookAngle = NaN;
		var lookDistance = 0;
		if(mouse.instalook)
		{
			lookAngle = averageRadians(lookAngle, mouse.instalook.horizontal ? radiansReflectionX(mouse.instalook.horizontal[0]) : NaN);
			lookDistance = mouse.instalook.horizontal ? Math.max(Math.min(mouse.instalook.horizontal[1], 2), lookDistance) : lookDistance;
		}
		if(!isNaN(lookAngle))
		{
			this.rotation[0] = Math.max(Math.min(this.rotation[0] + Math.cos(lookAngle) * Math.rad(lookDistance), Math.HALFPI), -Math.HALFPI);
			this.rotation[1] += Math.sin(lookAngle) * Math.rad(lookDistance);
		}
	} },
	controlsLoop: { value: function controlsLoop(timestamps, last, now)
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
				lookAngle = averageRadians(lookAngle, averageRadians(averageRadians(keyboard.look.downwards ? Math.PI : NaN, keyboard.look.upwards ? 0 : NaN), averageRadians(keyboard.look.leftwards ? -Math.HALFPI : NaN, keyboard.look.rightwards ? Math.HALFPI : NaN)));
				lookDistance = 1;
			}
			if(gamepad.look)
			{
				lookAngle = averageRadians(lookAngle, averageRadians(averageRadians(gamepad.look.downwards ? Math.PI : NaN, gamepad.look.upwards ? 0 : NaN), averageRadians(gamepad.look.leftwards ? -Math.HALFPI : NaN, gamepad.look.rightwards ? Math.HALFPI : NaN)));
				lookAngle = averageRadians(lookAngle, gamepad.look.horizontal ? gamepad.look.horizontal[0] : NaN);
				lookDistance = gamepad.look.horizontal ? Math.max(Math.min(gamepad.look.horizontal[1], 1), lookDistance) : lookDistance;
			}
			if(!isNaN(lookAngle))
			{
				this.rotation[0] = Math.max(Math.min(this.rotation[0] + Math.cos(lookAngle) * Math.rad(lookDistance), Math.HALFPI), -Math.HALFPI);
				this.rotation[1] += Math.sin(lookAngle) * Math.rad(lookDistance);
			}
			var moveAngle = NaN;
			var moveDistance = 1;
			if(keyboard.movement)
			{
				moveAngle = averageRadians(moveAngle, averageRadians(averageRadians(keyboard.movement.forwards ? 0 : NaN, keyboard.movement.backwards ? Math.PI : NaN), averageRadians(keyboard.movement.leftwards ? -Math.HALFPI : NaN, keyboard.movement.rightwards ? Math.HALFPI : NaN)));
				positionOffset[1] += ((keyboard.movement.upwards ? 1 : 0) + (keyboard.movement.downwards ? -1 : 0)) * timestamp.time / 1000;
			}
			if(gamepad.movement)
			{
				moveAngle = averageRadians(moveAngle, averageRadians(averageRadians(gamepad.movement.forwards ? 0 : NaN, gamepad.movement.backwards ? Math.PI : NaN), averageRadians(gamepad.movement.leftwards ? -Math.HALFPI : NaN, gamepad.movement.rightwards ? Math.HALFPI : NaN)));
				moveAngle = averageRadians(moveAngle, gamepad.movement.horizontal ? gamepad.movement.horizontal[0] : NaN);
				moveDistance = gamepad.movement.horizontal ? gamepad.movement.horizontal[1] : moveDistance;
				positionOffset[1] += ((gamepad.movement.upwards ? 1 : 0) + (gamepad.movement.downwards ? -1 : 0)) * timestamp.time / 1000;
			}
			if(!isNaN(moveAngle))
			{
				positionOffset[0] += Math.sin(this.rotation[1] + moveAngle) * timestamp.time / 1000 * moveDistance;
				positionOffset[2] -= Math.cos(this.rotation[1] + moveAngle) * timestamp.time / 1000 * moveDistance;
			}
			if(keyboard)
			{
			}
			this.position.add(positionOffset);
		}, this);
	} }
});

function Player(parameters)
{
	parameters = parameters || { };
	this.level = parameters.level;
	this.eyeOffset = parameters.eyeOffset instanceof Vector[3] ? parameters.eyeOffset: new Vector[3](parameters.eyeOffset || [ 0, 1, 0 ]);
	MovingObject.call(this, Object.assign({ game: this.level.game, position: new AdditiveVector[3]([ this.eyeOffset ]) }, parameters));
	this.controlsLoopWrapped = this.controlsLoop.bind(this);
}

Object.defineProperties(Light.prototype = Object.create(Watchable.prototype),
{
	constructor: { value: Light },
	processedColor: { get: function getProcessedColor()
	{
		return this.color.copy().multiply(this.intensity);
	} }
});

function Light(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.ambience = Number.isFinite(parameters.ambience) ? parameters.ambience : 1;
	this.attenuation = Number.isFinite(parameters.attenuation) ? parameters.attenuation : 0;
	this.position = parameters.position instanceof Vector[3] ? parameters.position : new Vector[3](parameters.position);
	this.direction = parameters.direction instanceof Vector[3] ? parameters.direction : new Vector[3](parameters.direction);
	this.color = parameters.color instanceof Color ? parameters.color : new Color(parameters.color || [ 1, 1, 1 ]);
	this.orthographic = parameters.orthographic == false ? false : true;
	this.intensity = Number.isFinite(parameters.intensity) ? parameters.intensity : 1;
}

Object.defineProperties(Layer.prototype = Object.create(Watchable.prototype),
{
	constructor: { value: Layer },
	addGeometry: { value: function addGeometry(name, position, rotation, texture, properties)
	{
		if(this.game.geometryBuilders[name])
		{
			var propertyValues = [ ];
			Object.entries(properties || { }).forEach(function addPropertyValue(entry)
			{
				propertyValues.push(entry[1]);
			});
			return this.game.geometryBuilders[name]({ layer: this, position: position, rotation: rotation, texture: texture, propertyValues: propertyValues });
		}
		else
			console.error("No such geometry with the name \"{0}\"".format(name));
	} },
	overlayColor: { get: function getOverlayColor()
	{
		return this._overlayColor;
	}, set: function setOverlayColor(overlayColor)
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
		}.bind(this));
	} },
	lights: { get: function getLights()
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
			}.bind(this));
		}, this);
	} },
	light: { set: function setLight(light)
	{
		light.watch(function markLightAsModified()
		{
			this.lights.modified = light.modified = true;
		}.bind(this));
		this.lights.push(light);
	} },
	unload: { value: function unload()
	{
	} }
});

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

Object.defineProperties(Gui.prototype = Object.create(Layer.prototype),
{
	constructor: { value: Gui }
});

function Gui(parameters)
{
	parameters = parameters || { };
	Layer.call(this, parameters);
	this.view = parameters.view instanceof OrthographicView ? parameters.view : new OrthographicView(parameters.view);
}

Object.defineProperties(Level.prototype = Object.create(Layer.prototype),
{
	constructor: { value: Level }
});

function Level(parameters)
{
	parameters = parameters || { };
	Layer.call(this, parameters);
	if(!parameters.player)
		parameters.player = { };
	parameters.player.level = this;
	this.player = new Player(parameters.player);
	this.controls.requiresPointerLock = true;
	this.view = parameters.view instanceof PerspectiveView ? parameters.view : new PerspectiveView(Object.assign(parameters.view || { }, { viewer: this.player }));
}

Object.defineProperties(Game.prototype = Object.create(ElementEventListener.prototype),
{
	constructor: { value: Game },
	requestFunction: { value: function requestFunction(path, arguments, readyFunction)
	{
		var script = this.scripts.getPropertyAt(path);
		if(script)
			readyFunction(Reflect.construct.call(undefined, Function, arguments.concat(script)));
		else
		{
			var scriptRequest = this.scriptRequests.getPropertyAt(path);
			if(scriptRequest)
				scriptRequest.addEventListener("load", readyFunction);
			else
				readyFunction();
		}
	} },
	activeControlsArray: { get: function getActiveControlsArray()
	{
		return this._activeControlsArray;
	}, set: function setActiveControlsArray(controlsArray)
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
	} },
	activeControls: { set: function setActiveControls(controls)
	{
		if(controls instanceof Controls)
		{
			this.activeControlsArray.push(controls);
			controls.element = this.element;
			controls.startControlsLoop();
		}
	} },
	materials: { get: function getMaterials()
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
			}.bind(this));
		}, this);
	} },
	material: { set: function setMaterial(material)
	{
		if(material instanceof Material)
		{
			this.materials.watchers[this.materials.push(material) - 1] = material.watch(function markMaterialAsModified()
			{
				this.materials.modified = material.modified = true;
			}.bind(this));
		}
	} },
	onElementDelete: { value: function onElementDelete()
	{
		callSuper(this, "onElementDelete");
		if(this.element.requestFullscreen == this.element.webkitRequestFullscreen || this.element.requestFullscreen == this.element.mozRequestFullScreen || this.element.requestFullscreen == this.element.msRequestFullscreen)
			delete this.element.requestFullscreen;
		if(this.element.requestPointerLock == this.element.webkitRequestPointerLock || this.element.requestPointerLock == this.element.mozRequestPointerLock)
			delete this.element.requestPointerLock;
		this.renderer.element = this.controls.element = undefined;
	} },
	onElementSet: { value: function onElementSet()
	{
		callSuper(this, "onElementSet");
		this.element.requestFullscreen = this.element.requestFullscreen || this.element.webkitRequestFullscreen || this.element.mozRequestFullScreen || this.element.msRequestFullscreen;
		this.element.requestPointerLock = this.element.requestPointerLock || this.element.webkitRequestPointerLock || this.element.mozRequestPointerLock;
		this.renderer.element = this.element;
		this.renderer.layers.forEach(function setLayerControlsElement(layer)
		{
			layer.controls.element = this.element;
		}, this);
	} },
	pushUpdateRequest: { value: function pushUpdateRequest(request)
	{
		return this.renderer.updateRequests.push(request) - 1;
	}, writable: true },
	replaceUpdateRequest: { value: function replaceUpdateRequest(request, index)
	{
		var oldRequest = this.renderer.updateRequests[index];
		this.renderer.updateRequests[index] = request;
		return oldRequest;
	} },
	pullUpdateRequest: { value: function pullUpdateRequest(index)
	{
		delete this.renderer.updateRequests[index];
	}, writable: true },
	onContextMenu: { value: function onContextMenu(event)
	{	
		(event || window.event).preventDefault();
	} },
	unload: { value: function unload(event)
	{
		this.save();
		this.controls.unload();
		this.renderer.unload();
		this.removeEventListener("contextmenu");
		window.removeEventListener("beforeunload", this.unloadWrapper);
		return "g";
	} },
	save: { value: function save()
	{
	} }
});

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
	this.scripts = { };
	this.scriptRequests = { };
	var scriptPaths = [ ];
	while((scriptPaths = Object.keys(this.directory.scripts)).length > 0)
	{
		scriptPaths.forEach(function processScriptPaths(startPath)
		{
			var subPaths = this.directory.scripts[startPath];
			console.log(startPath, subPaths);
			delete this.directory.scripts[startPath];
			if(Array.isArray(subPaths))
				subPaths.forEach(function pushScriptRequest(subPath, index)
				{
					var path = "{0}.{1}".format(startPath, subPath);
					var netPath = path;
					while(netPath.indexOf(".") >= 0)
						netPath = netPath.replace(".", "/");
					this.scriptRequests.setPropertyAt(path, requestText("resources/scripts/{0}.js".format(netPath), function putScript(script)
					{
						if(script)
							this.scripts.setPropertyAt(path, script);
						else
						{
							var startNetPath = startPath;
							while(startNetPath.indexOf(".") >= 0)
								startNetPath = startNetPath.replace(".", "/");
							console.error("The script listed at \"{0}/resources/directory.json\"/scripts/{1}[{2}] is either non-existant or empty at \"{0}/resources/scripts/{3}.js\"".format(window.origin, startNetPath, index, netPath));
						}
						this.scriptRequests.deletePropertyAt(path);
					}.bind(this)));
				}, this);
			else
				Object.keys(subPaths).forEach(function putSubPath(subPathStart)
				{
					this.directory.scripts["{0}.{1}".format(startPath, subPathStart)] = subPaths[subPathStart];
				}, this);
				
		}, this);
	}
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
	this.geometryBuilders = { };
	Object.entries(this.directory.geometryBuilders || { }).forEach(function requestGeometryBuilder(entry)
	{
		var geometryName = entry[0];
		var pendingBuilds = [ ];
		this.geometryBuilders[geometryName] = function addGeometryBuildToPending(parameters)
		{
			pendingBuilds.push(parameters);
		};
		requestText("resources/geometry_builders/" + entry[1], function processGeometryBuilder(text)
		{
			if(text)
			{
				var builder = new GeometryBuilder({ path: "{0}/resources/geometry_builders/{1}".format(window.origin, entry[1]), json: JSON.parse(text) });
				var buildGeometry = this.geometryBuilders[geometryName] = function buildGeometry(parameters)
				{
					return new builder.geometryPrototype(parameters);
				};
				pendingBuilds.forEach(buildGeometry);
			}
			else
				console.error("The geometry builder \"{0}\" is either non-existant or empty at \"{1}/resources/geometry_builders/{2}\".".format(entry[0], window.origin, entry[1]));
		}.bind(this));
	}, this);
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
	window.addEventListener("beforeunload", this.unloadWrapper = this.unload.bind(this));
	ElementEventListener.call(this, parameters);
	this.addEventListener("contextmenu", this.onContextMenu);
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