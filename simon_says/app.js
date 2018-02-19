// @ts-check
// milliseconds buttons are highlighted
const HIGHLIGHT_DURATION = 500;

// milliseconds between highlights
const HIGHLIGHT_GAP = 100;

/** @type {number[]} */
let stepsOrder = [];

/** @type {Array<HTMLElement>} */
let buttons = [
    document.getElementById('green-button'),
    document.getElementById('red-button'),
    document.getElementById('yellow-button'),
    document.getElementById('blue-button')
]

/** @returns {number} */
function randomStep() {
    return Math.floor(Math.random() * 4);
}

/** @param {HTMLElement} buttonElement 
 * @param {number} duration
*/
function highlightButton(buttonElement, duration) {
    buttonElement.classList.add('button-lit');
    setTimeout(function() { 
        unhighlightButton(buttonElement);
    }, duration)
}

/** @param {HTMLElement} buttonElement */
function unhighlightButton(buttonElement) {
    buttonElement.classList.remove('button-lit');
}

function animateSteps(step = 0) {
    let buttonId = stepsOrder[step];
    if(buttonId === undefined || buttonId === null) { 
        return;
    }

    highlightButton(
        buttons[buttonId], 
        HIGHLIGHT_DURATION);

    setTimeout(function() {
        animateSteps(step + 1);
    }, HIGHLIGHT_DURATION + HIGHLIGHT_GAP);
}

function addStep() {
    stepsOrder.push(randomStep());
    animateSteps();
}

document.getElementById("game-start").addEventListener("click", addStep);