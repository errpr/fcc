"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Cell(props) {
    return React.createElement("div", { onClick: props.cellClick,
        "data-index-i": props.index[0],
        "data-index-j": props.index[1],
        className: "cell cell" + (props.status === 2 ? "-alive" : "-dead") });
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
            cells: _this.createCells(30, 30)
        };
        _this.onClick = _this.onClick.bind(_this);
        _this.cellClick = _this.cellClick.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: "updateCells",
        value: function updateCells() {
            var nextCells = [];
            for (var i = 0; i < this.state.cells.length; i++) {
                nextCells.push([]);
                for (var j = 0; j < this.state.cells[i].length; j++) {
                    var neighbors = [];
                    if (i > 0) {
                        if (j > 0) {
                            neighbors.push(this.state.cells[i - 1][j - 1]);
                        }
                        neighbors.push(this.state.cells[i - 1][j]);
                        if (j < this.state.cells[i].length - 1) {
                            neighbors.push(this.state.cells[i - 1][j + 1]);
                        }
                    }
                    if (j > 0) {
                        neighbors.push(this.state.cells[i][j - 1]);
                    }
                    if (j < this.state.cells[i].length - 1) {
                        neighbors.push(this.state.cells[i][j + 1]);
                    }
                    if (i < this.state.cells.length - 1) {
                        if (j > 0) {
                            neighbors.push(this.state.cells[i + 1][j - 1]);
                        }
                        neighbors.push(this.state.cells[i + 1][j]);
                        if (j < this.state.cells[i].length - 1) {
                            neighbors.push(this.state.cells[i + 1][j + 1]);
                        }
                    }
                    var neighbor_count = neighbors.reduce(function (acc, ele) {
                        return ele === 2 ? acc + 1 : acc;
                    }, 0);

                    if (this.state.cells[i][j] === 1) {
                        // it's dead jim
                        if (neighbor_count === 3) {
                            // it's respawned jim
                            nextCells[i].push(2);
                        } else {
                            nextCells[i].push(1);
                        }
                    } else {
                        // it's alive
                        if (neighbor_count < 2) {
                            nextCells[i].push(1);
                        } else if (neighbor_count < 4) {
                            nextCells[i].push(2);
                        } else {
                            nextCells[i].push(1);
                        }
                    }
                }
            }
            this.setState({ cells: nextCells });
        }
    }, {
        key: "randomizeCells",
        value: function randomizeCells() {
            var nextCells = [];
            for (var i = 0; i < this.state.cells.length; i++) {
                nextCells.push([]);
                for (var j = 0; j < this.state.cells[i].length; j++) {
                    nextCells[i].push(Math.random() > 0.7 ? 2 : 1);
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

        // event handlers

    }, {
        key: "onClick",
        value: function onClick(e) {
            this.updateCells();
        }
    }, {
        key: "cellClick",
        value: function cellClick(e) {
            var i = e.target.getAttribute("data-index-i");
            var j = e.target.getAttribute("data-index-j");
            var newCells = this.state.cells.slice();
            newCells[i][j] = newCells[i][j] === 2 ? 1 : 2;
            this.setState({ cells: newCells });
        }

        // react lifecycle stuff

    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.randomizeCells();
        }
    }, {
        key: "render",
        value: function render() {

            return React.createElement(
                "div",
                { className: "app-container" },
                React.createElement(
                    "h1",
                    { onClick: this.onClick },
                    "App"
                ),
                React.createElement(CellGrid, { cells: this.state.cells,
                    cellClick: this.cellClick })
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));