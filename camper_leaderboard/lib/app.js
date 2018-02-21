"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MINIMUM_FETCH_TIME = 1000000;

function TableRow(props) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            props.ranking
        ),
        React.createElement(
            "td",
            { className: "camper-name-cell" },
            React.createElement("img", { src: props.camper.img, className: "avatarpic" }),
            React.createElement(
                "a",
                { href: 'https://www.freecodecamp.com/' + props.camper.username },
                props.camper.username
            )
        ),
        React.createElement(
            "td",
            null,
            props.camper.recent
        ),
        React.createElement(
            "td",
            null,
            props.camper.alltime
        )
    );
}

function Table(props) {
    // let pred = function() { return 1 };
    // switch(props.sort) {
    //     case('all'): pred = function(a, b) { return (a.all_points < b.all_points) ? 1 : -1; } ; break;
    //     case('30'): pred = function(a, b) { return (a.month_points < b.month_points) ? 1 : -1; }; break;
    // }
    var tableRows = props.campers.map(function (e, i) {
        return React.createElement(TableRow, { key: i, ranking: i + 1, camper: e });
    });
    return React.createElement(
        "table",
        { className: "main-table" },
        React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    "Rank"
                ),
                React.createElement(
                    "th",
                    null,
                    "Name"
                ),
                React.createElement(
                    "th",
                    { className: props.sort == '30' ? 'selected' : 'selectable',
                        onClick: props.sort_30 },
                    "Last 30 Days"
                ),
                React.createElement(
                    "th",
                    { className: props.sort == 'all' ? 'selected' : 'selectable',
                        onClick: props.sort_all },
                    "All Time"
                )
            )
        ),
        React.createElement(
            "tbody",
            null,
            tableRows
        )
    );
}

function TopBar(props) {
    return React.createElement(
        "div",
        { id: "app-title" },
        React.createElement(
            "h1",
            { id: "app-title-text" },
            "freeCodeCamp Leaderboards"
        )
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            sort: 'all',
            last_fetch_time_all: 0,
            last_fetch_time_30: 0,
            campers_30: [{}],
            campers_all: [{
                username: "errpr",
                img: "https://avatars3.githubusercontent.com/u/22058959?v=1",
                alltime: 3,
                recent: 1,
                lastUpdate: "2018-02-20T19:58:50.041Z"
            }]
        };

        _this.fetch_top_all = function () {
            if (Date.now() - _this.state.last_fetch_time_all > MINIMUM_FETCH_TIME) {
                fetch('https://fcctop100.herokuapp.com/api/fccusers/top/alltime', { mode: 'cors', headers: { 'accept': 'application/json' } }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(function (json) {
                    return _this.setState({ campers_all: json, last_fetch_time_all: Date.now });
                });
            }
        };

        _this.fetch_top_30 = function () {
            if (Date.now() - _this.state.last_fetch_time_30 > MINIMUM_FETCH_TIME) {
                fetch('https://fcctop100.herokuapp.com/api/fccusers/top/recent', { mode: 'cors', headers: { 'accept': 'application/json' } }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(function (json) {
                    return _this.setState({ campers_30: json, last_fetch_time_30: Date.now });
                });
            }
        };

        _this.sort_all = function () {
            _this.fetch_top_all();
            _this.setState({ sort: 'all' });
        };

        _this.sort_30 = function () {
            _this.fetch_top_30();
            _this.setState({ sort: '30' });
        };
        return _this;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetch_top_all();
            this.fetch_top_30();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "app" },
                React.createElement(TopBar, null),
                React.createElement(Table, {
                    campers: this.state.sort == 'all' ? this.state.campers_all : this.state.campers_30,
                    sort_30: this.sort_30,
                    sort_all: this.sort_all,
                    sort: this.state.sort })
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));