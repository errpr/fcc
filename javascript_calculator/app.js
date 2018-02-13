let prevNumber = 0;
let total = 0;
let currentNumber = "";
let currentOperation = "";
let operationStack = "";
let displayingTotal = false;
const display = document.getElementById('display-current');
const opStackElement = document.getElementById('previous-operation-display');

function toggleHistory() {
    document.getElementById('memory-container').classList.remove('h-and-m-open');
    document.getElementById('history-container').classList.toggle('h-and-m-open');
}

function toggleMemory() {
    document.getElementById('history-container').classList.remove('h-and-m-open');
    document.getElementById('memory-container').classList.toggle('h-and-m-open');
}

function finalizeOperation() {
    operationStack = operationStack + " " + currentNumber + " " + currentOperation;
    opStackElement.innerHTML = operationStack;

    prevNumber = Number.parseFloat(currentNumber);

    currentNumber = total.toString();
    display.innerText = currentNumber;
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
        currentNumber = "";
        displayingTotal = false;
    }
    currentNumber += numberString;
    display.innerText = currentNumber;
}

function decimal() {
    if(displayingTotal || !currentNumber) {
        currentNumber = "0";
        displayingTotal = false;
    }
    currentNumber = currentNumber + ".";
    display.innerText = currentNumber;
}

// some operations only change the current working value, those go here.
function currentOp(opString) {
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
    display.innerText = currentNumber;
}

function operationButton(opString) {
    if(displayingTotal) {
        swapOp(opString);
        return;
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
    opStackElement.innerHTML = operationStack;
}

function equalsButton() {
    executeOperation(currentOperation);
    var final = total;
    clearState();
    total = final;
    finalizeOperation();
    total = 0;
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