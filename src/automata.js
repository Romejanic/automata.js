/**
    automata.js by Romejanic
 */

const globalScope = window || global;
if(!globalScope.assert) {
    globalScope.assert = function(condition, message) {
        if(!condition) {
            throw message || "assert failed!";
        }
    };
}

const Automata = function(width, height, options, cellCallback, initial) {
    if(!cellCallback && typeof options == "function") {
        cellCallback = options;
        options = undefined;
    }

    assert(width, "You must provide a width!");
    assert(height, "You must provide a height!");
    assert(cellCallback, "You must provide a cell logic callback!");

    const obj = {
        width: width,
        height: height,
        generations: 0,
        cells: Array(width * height),

        options: {
            tickSpeed: options.tickSpeed || 40,
            autoTick: options.autoTick || false,
            blankReset: options.blankReset || false,

            canvas: options.canvas || undefined,
            autoDraw: options.autoDraw || true,
            cellScale: options.cellScale || 5,
            bgColor: options.bgColor || "#FFFFFF",
            getCellColor: options.getCellColor || function(cellValue, x, y) {
                return cellValue ? "#000000" : undefined;
            },
            gridLines: {
                draw: options.gridLines ? options.gridLines.draw : true,
                every: options.gridLines ? options.gridLines.every : 1,
                color: options.gridLines ? options.gridLines.color : "#808080"
            }
        },

        getCell: function(x, y) {
            if(x < 0 || y < 0 || x >= obj.width || y >= obj.height) {
                return 0;
            }
            return obj.cells[(y*obj.width)+x];
        },
        setCell: function(x, y, value) {
            if(x < 0 || y < 0 || x >= obj.width || y >= obj.height) {
                return 0;
            }
            obj.cells[(y*obj.width)+x] = value;
        },

        getNeighbours: function(x, y) {
            var neighbourValues = [];
            for(var ox = -1; ox <= 1; ox++) {
                for(var oy = -1; oy <= 1; oy++) {
                    if(ox == 0 && oy == 0) {
                        continue;
                    }
                    neighbourValues.push(obj.getCell(x + ox, y + oy));
                }
            }
            return neighbourValues;
        },

        tick: function() {
            obj.generations++;
            var newCells = Array(obj.width * obj.height);
            for(var x = 0; x < obj.width; x++) {
                for(var y = 0; y < obj.height; y++) {
                    newCells[(y*obj.width)+x] = cellCallback(x, y, obj.getCell(x, y));
                }
            }
            obj.cells = newCells;

            if(obj.options.autoDraw) {
                obj.draw();
            }
        },
        draw: function() {
            if(obj.options.canvas) {
                var ctx = obj.options.canvas.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                var scl = obj.options.cellScale;
                for(var x = 0; x < obj.width; x++) {
                    for(var y = 0; y < obj.height; y++) {
                        ctx.fillStyle = obj.options.getCellColor(obj.getCell(x, y), x, y) || obj.options.bgColor;
                        ctx.fillRect(x * scl, y * scl, scl, scl);
                    }
                }

                if(obj.options.gridLines.draw) {
                    ctx.fillStyle = obj.options.gridLines.color;
                    for(var x = 0; x < obj.width; x += obj.options.gridLines.every) {
                        ctx.fillRect(x * scl, 0, 1, ctx.canvas.height);
                    }
                    for(var y = 0; y < obj.height; y += obj.options.gridLines.every) {
                        ctx.fillRect(0, y * scl, ctx.canvas.width, 1);
                    }
                }
            }
        },

        start: function() {
            assert(!obj.isRunning(), "The automation is already started!");
            obj.cellTickInterval = setInterval(obj.tick, (1/obj.options.tickSpeed) * 1000);
        },

        stop: function() {
            assert(obj.isRunning(), "The automation is not started!");
            clearInterval(obj.cellTickInterval);
            delete obj.cellTickInterval;
        },

        isRunning: function() {
            return obj.cellTickInterval;
        },

        reset: function() {
            if(obj.isRunning()) {
                obj.stop();
            }
            obj.generations = 0;
            obj.cells = Array(obj.width * obj.height);
            if(!obj.options.blankReset && initial) {
                initial(obj);
            }
            obj.draw();
        }
    };

    if(obj.options.canvas) {
        obj.options.canvas.width = obj.width * obj.options.cellScale;
        obj.options.canvas.height = obj.height * obj.options.cellScale;
        obj.draw();
    }
    if(obj.options.autoTick) {
        obj.start();
    }
    if(initial) {
        initial(obj);
        obj.draw();
    }

    return obj;
};

if(typeof module !== "undefined") {
    module.exports = Automata;
}