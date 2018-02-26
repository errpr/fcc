"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TILE_VISIBILITY = 11;

var TRANSITION_SPEED = 250;

var roomMap = Array(11).fill().map(function (e) {
    return Array(11).fill(0);
});
var rooms = [{}, {
    id: 1,
    x: 5,
    y: 5,
    height: 10,
    width: 10,
    doors: {
        right: 0
    },
    walls: {
        right: 2,
        left: 1,
        up: 1,
        down: 1
    },
    tiles: [[0]],
    entities: [[0]]
}];
var currentRoomId = 1;
rooms[1].tiles = generateRoomTiles(rooms[1]);
rooms[1].entities = generateRoomEntities(rooms[1]);

/*
Tile ids
0 - floor tile 0
1 - floor tile 1
2 - floor tile 2
3 - floor tile 3
4 - door tile
5 - blackness
6 - unused
7 - wall corner tile
8 - horizontally running wall tile
9 - vertically running wall tile

Walls ids
0 - no wall
1 - wall
2 - wall with door

mock up of room data structure that would have doors on the left and right walls
Room = {
    id: 2 // index in the rooms array,
    doors: { // ids of rooms doors lead to
        left: 1,
        right: 0 // 0 means spawn a new room when we go through the door
    },
    walls: {
        left: 2,
        right: 2,
        down: 1,
        up: 1
    }
}
*/

// /** @returns {number[][]}   */
// function generateMap() {
//     let m = Array(MAP_HEIGHT);
//     for(let i = 0; i < MAP_HEIGHT; i++) {
//         m[i] = Array(MAP_WIDTH);
//         for(let j = 0; j < MAP_WIDTH; j++) {
//             m[i][j] = floorTile();
//         }
//     }
//     return m;
// }

/** @param {Object} room 
 * @param {number} room.height
 * @param {number} room.width
 * @returns {number[][]}   */
function generateRoomEntities(room) {
    var m = Array(room.height).fill(0);
    for (var i = 1; i < room.height - 1; i++) {
        m[i] = Array(room.width).fill(0);
        for (var j = 1; j < room.width - 1; j++) {
            m[i][j] = Math.random() > 0.8 ? 2 : 0;
        }
    }
    return m;
}

function enterNewDoor(doorId, room_x, room_y) {}

/** @returns {number} */
function floorTile() {
    return Math.floor(Math.random() * 4);
}

/**
 * @param {Object} room
 * @param {number} room.height
 * @param {number} room.width
 * @param {Object} room.walls
 * @param {number} room.walls.up
 * @param {number} room.walls.down
 * @param {number} room.walls.left
 * @param {number} room.walls.right
 * @returns {number[][]}
 */
function generateRoomTiles(room) {
    var height = room.height;
    var width = room.width;
    var m = Array(height);

    for (var i = 0; i < height; i++) {
        m[i] = Array(width);
        m[i][0] = 9;
        m[i][width - 1] = 9;

        for (var j = 1; j < width - 1; j++) {
            if (i == 0) {
                m[i][j] = 8;
            } else if (i == height - 1) {
                m[i][j] = 8;
            } else {
                m[i][j] = floorTile();
            }
        }
    }

    // put in doors
    if (room.walls.left == 2) {
        m[Math.floor(height / 2)][0] = 4;
    }
    if (room.walls.right == 2) {
        m[Math.floor(height / 2)][width - 1] = 4;
    }
    if (room.walls.up == 2) {
        m[0][Math.floor(width / 2)] = 4;
    }
    if (room.walls.down == 2) {
        m[height - 1][Math.floor(width / 2)] = 4;
    }

    // put in corners
    m[0][0] = 7;
    m[0][width - 1] = 7;
    m[height - 1][0] = 7;
    m[height - 1][width - 1] = 7;

    return m;
}

/** 
 * @param {number} x
 * @param {number} y
 * @param {Object} room
 * @param {number} room.height
 * @param {number} room.width
 * @param {number[][]} room.tiles
 * @returns {number[][]}
 */
function getVisibleTiles(x, y, room) {
    var x1 = Math.floor(x - TILE_VISIBILITY / 2);
    var x2 = Math.floor(x + TILE_VISIBILITY / 2);
    var y1 = Math.floor(y - TILE_VISIBILITY / 2);
    var y2 = Math.floor(y + TILE_VISIBILITY / 2);
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(room.tiles[i][j]);
        }
    }

    return t;
}

/** 
 * @param {number} x
 * @param {number} y
 * @param {Object} room
 * @param {number} room.height
 * @param {number} room.width
 * @param {number[][]} room.entities
 * @returns {number[][]}
 */
function getVisibleEntities(x, y, room) {
    var x1 = Math.floor(x - TILE_VISIBILITY / 2);
    var x2 = Math.floor(x + TILE_VISIBILITY / 2);
    var y1 = Math.floor(y - TILE_VISIBILITY / 2);
    var y2 = Math.floor(y + TILE_VISIBILITY / 2);
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(room.entities[i][j]);
        }
    }

    return t;
}

function EntityCell(props) {
    return React.createElement("div", { className: "entity entity-" + props.entity });
}

function EntityRow(props) {
    var entityCells = props.entities.map(function (e, j) {
        return React.createElement(EntityCell, { key: "" + props.i + j, entity: e ? e : 0 });
    });
    return React.createElement(
        "div",
        { className: "entity-row" },
        entityCells
    );
}

function EntityGrid(props) {
    var entityRows = props.entities.map(function (e, i) {
        return React.createElement(EntityRow, { key: i, i: i, entities: e });
    });
    return React.createElement(
        "div",
        { id: "entity-grid", className: "entity-grid" },
        entityRows
    );
}

function TileCell(props) {
    return React.createElement("div", { className: "tile tile-" + props.tile });
}

function TileRow(props) {
    var tileCells = props.tiles.map(function (e, j) {
        return React.createElement(TileCell, { key: "" + props.i + j, tile: e });
    });
    return React.createElement(
        "div",
        { className: "tile-row" },
        tileCells
    );
}

function TileGrid(props) {
    var tileRows = props.tiles.map(function (e, i) {
        return React.createElement(TileRow, { key: i, i: i, tiles: e });
    });
    return React.createElement(
        "div",
        { id: "tile-grid", className: "tile-grid" },
        tileRows
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            tiles: [[1]],
            entityTiles: [[0]],
            player: {
                x: 5,
                y: 5
            },
            moving: false,
            facing: 'l'
        };

        _this.moveLeft = function () {
            if (_this.state.moving) {
                return;
            }
            _this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-right");
            document.getElementById("entity-grid").classList.add("translate-right");
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x - 1, y: p.y },
                    tiles: getVisibleTiles(p.x - 1, p.y, rooms[currentRoomId]),
                    entityTiles: getVisibleEntities(p.x - 1, p.y, rooms[currentRoomId]),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        };

        _this.moveRight = function () {
            if (_this.state.moving) {
                return;
            }
            _this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-left");
            document.getElementById("entity-grid").classList.add("translate-left");
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x + 1, y: p.y },
                    tiles: getVisibleTiles(p.x + 1, p.y, rooms[currentRoomId]),
                    entityTiles: getVisibleEntities(p.x + 1, p.y, rooms[currentRoomId]),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        };

        _this.moveUp = function () {
            if (_this.state.moving) {
                return;
            }
            _this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-down");
            document.getElementById("entity-grid").classList.add("translate-down");
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x, y: p.y - 1 },
                    tiles: getVisibleTiles(p.x, p.y - 1, rooms[currentRoomId]),
                    entityTiles: getVisibleEntities(p.x, p.y - 1, rooms[currentRoomId]),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        };

        _this.moveDown = function () {
            if (_this.state.moving) {
                return;
            }
            _this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-up");
            document.getElementById("entity-grid").classList.add("translate-up");
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x, y: p.y + 1 },
                    tiles: getVisibleTiles(p.x, p.y + 1, rooms[currentRoomId]),
                    entityTiles: getVisibleEntities(p.x, p.y + 1, rooms[currentRoomId]),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        };
        _this.handleKeyDowns = function (e) {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();_this.setState({ facing: 'l' });break;
                case "ArrowRight":
                    e.preventDefault();_this.setState({ facing: 'r' });break;
            }
        };

        _this.handleKeyUps = function (e) {
            if (_this.state.moving) {
                return;
            }
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();_this.moveDown();break;
                case "ArrowLeft":
                    e.preventDefault();_this.moveLeft();break;
                case "ArrowUp":
                    e.preventDefault();_this.moveUp();break;
                case "ArrowRight":
                    e.preventDefault();_this.moveRight();break;
            }
        };
        return _this;
    }

    _createClass(App, [{
        key: "registerKeys",
        value: function registerKeys() {
            document.addEventListener("keyup", this.handleKeyUps);
            document.addEventListener("keydown", this.handleKeyDowns);
        }
    }, {
        key: "componentWillMount",
        value: function componentWillMount() {
            this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y, rooms[currentRoomId]),
                entityTiles: getVisibleEntities(this.state.player.x, this.state.player.y, rooms[currentRoomId]) });
            this.registerKeys();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "app-container" },
                React.createElement(
                    "button",
                    { className: "control-btn", onClick: this.moveLeft },
                    "left"
                ),
                React.createElement(
                    "button",
                    { className: "control-btn", onClick: this.moveUp },
                    "Up"
                ),
                React.createElement(
                    "button",
                    { className: "control-btn", onClick: this.moveDown },
                    "Down"
                ),
                React.createElement(
                    "button",
                    { className: "control-btn", onClick: this.moveRight },
                    "Right"
                ),
                React.createElement(
                    "div",
                    { id: "tile-viewport" },
                    React.createElement("div", { className: "character-sprite" + (this.state.facing == 'l' ? ' facing-left' : ' facing-right') + (this.state.moving ? ' moving' : '') }),
                    React.createElement(TileGrid, { tiles: this.state.tiles }),
                    React.createElement(EntityGrid, { entities: this.state.entityTiles }),
                    React.createElement("div", { id: "lighting-gradient-horizontal" }),
                    React.createElement("div", { id: "lighting-gradient-vertical" })
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));