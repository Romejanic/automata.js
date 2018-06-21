var automata;

window.addEventListener("load", () => {
    automata = Automata(100, 100, {
        canvas: document.getElementById("c"),
        onGenerationAdvance: function(generations) {
            document.getElementById("generations").innerText = String(generations);
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
    }, (automata) => {
        for(var x = 0; x < automata.width; x++) {
            for(var y = 0; y < automata.height; y++) {
                automata.setCell(x, y, Math.random() > 0.5);
            }
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