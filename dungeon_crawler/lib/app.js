"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAP_HEIGHT = 300;
var MAP_WIDTH = 300;
var map = generateMap();

var TILE_VISIBILITY = 12;

var TRANSITION_SPEED = 250;

/** @returns {number[][]}   */
function generateMap() {
    var m = [];
    for (var i = 0; i < MAP_HEIGHT; i++) {
        m.push([]);
        for (var j = 0; j < MAP_WIDTH; j++) {
            m[i].push(Math.floor(Math.random() * 4));
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
    var x1 = x - TILE_VISIBILITY / 2;
    var x2 = x + TILE_VISIBILITY / 2;
    var y1 = y - TILE_VISIBILITY / 2;
    var y2 = y + TILE_VISIBILITY / 2;

    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            t[i - y1].push(map[i][j]);
        }
    }

    return t;
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
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x - 1, y: p.y },
                    tiles: getVisibleTiles(p.x - 1, p.y),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        };

        _this.moveRight = function () {
            if (_this.state.moving) {
                return;
            }
            _this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-left");
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x + 1, y: p.y },
                    tiles: getVisibleTiles(p.x + 1, p.y),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        };

        _this.moveUp = function () {
            if (_this.state.moving) {
                return;
            }
            _this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-down");
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x, y: p.y - 1 },
                    tiles: getVisibleTiles(p.x, p.y - 1),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        };

        _this.moveDown = function () {
            if (_this.state.moving) {
                return;
            }
            _this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-up");
            setTimeout(function () {
                var p = _this.state.player;
                _this.setState({
                    player: { x: p.x, y: p.y + 1 },
                    tiles: getVisibleTiles(p.x, p.y + 1),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        };
        return _this;
    }

    _createClass(App, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y) });
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
                    { className: "control-btn", onClick: this.moveRight },
                    "Right"
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
                    "div",
                    { id: "tile-viewport" },
                    React.createElement("div", { className: "character-sprite" }),
                    React.createElement(TileGrid, { tiles: this.state.tiles })
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));