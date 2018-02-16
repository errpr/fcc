let playerSymbol = "";
let computerSymbol = "";

const rows = [
    [0,1,2],
    [3,4,5],
    [6,7,8]
];

const columns = [
    [0,3,6],
    [1,4,7],
    [2,5,8]
];

const crosses = [
    [0,4,8],
    [2,4,6]
];

const allGroups = rows.concat(columns).concat(crosses);

let gameState = {}

function buildTiles() {
    return [
        {
            id: 0,
            column_id: 0,
            row_id: 0,
            cross_member: true,
            cross_id: 0,
            occupiedBy: '',
            element: document.getElementById('tile-0')
        },
        {
            id: 1,
            column_id: 1,
            row_id: 0,
            cross_member: false,
            cross_id: null,
            occupiedBy: '',
            element: document.getElementById('tile-1')
        },
        {
            id: 2,
            column_id: 2,
            row_id: 0,
            cross_member: true,
            cross_id: 1,
            occupiedBy: '',
            element: document.getElementById('tile-2')
        },
        {
            id: 3,
            column_id: 0,
            row_id: 1,
            cross_member: false,
            cross_id: null,
            occupiedBy: '',
            element: document.getElementById('tile-3')
        },
        {
            id: 4,
            column_id: 1,
            row_id: 1,
            cross_member: 'center',
            cross_id: null,
            occupiedBy: '',
            element: document.getElementById('tile-4')
        },
        {
            id: 5,
            column_id: 2,
            row_id: 1,
            cross_member: false,
            cross_id: null,
            occupiedBy: '',
            element: document.getElementById('tile-5')
        },
        {
            id: 6,
            column_id: 0,
            row_id: 2,
            cross_member: true,
            cross_id: 1,
            occupiedBy: '',
            element: document.getElementById('tile-6')
        },
        {
            id: 7,
            column_id: 1,
            row_id: 2,
            cross_member: false,
            cross_id: null,
            occupiedBy: '',
            element: document.getElementById('tile-7')
        },
        {
            id: 8,
            column_id: 2,
            row_id: 2,
            cross_member: true,
            cross_id: 0,
            occupiedBy: '',
            element: document.getElementById('tile-8')
        },
    ]
}

function chooseSymbol(symbol) {
    if(gameState.symbolChosen) {
        removeSymbolChooser();
        return;
    }
    if(symbol === "X") {
        playerSymbol = "X";
        computerSymbol = "O";
    } else if(symbol === "O") {
        playerSymbol = "O";
        computerSymbol = "X";
    } else {
        return;
    }
    gameState.symbolChosen = true;
    
    removeSymbolChooser();
    beginGame();
}

function checkForDraw() {
    for(let i = 0; i < gameState.tiles.length; i++) {
        if(gameState.tiles[i].occupiedBy === "") {
            return false;
        }
    }
    return true;
}

function removeSymbolChooser() {
    document.getElementById('select-symbol').style.display = 'none';
}

function displaySymbolChooser() {
    document.getElementById('select-symbol').style.display = 'initial';
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

function playerTiles(a = gameState.tiles) {
    return a.filter(e => e.occupiedBy === playerSymbol);
}

function computerTiles(a = gameState.tiles) {
    return a.filter(e => e.occupiedBy === computerSymbol);
}

function cornerTiles(a = gameState.tiles) {
    return a.filter(e => e.cross_member === true);
}

function edgeTiles(a = gameState.tiles) {
    return a.filter(e => e.cross_member === false);
}

function emptyTiles(a = gameState.tiles) {
    return a.filter(e => e.occupiedBy === "");
}

function randomTile(a = gameState.tiles) {
    return a[Math.floor(Math.random() * a.length)];
}

function rowTiles(tile) {
    return gameState.tiles.filter(e => tile.row_id);
}

function columnTiles(tile) {
    return gameState.tiles.filter(e => tile.column_id);
}

function crossTiles(tile) {
    if(tile.cross_member !== true) { return []; }
    return gameState.tiles.filter(e => tile.cross_id);
}

function firstComputerTurn() {
    if(gameState.computerTurns == 0) {
        if(computerSymbol === 'X'){
            return randomTile(emptyTiles(cornerTiles()));
        } else {
            if(gameState.tiles[4].occupiedBy === "") {
                return gameState.tiles[4];
            } else {
                return randomTile(emptyTiles(cornerTiles()));
            }
        }
    }
    return false;
}

function secondComputerTurn() {
    if(gameState.computerTurns == 1) {
        if(computerSymbol === 'X'){
            let myTile = computerTiles()[0];
            let theirTile = playerTiles()[0];

            if(playerControlsCenter()) {
                let adjacentedge = edgeTiles(rowTiles(myTile))[0];
                return adjacentedge;
            } else if(playerControlsOppositeCorner()) {
                return randomTile(emptyTiles(cornerTiles()));
            } else if(playerControlsEdge()) {
                if(theirTile.column_id !== myTile.column_id) {
                    if(theirTile.row_id !== myTile.row_id) {
                        return false;
                    } else {
                        return edgeTiles(columnTiles(myTile))[0];
                    }
                } else {
                    return edgeTiles(rowTiles(myTile))[0];
                }
            } else {
                // player controls non-opposing corner
                if(myTile.column_id == theirTile.column_id) {
                    return edgeTiles(rowTiles(myTile))[0];
                } else {
                    return edgeTiles(columnTiles(myTile))[0];
                }
            }
        } else {
            if(playerControlsCenter()) {
                if(playerControlsOppositeCorner()){
                    return randomTile(emptyTiles(cornerTiles()));
                } else {
                    return false;
                }
            } else {
                result = lookForBlock();
                if(result) {
                    return result;
                } else {
                    return randomTile(emptyTiles(edgeTiles()));
                }
            }
        }
    }
    return false;
}

function playerControlsCenter() {
    return gameState.tiles[4].occupiedBy === playerSymbol;
}

function playerControlsOppositeCorner() {
    let mytile = computerTiles(cornerTiles())[0];
    let oppositecorner = crosses[mytile.cross_id].filter(e => e !== 4 && e !== mytile.id);
    if(gameState.tiles[oppositecorner].occupiedBy === playerSymbol) {
        return true;
    }
    return false;
}

function playerControlsEdge() {
    let playerEdge = playerTiles(edgeTiles());
    return playerEdge.length > 0;
}

function chooseTile(id) {
    if(!gameState.playersTurn) { return; }
    let t = gameState.tiles[id];
    if(t.occupiedBy === "") {
        t.occupiedBy = playerSymbol;
        t.element.innerText = playerSymbol;
        endPlayerTurn();
    }
}

function endPlayerTurn() {
    gameState.playersTurn = false;
    gameState.playerTurns++;
    if(checkForDraw()) {
        drawHasOccurred();
    } else {
        computerTurn();
    }
}

function computerTurn() {
    let result = firstComputerTurn();
    if(result) {
        computerMove(result);
        return;
    }

    result = secondComputerTurn();
    if(result) {
        computerMove(result);
        return;
    }

    result = lookForWin();
    if(result) {
        computerWinningMove(result);
        return;
    }

    result = lookForBlock();
    if(result) {
        computerMove(result);
        return;
    }

    result = lookForCenter();
    if(result) {
        computerMove(result);
        return;
    }

    randomMove();
}

function lookForCenter() {
    if(gameState.tiles[4].occupiedBy === ""){
        return gameState.tiles[4];
    }
    return false;
}

function checkGroupForWin(a) {
    let mine = [];
    let empty = [];

    for(var i = 0; i < a.length; i++) {
        let e = gameState.tiles[a[i]];
        if(e.occupiedBy == '') {
            empty.push(e);
        } else if(e.occupiedBy == computerSymbol) {
            mine.push(e);
        } else {
            // if player has a tile in this row we can't win here
            return false;
        }
    }

    if(mine.length == 2 && empty.length == 1) {
        return [empty[0], mine[0], mine[1]];
    }

    return false;
}

function lookForWin() {
    let result = false;

    for(let i = 0; i < 3; i++){
        result = checkGroupForWin(columns[i]);
        if(result) { result.push('column'); return result; }
        result = checkGroupForWin(rows[i]);
        if(result) { result.push('row'); return result; }
    }

    result = checkGroupForWin(crosses[0]);
    if(result) { result.push('cross0'); return result; }
    result = checkGroupForWin(crosses[1]);
    if(result) { result.push('cross1'); return result; }

    return false;
}

function checkGroupForBlock(a) {
    let theirs = [];
    let empty = [];

    for(var i = 0; i < a.length; i++) {
        let e = gameState.tiles[a[i]];
        if(e.occupiedBy === "") {
            empty.push(e);
        } else if(e.occupiedBy == playerSymbol) {
            theirs.push(e);
        } else {
            // if we have a tile in this group, player can't win here
            return false;
        }
    }

    if(theirs.length == 2 && empty.length == 1) {
        return empty[0];
    }

    return false;
}

function lookForBlock() {
    for(let i = 0; i < allGroups.length; i++) {
        let result = checkGroupForBlock(allGroups[i]);
        if(result) {
            return result;
        }
    }
    return false;
}

function randomMove() {
    let loop = true;
    while(loop) {
        let t = gameState.tiles[Math.floor(Math.random() * 9)];
        if(t.occupiedBy === ""){
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
    gameState.computerTurns++;
    if(checkForDraw()) { drawHasOccurred(); };
}

function computerWinningMove(args) {
    let moveTile = args[0];
    let rowTile1 = args[1];
    let rowTile2 = args[2];
    let winType = args[3];
    gameState.tiles[moveTile.id].occupiedBy = computerSymbol;
    gameState.computerTurns++;
    moveTile.element.innerText = computerSymbol;
    moveTile.element.classList.add('win-' + winType);

    rowTile1.element.innerText = computerSymbol;
    rowTile1.element.classList.add('win-' + winType);

    rowTile2.element.innerText = computerSymbol;
    rowTile2.element.classList.add('win-' + winType);

    gameOver('computer wins');
}

function drawHasOccurred() {
    gameOver('draw');
}

function gameOver(reason) {
    gameState.started = false;
    alert('game over ' + reason);
    setTimeout(resetGame, 1000);
}

function resetGame() {
    gameState = {
        started: false,
        symbolChosen: false,
        playersTurn: false,
        playerTurns: 0,
        computerTurns: 0,
        tiles: buildTiles()
    }
    gameState.tiles.forEach(e => {
        e.element.innerText = "";
        e.element.classList = "board-tile";
    });
    displaySymbolChooser();
    playerSymbol = "";
    computerSymbol = "";
}

resetGame();