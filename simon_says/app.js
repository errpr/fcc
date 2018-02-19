// @ts-check
// milliseconds buttons are highlighted
const HIGHLIGHT_DURATION = 500;

// milliseconds between highlights
const HIGHLIGHT_GAP = 100;

/** @type {Array<HTMLElement>} */
const buttons = [
    document.getElementById('green-button'),
    document.getElementById('red-button'),
    document.getElementById('yellow-button'),
    document.getElementById('blue-button')
]

/** @type {Array<HTMLAudioElement>} */
//@ts-ignore
const sounds = [
    document.getElementById('sound1'), 
    document.getElementById('sound2'),
    document.getElementById('sound3'),
    document.getElementById('sound4')
]

/** @type {number[]} */
let stepsOrder = [];

/** @returns {number} */
function randomStep() {
    return Math.floor(Math.random() * 4);
}

/** @param {number} buttonId 
 * @param {number} duration
*/
function highlightButton(buttonId, duration) {
    let buttonElement = buttons[buttonId];
    buttonElement.classList.add('button-lit');
    sounds[buttonId].play();
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
        buttonId, 
        HIGHLIGHT_DURATION);

    setTimeout(function() {
        animateSteps(step + 1);
    }, HIGHLIGHT_DURATION + HIGHLIGHT_GAP);
}

function addStep() {
    stepsOrder.push(randomStep());
    animateSteps();
}

/** @param {number} level */
function setVolume(level) {
    sounds.map(e => e.volume = level / 100);
}

setVolume(50);
document.getElementById("game-start").addEventListener("click", addStep);