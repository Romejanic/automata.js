// define our Automata variable
var automata;

window.addEventListener("load", () => {
    // Create Automata instance
    automata = Automata(100, 100, {
        canvas: document.getElementById("c"), // give our canvas
        onGenerationAdvance: function(generations) { // called whenever a generation is completed
            document.getElementById("generations").innerText = String(generations); // update generations text
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
});

function start() {
    automata.start(); // start the simulation
}
function stop() {
    automata.stop(); // pause the simulation
}
function step() {
    if(automata.isRunning()) {
        return;
    }
    automata.tick(); // step through by one generation
}
function reset() {
    automata.reset(); // reset the board
    document.getElementById("generations").innerText = "0"; // reset generation counter
}