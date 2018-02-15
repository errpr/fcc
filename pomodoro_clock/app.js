let state = {
    startTime: 0,
    endTime: 0,
    timerInterval: 1 * 60 * 1000,
    timerName: 'Session',
    sessionInterval: 1 * 60 * 1000,
    breakInterval: 5 * 60 * 1000,
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
    el.sessionV.innerText = (state.sessionInterval / 60) / 1000;
    el.breakV.innerText = (state.breakInterval / 60) / 1000;
}

function updateTimerDisplay(currentTime) {
    if(state.started) {
        el.tomato.style.transform = "rotate(" + calcRotation(currentTime) + "deg)";
        let m = Math.floor(((state.endTime - currentTime) / 1000) / 60);
        if(m < 0) { m = 0; }
        let s = (Math.round((state.endTime - currentTime) / 1000) % 60).toString();
        if(s.length === 1) { s = "0" + s; }
        el.timerRemaining.innerText = m + ":" + s;
    } else {
        el.timerName.innerText = state.timerName;
        el.tomato.style.transform = "";
        const m = Math.round((state.timerInterval / 60) / 1000);
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
    state.endTime = state.startTime + state.timerInterval;
    setTimeout(timerCallback, 1000);
}

function timerCallback() {
    const t = Date.now();
    if(state.paused || state.timePaused > t - 500) {
        return;
    }
    updateTimerDisplay(t);
    if(t > state.endTime) {
        timerFinished();
    } else {
        setTimeout(timerCallback, 500);
    }
}

function swapTimers() {
    if(state.timerName == 'Session') {
        state.timerName = 'Break';
        state.timerInterval = state.breakInterval;
    } else {
        state.timerName = 'Session';
        state.timerInterval = state.sessionInterval;
    }
}

function timerFinished() {
    alert(state.timerName + ' finished.');
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
    timerCallback();
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

el.timerDisplay.addEventListener('click', handleTomatoClick);
updateTimerDisplay();
updateControlsDisplay();