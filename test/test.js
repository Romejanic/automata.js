var automata;

window.addEventListener("load", () => {
    automata = Automata(100, 100, {
        canvas: document.getElementById("c")
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
    
    for(var i = 0; i < 1000; i++) {
        var x = Math.floor(Math.random() * automata.width);
        var y = Math.floor(Math.random() * automata.height);
        automata.setCell(x, y, Math.random() > 0.5);
    }
});

function start() {
    automata.start();
}
function stop() {
    automata.stop();
}