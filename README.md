# cells.js
A JavaScript library for creating cellular automata.

The package allows you to create a cellular automation the easy way! All you need to provide is the width and height of your grid and the rules which govern your automation, and the package will handle simulation, neighbour counting and drawing for you in a highly intuitive, highly customisable manner.

While you can easily create a basic simulation with minimal code, there are several options available to extensively modify and customise the simulation, such as coloring, cell scaling and callbacks to seamlessly integrate your simulation into a project.

# Installation
**Node**
``` bash
$ npm install --save cells.js
```

**Browser (JavaScript)**
1. Download dist/cells.min.js (or dist/cells.js for non-minified).
2. Add the script to your website files.
3. Add a ```script``` tag to your browser: ```<script src="cells.min.js"></script>```.

# Usage
**Browser (Javascript)**
```javascript
// Basic cellular automation to move each cell right each generation
var automata = Automata(100, 100, (x, y, value) => {
    return automata.getCell(x - 1, y));
});

// make vertical line to initialize board
for(var y = 0; y < automata.height; y++) {
    automata.setCell(0, y, true);
}

// begin simulating
automata.start();
```

**Node**
```javascript
// Basic cellular automation to move each cell right each generation
const automata = require("automata.js")(100, 100, (x, y, value) => {
    return automata.getCell(x - 1, y);
});

// make vertical line to initialize board
for(var y = 0; y < automata.height; y++) {
    automata.setCell(0, y, true);
}

// begin simulating
automata.start();
```

**Drawing onto canvas (browser)**

This is also possible with Node, using the [node-canvas](https://github.com/Automattic/node-canvas) module (See [node_gol.js](https://github.com/Romejanic/automata.js/blob/master/test/node_gol.js) for details).

> test.html
```html
<html>
<head>
    <title>Example</title>
    <script src="automata.min.js"></script>
    <script src="test.js"></script>
</head>
<body>
    <canvas id="c"></canvas>
</body>
</html>
```
> test.js
```javascript
// Called when the DOM finished loading
document.addEventListener("load", () => {
    // create a 100x100 automation
    var automata = Automata(100, 100, {
        canvas: document.getElementById("c"), // give the canvas
        autoTick: true, // start automatically
        onInitialGeneration: function(cells) {
            for(var y = 0; y < cells.height; y++) {
                cells.setCell(0, y, true); // make a vertical column of cells at x = 0
            }
        }
    }, (x, y, value) => { // run for each cell each generation
        return automata.getCell(x - 1, y); // move each cell right by 1
    });
});
```

# Examples

All examples are available in the [test](https://github.com/Romejanic/automata.js/tree/master/test) folder.

[Conway's Game of Life (HTML)](https://github.com/Romejanic/automata.js/blob/master/test/gol.js)

[Brian's Brain (HTML)](https://github.com/Romejanic/automata.js/blob/master/test/briansbrain.js)

[Conway's Game of Life (Node)](https://github.com/Romejanic/automata.js/blob/master/test/node_gol.js)

# API

## Automata Class
This class is constructed by the `Automata()` constructor which is defined/required by your program. It is the base of the simulation.

- ``Automata(width, height, cellCallback)``: Constructs an Automata object with the specified width, height and cell logic callback. These three parameter are **mandatory**.
- ``Automata(width, height, options, cellCallback)``: Constructs an Automata object with the specified width, height, options (details below) and cell logic callback.
- ``width``: The width of the grid.
- ``height``: The height of the grid.
- ``generations``: The number of generations run by the current simulation.
- ``cells``: An array of all the cells and their values.

- ``options``: All the current options (both user-defined and default) used by the simulation (detailed below).

- ``getCell(x, y)``: Gets the value of the cell at the given coordinates.
- ``setCell(x, y, value)``: Sets the value of the cell at the given coordinates.
- ``getNeighbours(x, y)``: Returns an array of the values of each neighbour to the given cell (Based on Moore's neighbourhood. This should be overidden if you want a different algorithm).
- ``countNeighbours(x, y)``: Returns the number of valid neighbours to the given cell. The logic for which is defined in the options.
- ``tick()``: Runs a single generation of the simulation.
- ``draw()``: If a valid canvas is attached, draw the grid and all cells onto it.
- ``start()``: Begin running the simulation.
- ``stop()``: Pause the currently running simulation.
- ``isRunning()``: Checks if the simulation is currently running.
- ``reset()``: Resets the grid. This also ensure the canvas is the correct size (if the dimensions are changed) and runs the initial generation again (if desired).

## Options Object
This object is passed into the `Automata()` constructor to change the settings and behaviour of the simulation. **NOT ALL FIELDS ARE REQUIRED**. The default values will be listed below.

- ``tickSpeed``: How many generations are calculated each second (after calling `start()`). **(Number, default 40)**.
- ``autoTick``: If true, the simulation will begin running when the `Automata` object is constructed. **(Boolean, default false)**.
- ``blankReset``: If true, the inital generation code will not be run when the `reset()` function is called. **(Boolean, default false)**.
- ``onInitialGeneration()``: Called before the first generation is run. Populates the board with inital data. **(Function, default undefined)**.
- ``onGenerationAdvance(n)``: Called after a generation has been run. The number of generations (`n`) is given as a parameter. **(Function, default undefined)**.
- ``shouldCountNeighbour(value)``: Used by the ``countNeighbours`` function to determine if the given `value` should 'count' as a valid neighbour. If undefined, values which equate to true will be counted. **(Function, default undefined)**.
- ``canvas``: The canvas to draw the grid onto. If no canvas is provided, the grid will not be drawn at all. **(HTMLCanvasElement / Canvas, default undefined)**.
- ``autoDraw``: If true, the grid will be automatically drawn after each generation is calculated. **(Boolean, default true)**.
- ``cellScale``: How large (in pixels) each cell will appear on the canvas. Used to calculate the canvas size. **(Number, default 5)**.
- ``bgColor``: The style of the background if no cell is present. **(String, default `"#FFFFFF"`)**.
- ``getCellColor(value, x, y)``: Called for each cell, used to determine the style of each cell based on position and value. Return the style as a string, or `undefined` if the cell is 'dead' or inactive. By default, if a cell's value equates to ``true``, this function returns ``#000000``, otherwise it returns ``undefined``. **(Function)**.
- ``gridLines``: An object used to control the gridlines. See the settings below for information on how to use this.
- ``gridLines.draw``: If true, gridlines will be drawn over the canvas. **(Boolean, default true)**.
- ``gridLines.every``: A grid line on each axis will be created for every ``gridLines.every``th cell. Can be used to create spacing between gridlines. **(Number, default 1)**.
- ``gridLines.color``: The style of the gridlines. **(String, default ``"#808080"``)**

Please read [src/automata.js](https://github.com/Romejanic/automata.js/blob/master/src/automata.js) for more information.
