var vector = [ 0, properties[0], 0 ];
for(var v = 0; v <= Math.floor(properties[4] * properties[2]); v++)
{
	var verticalTransformationMatrix = mat4.rotateX([ ], mat4.identity([ ]), Math.PI * v / properties[4]);
	for(var h = 0; h <= Math.floor(properties[3] * properties[1]); h++)
	{
		var horizontalTransformationMatrix = mat4.rotateY([ ], mat4.identity([ ]), Math.PI2 * h / properties[3]);
		var transformationMatrix = mat4.multiply([ ], horizontalTransformationMatrix, verticalTransformationMatrix);
		vertex(v * (properties[4] + 1) + h, vector, [ h / properties[3], v / properties[4] ], vector, transformationMatrix);
	}
	
}
return false;