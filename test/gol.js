var automata;

window.addEventListener("load", () => {
    automata = Automata(100, 100, {
        canvas: document.getElementById("c"),
        onGenerationAdvance: function(generations) {
            document.getElementById("generations").innerText = String(generations);
        },
        onInitialGeneration: function(cells) {
            for(var x = 0; x < cells.width; x++) {
                for(var y = 0; y < cells.height; y++) {
                    cells.setCell(x, y, Math.random() > 0.5);
                }
            }
        }
    }, (x, y, value) => {
        var neighbours = automata.getNeighbours(x, y);
        var neighbourCount = 0;
        neighbours.forEach((v) => {
            if(v) {
                neighbourCount++;
            }
        });

        if(value && neighbourCount < 2) {
            return false;
        } else if(value && neighbourCount > 3) {
            return false;
        } else if(!value && neighbourCount == 3) {
            return true;
        } else {
            return value;
        }
    });
});

function start() {
    automata.start();
}
function stop() {
    automata.stop();
}
function step() {
    if(automata.isRunning()) {
        return;
    }
    automata.tick();
}
function reset() {
    automata.reset();
}