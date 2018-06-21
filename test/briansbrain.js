/**
 * Implements the Brian's Brain cellular automata
 * https://en.wikipedia.org/wiki/Brian%27s_Brain
 */

// define our Automata variable
var automata;

// Define the different 'states' each cell can have
const states = {
    "alive": 0,
    "dying": 1,
    "dead":  2
};

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
                    cells.setCell(x, y, Math.floor(Math.random() * states.length));
                }
            }
        },

        // determine the cell color based on the value
        getCellColor: function(value, x, y) {
            switch(value) {
                case states["alive"]:
                    return "#000000"; // live cells will be black
                case states["dying"]:
                    return "#0000ff"; // dying cells will be blue
                case states["dead"]:
                default:
                    return undefined; // dead cells will be bgColor
            }
        }
    }, (x, y, value) => { // run for each cell each generation
        // implement the rules of Brian's Brain
        if(value == states["dead"]) { // the cell is currently dead
            var neighbours = automata.getNeighbours(x, y); // get the neighbours
            var neighbourCount = 0;
            neighbours.forEach((v) => {
                if(v == states["alive"]) {
                    neighbourCount++; // count the neighbours with the 'alive' state
                }
            });

            if(neighbourCount == 2) {
                return states["alive"]; // cell comes alive if exactly two neighbours are alive
            }
            return value; // otherwise nothing happens
        } else {
            if(value == states["alive"]) {
                return states["dying"]; // if cell is alive, change to dying
            } else if(value == states["dying"]) {
                return states["dead"]; // if cell is dying, change to dead
            }
            return value; // if other rules don't pass, do nothing
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