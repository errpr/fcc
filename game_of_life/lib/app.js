"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TICK_DELAY = 250;

function Cell(props) {
    return React.createElement("div", { onClick: props.cellClick,
        "data-index-i": props.index[0],
        "data-index-j": props.index[1],
        className: "cell cell" + (props.status === 1 ? "-alive" : "-dead") });
}

function CellRow(props) {
    var cells = props.cells.map(function (e, j) {
        return React.createElement(Cell, { key: "" + props.i + j,
            index: [props.i, j],
            status: e,
            cellClick: props.cellClick });
    });
    return React.createElement(
        "div",
        { className: "cell-row" },
        cells
    );
}

function CellGrid(props) {
    var cellRows = props.cells.map(function (row, i) {
        return React.createElement(CellRow, {
            cellClick: props.cellClick,
            key: i,
            i: i,
            cells: row });
    });
    return React.createElement(
        "div",
        { className: "cell-grid" },
        cellRows
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            cells: _this.createCells(30, 30),
            running: false,
            runInterval: undefined,
            generationCount: 0
        };
        _this.nextCells = _this.state.cells.slice();

        // ES6 ladies and gentlemen
        _this.updateCells = _this.updateCells.bind(_this);
        _this.runClick = _this.runClick.bind(_this);
        _this.stepClick = _this.stepClick.bind(_this);
        _this.cellClick = _this.cellClick.bind(_this);
        _this.beginRunning = _this.beginRunning.bind(_this);
        _this.endRunning = _this.endRunning.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: "updateCells",
        value: function updateCells() {
            for (var i = 0; i < this.state.cells.length; i++) {
                for (var j = 0; j < this.state.cells[i].length; j++) {
                    var neighbors_count = 0;
                    if (i > 0) {
                        if (j > 0) {
                            neighbors_count += this.state.cells[i - 1][j - 1];
                        }
                        neighbors_count += this.state.cells[i - 1][j];
                        if (j < this.state.cells[i].length - 1) {
                            neighbors_count += this.state.cells[i - 1][j + 1];
                        }
                    }
                    if (j > 0) {
                        neighbors_count += this.state.cells[i][j - 1];
                    }
                    if (j < this.state.cells[i].length - 1) {
                        neighbors_count += this.state.cells[i][j + 1];
                    }
                    if (i < this.state.cells.length - 1) {
                        if (j > 0) {
                            neighbors_count += this.state.cells[i + 1][j - 1];
                        }
                        neighbors_count += this.state.cells[i + 1][j];
                        if (j < this.state.cells[i].length - 1) {
                            neighbors_count += this.state.cells[i + 1][j + 1];
                        }
                    }

                    if (this.state.cells[i][j] === 0) {
                        // it's dead jim
                        if (neighbors_count === 3) {
                            // it's respawned jim
                            this.nextCells[i][j] = 1;
                        } else {
                            this.nextCells[i][j] = 0;
                        }
                    } else {
                        // it's alive
                        if (neighbors_count < 2) {
                            this.nextCells[i][j] = 0;
                        } else if (neighbors_count < 4) {
                            this.nextCells[i][j] = 1;
                        } else {
                            this.nextCells[i][j] = 0;
                        }
                    }
                }
            }
            this.setState({ cells: this.nextCells, generationCount: this.state.generationCount + 1 });
        }
    }, {
        key: "randomizeCells",
        value: function randomizeCells() {
            var nextCells = [];
            for (var i = 0; i < this.state.cells.length; i++) {
                nextCells.push([]);
                for (var j = 0; j < this.state.cells[i].length; j++) {
                    nextCells[i].push(Math.random() > 0.7 ? 1 : 0);
                }
            }
            this.setState({ cells: nextCells });
        }
    }, {
        key: "createCells",
        value: function createCells(height, width) {
            var cells = [];
            for (var i = 0; i < height; i++) {
                cells.push([]);
                for (var j = 0; j < width; j++) {
                    cells[i].push(1);
                }
            }
            return cells;
        }
    }, {
        key: "beginRunning",
        value: function beginRunning() {
            this.updateCells();
            var runInterval = setInterval(this.updateCells, TICK_DELAY);
            this.setState({ runInterval: runInterval });
        }
    }, {
        key: "endRunning",
        value: function endRunning() {
            clearInterval(this.state.runInterval);
        }

        // event handlers

    }, {
        key: "stepClick",
        value: function stepClick(e) {
            this.updateCells();
        }
    }, {
        key: "cellClick",
        value: function cellClick(e) {
            var i = e.target.getAttribute("data-index-i");
            var j = e.target.getAttribute("data-index-j");
            var newCells = this.state.cells.slice();
            newCells[i][j] = newCells[i][j] === 1 ? 0 : 1;
            this.setState({ cells: newCells, running: false });
        }
    }, {
        key: "runClick",
        value: function runClick(e) {
            this.setState({ running: !this.state.running });
        }

        // lifecycle stuff

    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.randomizeCells();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            if (!prevState.running && this.state.running) {
                this.beginRunning();
            }
            if (prevState.running && !this.state.running) {
                this.endRunning();
            }
        }
    }, {
        key: "render",
        value: function render() {

            return React.createElement(
                "div",
                { className: "app-container" },
                React.createElement(
                    "h1",
                    null,
                    "Conway Twitty's Game-o-Life"
                ),
                React.createElement(CellGrid, { cells: this.state.cells,
                    cellClick: this.cellClick }),
                React.createElement(
                    "button",
                    { onClick: this.stepClick },
                    "Step"
                ),
                React.createElement(
                    "button",
                    { onClick: this.runClick },
                    this.state.running ? "Pause" : "Run"
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));