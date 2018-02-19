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

/** @type {boolean} */
let animating = false;
/** @type {boolean} */
let strictMode = false;

/** @type {number} */
let playerStep = 0;

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
    animating = true;
    if(buttonId === undefined || buttonId === null) {
        animating = false;
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
    document.getElementById('game-count').innerText = stepsOrder.length.toString();
    animateSteps();
}

/** @param {number} level */
function setVolume(level) {
    sounds.map(e => e.volume = level / 100);
}

function successfulClick() {
    playerStep++;
    if(playerStep >= 20) {
        gameWon();
    } else {
        if(playerStep === stepsOrder.length) {
            animating = true;
            playerStep = 0;
            setTimeout(addStep, HIGHLIGHT_DURATION);
        }
    }
}

function failureClick() {
    if(strictMode) {
        resetGame();
    } else {
        animateSteps();
    }
}

function gameWon() {
    alert("You won!");
    resetGame();
}

function resetGame() {
    stepsOrder = [];
    playerStep = 0;
    addStep();
}

/** @param {number} buttonId */
function buttonHandler(buttonId) {
    console.log(buttonId);
    if(animating) { return; }
    sounds[buttonId].play();
    if(stepsOrder[playerStep] === buttonId) {
        successfulClick();
    } else {
        animating = true;
        setTimeout(failureClick, HIGHLIGHT_DURATION);
    }
}

/** @param {Event} event */
function toggleStrict(event) {
    console.log(event);
    strictMode = !strictMode;
}

function assignClickHandlers() {
    buttons.map((e, i) => {
        e.addEventListener('click', function() { buttonHandler(i) });
    });
}

setVolume(50);
assignClickHandlers();
document.getElementById("game-strict").addEventListener("change", toggleStrict);
document.getElementById("game-start").addEventListener("click", resetGame);