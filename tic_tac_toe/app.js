let playerSymbol = "";
let computerSymbol = "";

const gameState = {
    started: false,
    symbolChosen: false,
    playersTurn: false,
    tiles: buildTiles()
}

const rows = function() { return [
    [
        gameState.tiles[0],
        gameState.tiles[1],
        gameState.tiles[2]
    ],
    [
        gameState.tiles[3],
        gameState.tiles[4],
        gameState.tiles[5]
    ],
    [
        gameState.tiles[6],
        gameState.tiles[7],
        gameState.tiles[8]
    ]
] }
const columns = function() { return [
    [
        gameState.tiles[0],
        gameState.tiles[3],
        gameState.tiles[6]
    ],
    [
        gameState.tiles[1],
        gameState.tiles[4],
        gameState.tiles[7]
    ],
    [
        gameState.tiles[2],
        gameState.tiles[5],
        gameState.tiles[8]
    ]
] }
const crosses = function() { return [
    [
        gameState.tiles[0],
        gameState.tiles[4],
        gameState.tiles[8]
    ],
    [
        gameState.tiles[2],
        gameState.tiles[4],
        gameState.tiles[6]
    ]
] }

function buildTiles() {
    let a = [];
    for(let i = 0; i < 9; i++){
        a.push({
            id: i,
            occupiedBy: "",
            element: document.getElementById('tile-' + i)
        });
    }
    return a;
}

function chooseSymbol(symbol) {
    if(gameState.symbolChosen) {
        removeSymbolChooser();
        return;
    }
    if(symbol === "X") {
        playerSymbol = "X"
        computerSymbol = "O"
    } else if(symbol === "O") {
        playerSymbol = "O"
        computerSymbol = "O"
    } else {
        return;
    }
    gameState.symbolChosen = true;
    
    removeSymbolChooser();
    beginGame();
}

function checkForDraw() {
    for(let i = 0; i < gameState.tiles.length; i++) {
        if(gameState.tiles[i].occupiedBy == "") {
            return false;
        }
    }
    return true;
}

function removeSymbolChooser() {
    document.getElementById('select-symbol').style.display = 'none';
}

function beginGame() {
    if(gameState.started) { return; }
    if(playerSymbol == 'X') {
        gameState.started = true;
        gameState.playersTurn = true;
    } else {
        gameState.started = true;
        computerTurn();
    }
}

function chooseTile(id) {
    if(!gameState.playersTurn) { return; }
    let t = gameState.tiles[id];
    if(t.occupiedBy == "") {
        t.occupiedBy = playerSymbol;
    }
    t.element.innerText = playerSymbol;
    endPlayerTurn();
}

function endPlayerTurn() {
    gameState.playersTurn = false;
    if(checkForDraw()) {
        drawHasOccurred();
    } else {
        computerTurn();
    }
}

function checkGroupForPlayerWin(a, winType) {
    if( a[0].occupiedBy == playerSymbol &&
        a[1].occupiedBy == playerSymbol &&
        a[2].occupiedBy == playerSymbol) {
            return true;
        }
    return false;
}

function computerTurn() {
    if(lookForWin()) { return; }
    if(lookForBlock()) { return; }
    randomMove();
}

function checkGroupForWin(a) {
    let mine = a.filter(e => e.occupiedBy == computerSymbol);
    let empty = a.filter(e => e.occupiedBy == "");
    if(mine.length == 2 && empty.length == 1) {
        return [empty[0], mine[0], mine[1]];
    }
    return false;
}

function lookForWin() {
    let r = rows();
    let c = columns();
    let x = crosses();
    for(let i = 0; i < r.length; i++) {
        let result = checkGroupForWin(r[i]);
        if(result) {
            computerWins(result[0], result[1], result[2], 'row');
            console.log('lookForWin found - row');
            console.log(r[i]);
            return true;
        }
    }
    for(let i = 0; i < c.length; i++) {
        let result = checkGroupForWin(c[i]);
        if(result) {
            computerWins(result[0], result[1], result[2], 'column');
            console.log('lookForWin found - columnd');
            console.log(r[i]);
            return true;
        }
    }
    for(let i = 0; i < x.length; i++) {
        let result = checkGroupForWin(x[i]);
        if(result) {
            computerWins(result[0], result[1], result[2], 'cross');
            console.log('lookForWin found - cross');
            console.log(r[i]);
            return true;
        }
    }
    return false;
}

function checkGroupForBlock(a) {
    let theirs = a.filter(e => e.occupiedBy == playerSymbol);
    let empty = a.filter(e => e.occupiedBy == "");
    if(theirs.length == 2 && empty.length == 1) {
        return empty[0];
    }
    return false;
}

function lookForBlock() {
    let r = rows();
    let c = columns();
    let x = crosses();
    for(let i = 0; i < r.length; i++) {
        let result = checkGroupForBlock(r[i]);
        if(result) {
            computerMove(result);
            console.log('lookForBlock found - row');
            console.log(r[i]);
            return true;
        }
    }
    for(let i = 0; i < c.length; i++) {
        let result = checkGroupForBlock(c[i]);
        if(result) {
            computerMove(result);
            console.log('lookForBlock found - column');
            console.log(c[i]);
            return true;
        }
    }
    for(let i = 0; i < x.length; i++) {
        let result = checkGroupForBlock(x[i]);
        if(result) {
            computerMove(result);
            console.log('lookForBlock found - cross');
            console.log(x[i]);
            return true;
        }
    }
    return false;
}

function randomMove() {
    let loop = true;
    while(loop) {
        let t = gameState.tiles[Math.floor(Math.random() * 8)];
        if(t.occupiedBy == ""){
            computerMove(t);
            loop = false;
        }
    }
}

function computerMove(moveTile) {
    let t = gameState.tiles[moveTile.id];
    t.occupiedBy = computerSymbol;
    t.element.innerText = computerSymbol;
    gameState.playersTurn = true;
    if(checkForDraw()) { drawHasOccurred(); };
}

function computerWins(moveTile, rowTile1, rowTile2, winType) {
    console.log('win found at ');
    console.log(moveTile);
    let t = gameState.tiles[moveTile.id];
    t.occupiedBy = computerSymbol;
    moveTile.element.innerText = computerSymbol;
    moveTile.element.classList.add('win-' + winType);

    rowTile1.element.innerText = computerSymbol;
    rowTile1.element.classList.add('win-' + winType);

    rowTile2.element.innerText = computerSymbol;
    rowTile2.element.classList.add('win-' + winType);
}

function drawHasOccurred() {
    gameState.started = false;
    alert('game over');
}