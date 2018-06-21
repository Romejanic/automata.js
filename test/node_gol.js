const fs = require("fs");
const { createCanvas } = require("canvas");

var canvas = createCanvas(100, 100); // create the canvas
const maxGenerations = 100; // how many generations will our simulation run for?

// create the automation
const automata = require("automata.js")(100, 100, {
    canvas: canvas, // give our canvas
    autoTick: true, // start the simulation automatically
    onGenerationAdvance: function(n) {
        var out = fs.createWriteStream(__dirname + "/gol_gen_" + n + ".png");
        var png = canvas.createPNGStream(); // convert canvas content to PNG
        png.pipe(out); // write PNG to file

        if(n >= maxGenerations) {
            automata.stop(); // stop the simulation once maxGenerations is reached
            console.log("Finished simulation");
        }
    },
    // generate the initial cells when the simulation starts
    onInitialGeneration: function(cells) {
        // loops through entire cells
        for(var x = 0; x < cells.width; x++) {
            for(var y = 0; y < cells.height; y++) {
                // randomly set cells to 'alive'
                cells.setCell(x, y, Math.random() > 0.5);
            }
        }

        // Print generation count to console
        console.log("Running simulation for " + maxGenerations + " generations...");
    }
}, (x, y, value) => { // run for each cell each generation
    var neighbours = automata.getNeighbours(x, y); // get the neighbours
    var neighbourCount = 0;
    neighbours.forEach((v) => {
        if(v) {
            neighbourCount++; // count the live neighbours
        }
    });

    // implement the rules of Conway's GOL
    if(value && neighbourCount < 2) {
        return false; // die if less than two neighbours (underpopulation)
    } else if(value && neighbourCount > 3) {
        return false; // die if more than three neighbours (overpopulation)
    } else if(!value && neighbourCount == 3) {
        return true; // become alive if exactly three neighbours exist (reproduction)
    } else {
        return value; // if other rules do not pass, do nothing
    }
});