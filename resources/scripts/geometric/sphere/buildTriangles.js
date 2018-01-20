for(var v = 0; v < Math.floor(properties[4] * properties[2]); v++)
{
	for(var h = 0; h < Math.floor(properties[3] * properties[1]); h++)
	{
		var triangleStart = (v * properties[4] + h) * 2;
		triangle(triangleStart, v * (properties[4] + 1) + h, v * (properties[4] + 1) + h + 1, (v + 1) * (properties[4] + 1) + h);
		triangle(triangleStart + 1, v * (properties[4] + 1) + h + 1, (v + 1) * (properties[4] + 1) + h + 1, (v + 1) * (properties[4] + 1) + h);
	}
}
return [ (properties[3] + 1) * (properties[4] + 1), properties[3] * properties[4] * 2 ];
