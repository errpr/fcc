let state = {
    startTime: 0,
    endTime: 0,
    timerInterval: 25 * 60 * 1000,
    timerName: 'Session',
    sessionInterval: 25 * 60 * 1000,
    breakInterval: 5 * 60 * 1000
}

let el = {
    sessionV: document.getElementById('session-value'),
    breakV: document.getElementById('break-value'),
    tomato: document.getElementById('tomato-picture'),
    timerName: document.getElementById('timer-name'),
    timerRemaining: document.getElementById('timer-remaining')
}

function updateControlsDisplay() {
    el.sessionV.innerText = (state.sessionInterval / 60) / 1000;
    el.breakV.innerText = (state.breakInterval / 60) / 1000;
}

function updateTimerDisplay(currentTime) {
    el.tomato.style.transform = "rotate(" + calcRotation(currentTime) + "deg)";
    var m = Math.floor(((state.endTime - currentTime) / 60) / 1000);
    var s = Math.floor((state.endTime - currentTime) / 1000) % 60;
    el.timerRemaining.innerText = m + ":" + s;
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
    state.endTime = state.startTime + state.timerInterval;
    setTimeout(timerCallback, 500);
}

function timerCallback() {
    var t = Date.now();
    updateTimerDisplay(t);
    if(t > state.endTime) {
        timerFinished();
    } else {
        setTimeout(timerCallback, 500);
    }
}