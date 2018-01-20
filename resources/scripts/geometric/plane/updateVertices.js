var mults = [ ];
var halfdims = [ properties[0] / 2, properties[1] / 2 ];
for(var i = 0; i < 4; i++)
{
	mults[1] = i % 3 == 0 ? -1 : 1;
	mults[2] = Math.floor(i / 2) * 2 - 1;
	vertex(i, [ halfdims[0] * mults[1], halfdims[1] * -mults[2], 0 ], [ mults[1] / 2 + .5, mults[2] / 2 + .5 ], [ 0, 0, 1 ]);
}
return false;
