for(var side = 0; side < 6; side++)
{
	var startTriangle = side * 2;
	var startVertex = side * 4;
	triangle(startTriangle, startVertex, startVertex + 1, startVertex + 3);
	triangle(startTriangle + 1, startVertex + 1, startVertex + 2, startVertex + 3);
}
return [ 24, 12 ];
