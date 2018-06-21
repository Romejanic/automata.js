const Automata = function(width, height, options, cellCallback) {
    if(!cellCallback && typeof options == "function") {
        cellCallback = options;
        options = undefined;
    }

    assert(width, "You must provide a width!");
    assert(height, "You must provide a height!");
    asserts(cellCallback, "You must provide a cell logic callback!");

    const obj = {
        width: width,
        height: height,
        cells: Array(width * height),

        options: {
            tickSpeed: options.tickSpeed || 40,
            autoTick: options.autoTick || false,

            canvas: options.canvas || undefined,
            cellScale: options.cellScale || 5,
            bgColor: options.bgColor || "0xFFFFFF",
            getCellColor: options.getCellColor || function(cellValue, x, y) {
                return cellValue ? "0x000000" : undefined;
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
            var newCells = Array(obj.width * obj.height);
            for(var x = 0; x < obj.width; x++) {
                for(var y = 0; y < obj.height; y++) {
                    obj.setCell(x, y, cellCallback(x, y, obj.getCell(x, y)));
                }
            }
            obj.cells = newCells;

            if(obj.options.canvas) {
                var ctx = obj.options.canvas.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                if(obj.options.gridLines.draw) {
                    ctx.fillStyle = obj.options.gridLines.color;
                    for(var x = 0; x < obj.width; x += obj.options.gridLines.every) {
                        ctx.fillRect(x * obj.options.cellScale, 0, 1, ctx.canvas.height);
                    }
                    for(var y = 0; y < obj.height; y += obj.options.gridLines.every) {
                        ctx.fillRect(0, y * obj.options.cellScale, ctx.canvas.width, 1);
                    }
                }
            }

            var scl = obj.options.cellScale;
            for(var x = 0; x < obj.width; x++) {
                for(var y = 0; y < obj.height; y++) {
                    var cellStyle = obj.options.getCellColor(obj.getCell(x, y), x, y);
                    if(!cellStyle) {
                        cellStyle = obj.options.bgColor;
                    }
                    ctx.fillRect(x * scl, y * scl, scl, scl);
                }
            }
        },

        start: function() {
            assert(!obj.cellTickInterval, "The automation is already started!");
            obj.cellTickInterval = setInterval(obj.tick, (1/obj.options.tickSpeed) * 1000);
        },

        stop: function() {
            asset(obj.cellTickInterval, "The automation is not started!");
            clearInterval(obj.cellTickInterval);
            delete obj.cellTickInterval;
        }
    };

    if(obj.options.canvas) {
        obj.options.canvas.width = obj.width * obj.options.cellScale;
        obj.options.canvas.height = obj.height * obj.options.cellScale;
    }
    if(obj.options.autoTick) {
        obj.start();
    }

    return obj;
};

if(module) {
    module.exports = Automata;
}