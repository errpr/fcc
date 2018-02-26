"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAP_HEIGHT = 300;
var MAP_WIDTH = 300;
var map = generateMap();
var entityMap = generateEntityMap();
var TILE_VISIBILITY = 11;

var TRANSITION_SPEED = 250;

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
*/

/*
Walls ids
0 - no wall
1 - wall
2 - wall with door
*/

/*
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

/** @returns {number[][]}   */
function generateMap() {
    var m = Array(MAP_HEIGHT);
    for (var i = 0; i < MAP_HEIGHT; i++) {
        m[i] = Array(MAP_WIDTH);
        for (var j = 0; j < MAP_WIDTH; j++) {
            m[i][j] = floorTile();
        }
    }
    return m;
}

function generateEntityMap() {
    var m = Array(MAP_HEIGHT);
    for (var i = 0; i < MAP_HEIGHT; i++) {
        m[i] = Array(MAP_WIDTH);
        for (var j = 0; j < MAP_WIDTH; j++) {
            m[i][j] = Math.random() > 0.8 ? 1 : 0;
        }
    }
    return m;
}

function generateMapNew() {
    var rooms = [];
    var boss_spawned = false;
    var i = 0;
    while (!boss_spawned) {
        boss_spawned = Math.random() * 20 < i;
    }
}

function floorTile() {
    return Math.floor(Math.random() * 4);
}

/**
 * @param {number} height
 * @param {number} width
 * @param {Object} walls
 * @param {number} walls.left
 * @param {number} walls.right
 * @param {number} walls.up
 * @param {number} wall.down
 * @param {boolean} boss_room
 * @returns {number[][]}
 */
function generateRoom(height, width, walls, boss_room) {
    var m = Array(height);
    for (var i = 0; i < height; i++) {
        m[i] = Array(width);
        for (var j = 0; j < width; j++) {
            if (i == 0) {
                // top row
                if (j == 0) {
                    // top left corner
                    if (walls.left != 0 && walls.up != 0) {
                        m[i][j] = 7;continue; // wall corner
                    }
                    if (walls.left != 0) {
                        m[i][j] = 9;continue; // vertical wall
                    }
                    if (walls.up != 0) {
                        m[i][j] = 8;continue; // horizontal wall
                    }
                    m[i][j] = floorTile();continue;
                }

                if (j == width - 1) {
                    // top right corner
                    if (walls.right != 0 && walls.up != 0) {
                        m[i][j] = 7;continue; // wall corner
                    }
                    if (walls.right != 0) {
                        m[i][j] = 9;continue; // vertical wall
                    }
                    if (walls.up != 0) {
                        m[i][j] = 8;continue; // horizontal wall
                    }
                    m[i][j] = floorTile();continue;
                }

                if (walls.up != 0) {
                    if (j == Math.floor(width / 2) && walls.up == 2) {
                        m[i][j] = 4;continue; // door
                    }
                    m[i][j] = 8;continue; // horizontal wall
                }

                m[i][j] = floorTile();continue;
            } // end if top row

            if (i == height - 1) {
                // bottom row
                if (j == 0) {
                    // bottom left corner
                    if (walls.left != 0 && walls.down != 0) {
                        m[i][j] = 7;continue; // wall corner
                    }
                    if (walls.left != 0) {
                        m[i][j] = 9;continue; // vertical wall
                    }
                    if (walls.down != 0) {
                        m[i][j] = 8;continue; // horizontal wall
                    }

                    m[i][j] = floorTile();continue;
                }

                if (j == width - 1) {
                    // bottom right corner
                    if (walls.right != 0 && walls.down != 0) {
                        m[i][j] = 7;continue; //corner wall
                    }
                    if (walls.right != 0) {
                        m[i][j] = 9;continue; // vertical wall
                    }
                    if (walls.down != 0) {
                        m[i][j] = 8;continue; // horizontal wall
                    }

                    m[i][j] = floorTile();continue;
                }

                if (walls.down != 0) {
                    if (j == Math.floor(width / 2) && walls.down == 2) {
                        m[i][j] = 4;continue; // door
                    }
                    m[i][j] = 8;continue; // horizontal wall
                }
            } // end if bottom row

            if (j == 0) {
                //left edge
                if (walls.left != 0) {
                    if (i == Math.floor(height / 2) && walls.left == 2) {
                        m[i][j] = 4;continue; // door
                    }
                    m[i][j] = 9;continue; // vertical wall
                }
            }

            if (j == width - 1) {
                //right edge
                if (walls.right != 0) {
                    if (i == Math.floor(height / 2) && walls.right == 2) {
                        m[i][j] = 4;continue; // door
                    }
                }
            }

            m[i][j] = floorTile();continue;
        }
    }
    return m;
}

/** 
 * @param {number} x
 * @param {number} y
 * @returns {number[][]}
 */
function getVisibleTiles(x, y) {
    var x1 = Math.floor(x - TILE_VISIBILITY / 2);
    var x2 = Math.floor(x + TILE_VISIBILITY / 2);
    var y1 = Math.floor(y - TILE_VISIBILITY / 2);
    var y2 = Math.floor(y + TILE_VISIBILITY / 2);
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > MAP_HEIGHT - 1 || j > MAP_WIDTH - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(map[i][j]);
        }
    }

    return t;
}

function getVisibleEntities(x, y) {
    var x1 = Math.floor(x - TILE_VISIBILITY / 2);
    var x2 = Math.floor(x + TILE_VISIBILITY / 2);
    var y1 = Math.floor(y - TILE_VISIBILITY / 2);
    var y2 = Math.floor(y + TILE_VISIBILITY / 2);
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > MAP_HEIGHT - 1 || j > MAP_WIDTH - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(entityMap[i][j]);
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
                x: 150,
                y: 150
            }
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
                    tiles: getVisibleTiles(p.x - 1, p.y),
                    entityTiles: getVisibleEntities(p.x - 1, p.y),
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
                    tiles: getVisibleTiles(p.x + 1, p.y),
                    entityTiles: getVisibleEntities(p.x + 1, p.y),
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
                    tiles: getVisibleTiles(p.x, p.y - 1),
                    entityTiles: getVisibleEntities(p.x, p.y - 1),
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
                    tiles: getVisibleTiles(p.x, p.y + 1),
                    entityTiles: getVisibleEntities(p.x, p.y + 1),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        };

        _this.handleKeys = function (e) {
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
            // spamming move causes a small graphics glitch, so we listen for keyup instead of keydown
            document.addEventListener("keyup", this.handleKeys);
        }
    }, {
        key: "componentWillMount",
        value: function componentWillMount() {
            this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y) });
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
                    React.createElement("div", { className: "character-sprite" }),
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