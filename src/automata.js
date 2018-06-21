/**
    automata.js by Romejanic.
    Updated 21 - 6 - 2018
 */

 // Check the assert() function exists. If it doesn't, create our own.
const globalScope = window || global;
if(!globalScope.assert) {
    globalScope.assert = function(condition, message) {
        if(!condition) {
            throw message || "assert failed!";
        }
    };
}

// define the Automata() constructor
const Automata = function(width, height, options, cellCallback) {
    // if a callback is passed with no options, swap the parameters around
    if(!cellCallback && typeof options == "function") {
        cellCallback = options;
        options = undefined;
    }

    // Ensure required parameters are passed
    assert(width, "You must provide a width!");
    assert(height, "You must provide a height!");
    assert(cellCallback, "You must provide a cell logic callback!");

    // Create the Automata object
    const obj = {
        // Define fields
        width: width,
        height: height,
        generations: 0,
        cells: Array(width * height),

        // Define our options object and fill it with user-defined options (if they exist)
        options: {
            // Simulation options
            tickSpeed: options.tickSpeed || 40,
            autoTick: options.autoTick || false,
            blankReset: options.blankReset || false,
            
            // Callbacks
            onInitialGeneration: options.onInitialGeneration || undefined,
            onGenerationAdvance: options.onGenerationAdvance || undefined,

            // Rendering options
            canvas: options.canvas || undefined,
            autoDraw: options.autoDraw || true,
            cellScale: options.cellScale || 5,
            bgColor: options.bgColor || "#FFFFFF",
            getCellColor: options.getCellColor || function(cellValue, x, y) {
                // Called for each cell to determine it's color based on position
                return cellValue ? "#000000" : undefined;
            },
            // Settings specific to grid lines
            gridLines: {
                draw: options.gridLines ? options.gridLines.draw : true,
                every: options.gridLines ? options.gridLines.every : 1,
                color: options.gridLines ? options.gridLines.color : "#808080"
            }
        },

        // Gets the value of the cell at the coordinates
        getCell: function(x, y) {
            // check the given coordinates are within range
            if(x < 0 || y < 0 || x >= obj.width || y >= obj.height) {
                return 0;
            }
            return obj.cells[(y*obj.width)+x];
        },
        // Sets the value of the cell at the coordinates
        setCell: function(x, y, value) {
            // check the given coordinates are within range
            if(x < 0 || y < 0 || x >= obj.width || y >= obj.height) {
                return 0;
            }
            obj.cells[(y*obj.width)+x] = value;
        },

        // Gets the value of all neighbours and stores them in an array
        getNeighbours: function(x, y) {
            var neighbourValues = [];
            // Loop through each neighbour in a 3x3 grid around (x,y)
            for(var ox = -1; ox <= 1; ox++) {
                for(var oy = -1; oy <= 1; oy++) {
                    if(ox == 0 && oy == 0) {
                        // don't sample the cell itself!
                        continue;
                    }
                    // add the cell value to the array
                    neighbourValues.push(obj.getCell(x + ox, y + oy));
                }
            }
            return neighbourValues;
        },

        // Advance the simulation by one generation
        tick: function() {
            obj.generations++;

            // Invoke the cell callback to simulate each cell
            var newCells = Array(obj.width * obj.height);
            for(var x = 0; x < obj.width; x++) {
                for(var y = 0; y < obj.height; y++) {
                    newCells[(y*obj.width)+x] = cellCallback(x, y, obj.getCell(x, y));
                }
            }
            // Allocate the new cell values to the old array
            obj.cells = newCells;

            if(obj.options.onGenerationAdvance) {
                // Call the generation advance callback (if it exists)
                obj.options.onGenerationAdvance(obj.generations);
            }
            if(obj.options.autoDraw) {
                // If the canvas draws automatically, call the draw function
                obj.draw();
            }
        },
        // Draws the cells as they currently are
        draw: function() {
            if(obj.options.canvas) { // Don't draw if there's nothing to draw to
                var ctx = obj.options.canvas.getContext("2d");
                // Clear the canvas
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                var scl = obj.options.cellScale;
                // Loop through each cell and draw it
                for(var x = 0; x < obj.width; x++) {
                    for(var y = 0; y < obj.height; y++) {
                        // Find the color of the current cell
                        ctx.fillStyle = obj.options.getCellColor(obj.getCell(x, y), x, y) || obj.options.bgColor;
                        ctx.fillRect(x * scl, y * scl, scl, scl);
                    }
                }

                // Check if we want to draw grid lines
                if(obj.options.gridLines.draw) {
                    ctx.fillStyle = obj.options.gridLines.color;
                    // Draw vertical grid lines (top to bottom)
                    for(var x = 0; x < obj.width; x += obj.options.gridLines.every) {
                        ctx.fillRect(x * scl, 0, 1, ctx.canvas.height);
                    }
                    // Draw horizontal grid lines (left to right)
                    for(var y = 0; y < obj.height; y += obj.options.gridLines.every) {
                        ctx.fillRect(0, y * scl, ctx.canvas.width, 1);
                    }
                }
            }
        },

        // Starts running the simulation at the rate defined in the settings
        start: function() {
            // Make sure no simulation is already running
            assert(!obj.isRunning(), "The automation is already started!");
            obj.cellTickInterval = setInterval(obj.tick, (1/obj.options.tickSpeed) * 1000);
        },

        // Stop running the simulation
        stop: function() {
            // Make sure the simulation is running first
            assert(obj.isRunning(), "The automation is not started!");
            clearInterval(obj.cellTickInterval);
            delete obj.cellTickInterval;
        },

        // Checks if the simulation is currently running
        isRunning: function() {
            return obj.cellTickInterval;
        },

        // Resets the board and reallocates the cell array (can be used to change board size)
        reset: function() {
            if(obj.isRunning()) {
                obj.stop(); // Stop a simulation if it is already running
            }
            obj.generations = 0; // Reset generation count
            obj.cells = Array(obj.width * obj.height); // Create new cell array
            if(!obj.options.blankReset && obj.options.onInitialGeneration) {
                obj.options.onInitialGeneration(obj); // Run the inital generation again (if desired)
            }
            
            // Make sure canvas is right size. If not, resize it
            var canvasW = obj.width * obj.options.cellScale;
            var canvasH = obj.height * obj.options.cellScale;
            if(obj.canvas.width != canvasW || obj.canvas.height != canvasH) {
                obj.options.canvas.width = obj.width * obj.options.cellScale;
                obj.options.canvas.height = obj.height * obj.options.cellScale;
            }

            obj.draw(); // Draw the board to update it
        }
    };

    // Sets up the canvas
    if(obj.options.canvas) {
        obj.options.canvas.width = obj.width * obj.options.cellScale;
        obj.options.canvas.height = obj.height * obj.options.cellScale;
        obj.draw();
    }
    // Starts simulation automatically (if desired)
    if(obj.options.autoTick) {
        obj.start();
    }
    // Performs initial generation and drawing
    if(obj.options.onInitialGeneration) {
        obj.options.onInitialGeneration(obj);
        obj.draw();
    }

    // Finally, return the object
    return obj;
};

if(typeof module !== "undefined") {
    module.exports = Automata; // if we are on node, export the constructor as a module
}