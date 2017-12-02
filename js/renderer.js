var textureCache = [ ];

function requestTexture(source, onload)
{
	var gl = root.renderer.gl;
	var image = new Image();
	image.onload = function()
	{
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		if(isPowerOfTwo(image.width) && isPowerOfTwo(image.height))
		{
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			var index = textureCache.push(texture) - 1;
			onload(function()
			{
				return textureCache[index];
			});
		}
	};
	image.src = source;
}