requestText("resources/directory.json", function(text)
{
	var canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.tabIndex = 0;
	document.body.appendChild(canvas);
	var game = window.root = new Game({ element: canvas, directory: JSON.parse(text) });
	Object.entries(game.directory.controls).forEach(function(entry)
	{
		if(!entry[1].filters)
			entry[1].filters = { };
		if(!entry[1].controllers)
			entry[1].controllers = { };
		var name = entry[0];
		var func = new Function(entry[1].function).call(game);
		var type = entry[1].type;
		var keyboardControllerFilter = new Function(entry[1].filters.keyboard).call(game);
		var gamepadControllerFilter = new Function(entry[1].filters.gamepad).call(game);
		var keyboardControllers = entry[1].controllers.keyboard || [ ];
		var gamepadControllers = entry[1].controllers.gamepad || [ ];
		game.controls.addControl(name, func, type, keyboardControllerFilter, gamepadControllerFilter, keyboardControllers, gamepadControllers);
	});
	var geometry = new RectangularPrismGeometry(game.level, { game: game, position: { z: -6 }, width: 1, height: 1, render: true });
});
