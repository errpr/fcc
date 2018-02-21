'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function TableRow(props) {
    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            props.ranking
        ),
        React.createElement(
            'td',
            null,
            props.camper.name
        ),
        React.createElement(
            'td',
            null,
            props.camper.month_points
        ),
        React.createElement(
            'td',
            null,
            props.camper.all_points
        )
    );
}

function Table(props) {
    var pred = function pred() {
        return 1;
    };
    switch (props.sort) {
        case 'all':
            pred = function pred(a, b) {
                return a.all_points < b.all_points ? 1 : -1;
            };break;
        case '30':
            pred = function pred(a, b) {
                return a.month_points < b.month_points ? 1 : -1;
            };break;
    }
    var tableRows = props.campers.sort(pred).map(function (e, i) {
        return React.createElement(TableRow, { key: e.id, ranking: i + 1, camper: e });
    });
    return React.createElement(
        'table',
        null,
        React.createElement(
            'thead',
            null,
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    null,
                    'Rank'
                ),
                React.createElement(
                    'th',
                    null,
                    'Name'
                ),
                React.createElement(
                    'th',
                    { className: props.sort == '30' ? 'selected' : 'selectable',
                        onClick: props.sort_30 },
                    'Last 30 Days'
                ),
                React.createElement(
                    'th',
                    { className: props.sort == 'all' ? 'selected' : 'selectable',
                        onClick: props.sort_all },
                    'All Time'
                )
            )
        ),
        React.createElement(
            'tbody',
            null,
            tableRows
        )
    );
}

function TopBar(props) {
    return React.createElement(
        'h1',
        null,
        'Top Bar'
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            campers: [{
                id: 0,
                name: 'Steven B',
                month_points: 1,
                all_points: 3
            }, {
                id: 1,
                name: 'Kitty H',
                month_points: 2,
                all_points: 2
            }],
            sort: 'all'
        };

        _this.sort_all = function () {
            _this.setState({ sort: 'all' });
        };
        _this.sort_30 = function () {
            _this.setState({ sort: '30' });
        };
        return _this;
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'app' },
                React.createElement(TopBar, null),
                React.createElement(Table, {
                    campers: this.state.campers,
                    sort_30: this.sort_30,
                    sort_all: this.sort_all,
                    sort: this.state.sort })
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));