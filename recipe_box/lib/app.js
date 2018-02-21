'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function RecipeList(props) {
    var recipeItems = props.recipes.map(function (e, i) {
        return React.createElement(
            'li',
            { onClick: props.select,
                'data-index': i,
                key: i },
            e.name
        );
    });
    return React.createElement(
        'ul',
        null,
        recipeItems
    );
}

var CurrentRecipe = function (_React$Component) {
    _inherits(CurrentRecipe, _React$Component);

    function CurrentRecipe() {
        _classCallCheck(this, CurrentRecipe);

        return _possibleConstructorReturn(this, (CurrentRecipe.__proto__ || Object.getPrototypeOf(CurrentRecipe)).apply(this, arguments));
    }

    _createClass(CurrentRecipe, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                JSON.stringify(this.props.recipe),
                ')'
            );
        }
    }]);

    return CurrentRecipe;
}(React.Component);

var App = function (_React$Component2) {
    _inherits(App, _React$Component2);

    function App(props) {
        _classCallCheck(this, App);

        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this2.state = {
            recipes: [{
                name: 'Steven\'s Red Beans & Rice',
                ingredients: [{ amount: '2 cans', item: 'red beans' }, { amount: '2 packages', item: 'Uncle Ben\'s 90 second white rice' }, { amount: '1 package', item: 'smoked sausage' }, { amount: '3/4', item: 'onion diced' }, { amount: '3/4', item: 'bell pepper diced' }, { amount: '3 dashes', item: 'Tony\'s Cajun Seasoning' }]
            }],
            selectedRecipe: 0
        };

        _this2.selectRecipeHandler = function (e) {
            _this2.setState({ selectedRecipe: e.target.getAttribute('data-index') });
        };
        return _this2;
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'app-container' },
                React.createElement(RecipeList, {
                    recipes: this.state.recipes,
                    select: this.selectRecipeHandler }),
                React.createElement(CurrentRecipe, { recipe: this.state.recipes[this.state.selectedRecipe] }),
                React.createElement(
                    'pre',
                    null,
                    JSON.stringify(this.state, null, 2)
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));