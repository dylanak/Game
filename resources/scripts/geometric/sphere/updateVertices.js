var vector = [ 0, properties[0], 0 ];
for(var v = 0; v <= Math.floor(properties[3] * properties[1]); v++)
{
	var verticalTransformationMatrix = mat4.rotateX([ ], mat4.identity([ ]), Math.PI * v / properties[3]);
	for(var h = 0; h <= Math.floor(properties[4] * properties[2]); h++)
	{
		var horizontalTransformationMatrix = mat4.rotateY([ ], mat4.identity([ ]), Math.PI2 * h / properties[4] % Math.PI2);
		var transformationMatrix = mat4.multiply([ ], horizontalTransformationMatrix, verticalTransformationMatrix);
		vertex(v * (properties[4] + 1) + h, vector, [ h / properties[4], v / properties[3] ], vector, transformationMatrix);
	}
}
return properties.some(function isInequalToPrevious(value, index){ return value != previousProperties[index]; });