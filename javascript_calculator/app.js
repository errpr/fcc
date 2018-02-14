let prevNumber = 0;
let total = 0;
let currentNumber = "";
let currentOperation = "";
let operationStack = "";
let displayingTotal = false;
let restoredHistory = false;
let calcHistory = [];
let calcMemory = [];
const display = document.getElementById('display-current');
const opStackElement = document.getElementById('previous-operation-display');
const historyElement = document.getElementById('history-list');
const memoryElement = document.getElementById('memory-list');

function toggleHistory() {
    document.getElementById('memory-container').classList.remove('h-and-m-open');
    document.getElementById('history-container').classList.toggle('h-and-m-open');
}

function toggleMemory() {
    document.getElementById('history-container').classList.remove('h-and-m-open');
    document.getElementById('memory-container').classList.toggle('h-and-m-open');
}

function updateDisplays() {
    display.innerText = currentNumber;
    opStackElement.innerText = operationStack;
}

function finalizeOperation() {
    operationStack = operationStack + " " + currentNumber + " " + currentOperation;
    prevNumber = Number.parseFloat(currentNumber);
    currentNumber = total.toString();
    updateDisplays();
    displayingTotal = true;
}

function executeOperation(op) {
    var n = Number.parseFloat(currentNumber);
    switch(op) {
        case("+"): total = total + n; break;
        case("-"): total = total - n; break;
        case("*"): total = total * n; break;
        case("/"): total = total / n; break;
        default: total = n; break;
    }
}

function numberButton(numberString) {
    if(displayingTotal || currentNumber === '0') {
        if(restoredHistory) {
            display.innerText = "Choose an operator";
            return;
        } else {
            currentNumber = "";
            displayingTotal = false;
        }
    }
    currentNumber += numberString;
    updateDisplays();
}

function decimal() {
    if(displayingTotal || !currentNumber) {
        if(restoredHistory) {
            display.innerText = "Choose an operator";
            return;
        } else {
            currentNumber = "0";
            displayingTotal = false;
        }
    }
    currentNumber = currentNumber + ".";
    updateDisplays();
}

// some operations only change the current working value, those go here.
function currentOp(opString) {
    if(restoredHistory) {
        display.innerText = "Choose an operator";
        return;
    }
    if(!currentNumber || currentNumber === '0') { display.innerText = "0"; currentNumber = "0"; return; }
    var n = Number.parseFloat(currentNumber);
    var m = 0;
    switch(opString) {
        case('%'): m = ((prevNumber * n) / 100); break;
        case('square'): m = (n * n); break;
        case('sqrt'): m = Math.sqrt(n); break;
        case('oneOver'): m = 1 / n; break;
        case('sign'): m = -n; break;
        case('backspace'): m = currentNumber.slice(0, currentNumber.length - 1); break;
    }
    currentNumber = (!!m ? m.toString() : "0");
    updateDisplays();
}

function operationButton(opString) {
    if(displayingTotal) {
        if(!!currentOperation || restoredHistory) {
            restoredHistory = false;
            swapOp(opString);
            return;
        }
    }
    if(!currentNumber) { return; }
    executeOperation(currentOperation);
    currentOperation = opString;
    finalizeOperation();
}

function swapOp(opString) {
    currentOperation = opString;
    operationStack = operationStack.slice(0, operationStack.length - 1);
    operationStack += opString;
    updateDisplays();
}

function equalsButton() {
    if(restoredHistory || !currentOperation) { return; }
    executeOperation(currentOperation);
    var final = total;
    saveHistory(final);
    clearState();
    total = final;
    finalizeOperation();
    total = 0;
}

function saveHistory(final) {
    calcHistory.push({
        operationStack: operationStack + ' ' + currentNumber + ' =',
        total: final
    })
    rebuildHistory();
}

function clearEntryButton() {
    currentNumber = "";
    display.innerText = "0";
}

function clearButton() {
    clearState();
    opStackElement.innerText = "";
    display.innerText = "0";
}

function clearState() {
    currentOperation = "";
    operationStack = "";
    currentNumber = "";
    total = 0;
    prevNumber = 0;
}

function clearHistory() {
    calcHistory = [];
    rebuildHistory();
}

function handleHistoryClick(e) {
    const el = e.target;
    const index = el.getAttribute('data-index');
    const o = calcHistory[index];
    clearState();
    restoredHistory = true;
    operationStack = o.operationStack;
    total = o.total;
    currentNumber = o.total;
    displayingTotal = true;
    updateDisplays();
}

function rebuildHistory() {
    historyElement.innerHTML = '';
    calcHistory.forEach(function(o,i,a){
        const li = document.createElement('li');
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');

        li.classList.add('history-item');
        li.setAttribute('data-index', i);
        li.addEventListener('click',handleHistoryClick);

        p1.classList.add('history-item-ops');
        p1.setAttribute('data-index', i);
        p1.innerText = o.operationStack;

        p2.classList.add('history-item-total');
        p2.setAttribute('data-index', i);
        p2.innerText = o.total;

        li.appendChild(p1);
        li.appendChild(p2);
        historyElement.insertBefore(li, historyElement.firstChild);
    });
}

function clearMemory() {
    calcMemory = [];
    rebuildMemory();
}

function storeMemory() {
    calcMemory.push(Number.parseFloat(currentNumber));
    rebuildMemory();
}

function handleMemoryItemClick(e) {
    const i = e.target.getAttribute('data-index');
    const func = e.target.getAttribute('data-func');
    switch(func){
        case('clear'): memoryClear(i); break;
        case('add'): memoryAdd(i); break;
        case('subtract'): memorySubtract(i); break;
        case('recall'): memoryRecall(i); break;
        default: break;
    }
}

function memoryClear(i = calcMemory.length - 1) {
    if(i === -1) { return; }
    calcMemory.splice(i);
    rebuildMemory();
}

function memoryAdd(i = calcMemory.length - 1) {
    if(i === -1) { i = 0; }
    calcMemory[i] += Number.parseFloat(currentNumber);
    rebuildMemory();
}

function memorySubtract(i = calcMemory.length - 1) {
    if(i === -1) { i = 0; }
    calcMemory[i] -= Number.parseFloat(currentNumber);
    rebuildMemory();
}

function memoryRecall(i = calcMemory.length - 1) {
    if(i === -1) { return; }
    clearState();
    currentNumber = "" + calcMemory[i];
    updateDisplays();
}

function rebuildMemory() {
    memoryElement.innerHTML = '';
    calcMemory.forEach(function(v,i,a){
        const li = document.createElement('li');
        const p = document.createElement('p');
        const b1 = document.createElement('button');
        const b2 = document.createElement('button');
        const b3 = document.createElement('button');

        li.classList.add('memory-item');
        li.setAttribute('data-index', i);
        li.setAttribute('data-func', 'recall');
        li.addEventListener('click', handleMemoryItemClick);

        p.classList.add('memory-item-value');
        p.setAttribute('data-index', i);
        p.setAttribute('data-func', 'recall');
        p.innerText = v;

        b1.classList.add('memory-item-button');
        b1.classList.add('memory-item-clear');
        b1.setAttribute('data-index', i);
        b1.setAttribute('data-func', 'clear');
        b1.innerText = 'MC';

        b2.classList.add('memory-item-button');
        b2.classList.add('memory-item-add');
        b2.setAttribute('data-index', i);
        b2.setAttribute('data-func', 'add');
        b2.innerText = 'M+';    

        b3.classList.add('memory-item-button');
        b3.classList.add('memory-item-subtract');
        b3.setAttribute('data-index', i);
        b3.setAttribute('data-func', 'subtract');
        b3.innerText = 'M-';

        li.appendChild(p);
        li.appendChild(b1);
        li.appendChild(b2);
        li.appendChild(b3);
        memoryElement.insertBefore(li, memoryElement.firstChild);
    });
}

function fireClick(buttonId) {
    var button = document.getElementById(buttonId);
    button.classList.add('clicked');
    button.click();
    setTimeout(function() {
        button.classList.remove('clicked');
    }, 100);
}

function handleKeyDown(e) {
    e.preventDefault();
    switch(e.key) {
        case("Equals"): fireClick("equals"); break;
        case("Enter"): fireClick("equals"); break;
        case("Backspace"): fireClick("backspace"); break;
        case("Delete"): fireClick("clear-entry"); break;
        case("Clear"): fireClick("clear-entry"); break;
        case("/"): fireClick("divide"); break;
        case("+"): fireClick("add"); break;
        case("-"): fireClick("subtract"); break;
        case("."): fireClick("decimal"); break;
        case("*"): fireClick("multiply"); break;
        case("9"): fireClick("nine"); break;
        case("8"): fireClick("eight"); break;
        case("7"): fireClick("seven"); break;
        case("6"): fireClick("six"); break;
        case("5"): fireClick("five"); break;
        case("4"): fireClick("four"); break;
        case("3"): fireClick("three"); break;
        case("2"): fireClick("two"); break;
        case("1"): fireClick("one"); break;
        case("0"): fireClick("zero"); break;
        default: break;
    }
}

document.addEventListener("keydown", handleKeyDown);