var automata;

window.addEventListener("load", () => {
    automata = Automata(100, 100, {
        canvas: document.getElementById("c")
    }, (x, y, value) => {
        if(automata.getCell(x - 1, y)) {
            return false;
        } else if(automata.getCell(x + 1, y)) {
            return Math.random() > 0.5;
        } else {
            return true;
        }
    });
    automata.setCell(automata.width / 2, automata.height / 2, true);
});

function start() {
    automata.start();
}
function stop() {
    automata.stop();
}