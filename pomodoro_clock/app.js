const TICK_RATE = 250;       //milliseconds
const ONE_SECOND = 1000;    //milliseconds
const ONE_MINUTE = 60 * ONE_SECOND;

let state = {
    startTime: 0,
    endTime: 0,
    timerInterval: function() { return state.sessionInterval },
    timerName: 'Session',
    sessionInterval: 25 * ONE_MINUTE,
    breakInterval: 5 * ONE_MINUTE,
    started: false,
    paused: false,
    timePaused: 0
}

const el = {
    sessionV: document.getElementById('session-value'),
    breakV: document.getElementById('break-value'),
    tomato: document.getElementById('tomato-picture'),
    timerName: document.getElementById('timer-name'),
    timerRemaining: document.getElementById('timer-remaining'),
    timerDisplay: document.getElementById('timer-display')
}

function updateControlsDisplay() {
    el.sessionV.innerText = state.sessionInterval / ONE_MINUTE;
    el.breakV.innerText = state.breakInterval / ONE_MINUTE;
    if(!state.started) {
        updateTimerDisplay()
    }
}

function updateTimerDisplay(currentTime = 0) {
    if(state.started) {
        el.tomato.style.transform = "rotate(" + calcRotation(currentTime) + "deg)";
        let m = Math.floor((state.endTime - currentTime) / ONE_MINUTE);
        if(m < 0) { m = 0; }
        let s = (Math.round((state.endTime - currentTime) / ONE_SECOND) % 60).toString();
        if(s.length === 1) { s = "0" + s; }
        el.timerRemaining.innerText = m + ":" + s;
    } else {
        el.timerName.innerText = state.timerName;
        el.tomato.style.transform = "";
        const m = Math.round(state.timerInterval() / ONE_MINUTE);
        el.timerRemaining.innerText = m + ":00";
    }
}

// converts time to degrees rotation
function calcRotation(currentTime) {
    const minT = state.startTime;
    const maxT = state.endTime;
    const maxDeg = 360;
    const minDeg = 0;
    const timeRange = (maxT - minT);
    const degRange = (maxDeg - minDeg);
    return (((currentTime - minT) * degRange) / timeRange) + minDeg;
}

function beginTimer() {
    state.startTime = Date.now();
    state.started = true;
    state.endTime = state.startTime + state.timerInterval();
    timerTick();
}

function timerTick() {
    const t = Date.now();
    if(!state.started || state.paused || state.timePaused > t - TICK_RATE) {
        return;
    }
    updateTimerDisplay(t);
    if(t > state.endTime) {
        timerFinished();
    } else {
        setTimeout(timerTick, TICK_RATE);
    }
}

function swapTimers() {
    if(state.timerName == 'Session') {
        state.timerName = 'Break';
        state.timerInterval = function() { return state.breakInterval };
    } else {
        state.timerName = 'Session';
        state.timerInterval = function() { return state.sessionInterval };
    }
}

function timerFinished() {
    swapTimers();
    state.started = false;
    updateTimerDisplay();
}

function pause() {
    state.paused = true;
    state.timePaused = Date.now();
}

function unpause() {
    state.paused = false;
    const pauseLength = Date.now() - state.timePaused;
    state.startTime += pauseLength;
    state.endTime += pauseLength;
    timerTick();
}

function handleTomatoClick() {
    if(state.paused) {
        unpause();
    } else if(state.started) {
        pause();
    } else {
        beginTimer();
    }
}

function increaseBreakTime() {
    state.breakInterval += ONE_MINUTE;
    updateControlsDisplay();
}

function decreaseBreakTime() {
    state.breakInterval -= ONE_MINUTE;
    updateControlsDisplay();
}

function increaseSessionTime() {
    state.sessionInterval += ONE_MINUTE;
    updateControlsDisplay();
}

function decreaseSessionTime() {
    state.sessionInterval -= ONE_MINUTE;
    updateControlsDisplay();
}

function resetTimer() {
    state.endTime = 0;
    state.startTime = 0;
    state.started = false;
    state.paused = false;
    updateControlsDisplay();
}

el.timerDisplay.addEventListener('click', handleTomatoClick);
updateTimerDisplay();
updateControlsDisplay();