# automata.js
A JavaScript library for creating cellular automata.

The package allows you to create a cellular automation the easy way! All you need to provide is the width and height of your grid and the rules which govern your automation, and the package will handle simulation, neighbour counting and drawing for you in a highly intuitive, highly customisable manner.

While you can easily create a basic simulation with minimal code, there are several options available to extensively modify and customise the simulation, such as coloring, cell scaling and callbacks to seamlessly integrate your simulation into a project.

# Installation
**Node**
``` bash
$ npm install --save automata.js
```

**Browser (JavaScript)**
1. Download dist/automata.min.js (or dist/automata.js for non-minified).
2. Add the script to your website files.
2. Add a ```script``` tag to your browser: ```<script src="automata.min.js"></script>```.

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

This is also possible with Node, using the [node-canvas](https://github.com/Automattic/node-canvas) module.

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