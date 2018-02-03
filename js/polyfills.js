Object.defineProperty(Math, "HALFPI", { value: Math.PI / 2 });
Object.defineProperty(Math, "PI2", { value: Math.PI * 2 });
Object.defineProperty(Math, "RTD", { value: 180 / Math.PI });
Array.prototype.fill = Array.prototype.fill || function(value)
{
	if(this == null)
		throw new TypeError('this is null or not defined');
	var O = Object(this);
	var len = O.length >>> 0;
	var start = arguments[1];
	var relativeStart = start >> 0;
	var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
	var end = arguments[2];
	var relativeEnd = end === undefined ? len : end >> 0;
	var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
	for(; k < final; k++)
		O[k] = value;
	return O;
};
Array.prototype.find = Array.prototype.find || function(predicate)
{
	if(this == null)
	{
		throw new TypeError('"this" is null or not defined');
	}
	var o = Object(this);
	var len = o.length >>> 0;
	if(typeof predicate !== 'function')
	{
		throw new TypeError('predicate must be a function');
	}
	var thisArg = arguments[1];
	var k = 0;
	while(k < len)
	{
		var kValue = o[k];
		if(predicate.call(thisArg, kValue, k, o))
		{
			return kValue;
		}
		k++;
	}
	return undefined;
};
Array.prototype.includes = Array.prototype.includes || function(searchElement, fromIndex)
{
	if(this == null)
		throw new TypeError('"this" is null or not defined');
	var o = Object(this);
	var len = o.length >>> 0;
	if(len == 0)
		return false;
	var n = fromIndex | 0;
	var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
	function sameValueZero(x, y)
	{
		return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
	}
	while(k < len)
	{
		if(sameValueZero(o[k], searchElement))
			return true;
		k++;
	}
	return false;
}
Number.isInteger = Number.isInteger || function(value)
{
	return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};
Number.isFinite = Number.isFinite || function(value)
{
	return typeof value === 'number' && isFinite(value);
};
String.prototype.startsWith = String.prototype.startsWith || function(searchString, position)
{
	return this.substr(position || 0, searchString.length) === searchString;
};
if(typeof Object.assign != 'function')
{
	Object.defineProperty(Object, "assign",
	{
		value: function assign(target, varArgs) 
		{
			'use strict';
			if(target == null) 
			{
				throw new TypeError('Cannot convert undefined or null to object');
			}
			var to = Object(target);
			for(var index = 1; index < arguments.length; index++)
			{
				var nextSource = arguments[index];
				if(nextSource != null) 
				{
					for(var nextKey in nextSource)
					{
						if(Object.prototype.hasOwnProperty.call(nextSource, nextKey))
						{
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
};
if(!Object.entries)
	Object.entries = function(obj)
	{
		var ownProps = Object.keys(obj), i = ownProps.length, resArray = new Array(i);
		while(i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
		return resArray;
	};
String.prototype.format = function()
{
	var formatted = this;
	for(var i = 0; i < arguments.length; i++)
	{
		var toReplace = "{" + i + "}";
		while(formatted.indexOf(toReplace) >= 0)
			formatted = formatted.replace(toReplace, arguments[i]);
	}
	return formatted;
}
Object.merge = function(mergeByDefault, behaviors)
{
	var objects = Array.from(arguments).splice(2, arguments.length - 2).filter(function(argument) { return argument; });
	behaviors = behaviors || { };
	var newObject = { };
	objects.forEach(function(object) { Object.entries(object).forEach(function(entry)
	{
		var behavior = behaviors[entry[0]];
		if(behavior instanceof Function)
		{
			var entries = [ ];
			for(var i = 0; i < objects.length; i++)
			{
				var otherEntry = objects[i][entry[0]];
				if(otherEntry != undefined)
					entries.push(otherEntry);
			}
			var newEntry = behavior.apply(this, entries);
			if(newEntry)
				newObject[entry[0]] = newEntry;
		}
		else if(!newObject[entry[0]])
		{
			if(mergeByDefault)
			{
				var entries = [ ];
				for(var i = 0; i < objects.length; i++)
				{
					var otherEntry = objects[i][entry[0]];
					if(otherEntry != undefined)
						entries.push(otherEntry);
				}
				if(entries.length > 0 && (entries.length != 1 || entries[0] != entry[1]))
					newObject[entry[0]] = Object.merge.apply(this, [ true, behaviors[entry[0]] ].concat(entries));
				else
					newObject[entry[0]] = entry[1];
			}
			else
				newObject[entry[0]] = entry[1];
		}
	}); });
	return newObject;
}
Object.prototype.setPropertyAt = function(path, value)
{
	var last;
	var root = this;
	path.split(".").forEach(function(sub, index, array)
	{
		if(array.length - 1 <= index)
			last = sub;
		else
		{
			var subProp = root[sub];
			if(subProp)
				root = subProp;
			else
				root = root[sub] = { };
		}
	});
	return root[last] = value;
}
Object.prototype.getPropertyAt = function(path)
{
	var last;
	var root = this;
	path.split(".").forEach(function(sub, index, array)
	{
		if(array.length - 1 <= index)
			last = sub;
		else if(root)
			root = root[sub];
	});
	return root ? root[last] : undefined;
}
Object.prototype.deletePropertyAt = function(path)
{
	var root = this;
	path.split(".").forEach(function(sub, index, array)
	{
		if(root)
			if(array.length - 1 <= index)
				delete root[sub];
			else
				root = root[sub];
	});
}
Object.withPropertiesAt = function()
{
	var properties = Math.floor(arguments.length / 2);
	var ret = { };
	for(var i = 0; i < properties; i++)
		ret.setPropertyAt(arguments[i * 2], arguments[i * 2 + 1]);
	return ret;
}
navigator.getGamepads = navigator.getGamepads || function()
{
	return [ ];
}
navigator.getVRDisplays = navigator.getVRDisplays || function()
{
	return { then: function(f) { f([ ]); } };
};