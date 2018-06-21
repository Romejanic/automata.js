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
                    
                }
            }
        }
    };
    return obj;
};

if(module) {
    module.exports = Automata;
}