"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function RecipeList(props) {
    var recipeItems = props.recipes.map(function (e, i) {
        return React.createElement(
            "li",
            { className: "recipe-item",
                onClick: props.select,
                "data-index": i,
                key: i },
            e.name
        );
    });
    return React.createElement(
        "ul",
        { className: "recipe-list" },
        recipeItems
    );
}

var IngredientLine = function (_React$Component) {
    _inherits(IngredientLine, _React$Component);

    function IngredientLine(props) {
        _classCallCheck(this, IngredientLine);

        var _this = _possibleConstructorReturn(this, (IngredientLine.__proto__ || Object.getPrototypeOf(IngredientLine)).call(this, props));

        _this.state = {
            editingAmount: false,
            editingItem: false,
            editingAmountValue: props.amount,
            editingItemValue: props.item
        };

        _this.dblclickAmount = function (e) {
            _this.setState({ editingAmount: true });
        };

        _this.dblclickItem = function (e) {
            _this.setState({ editingItem: true });
        };

        return _this;
    }

    _createClass(IngredientLine, [{
        key: "render",
        value: function render() {

            var amountSection = React.createElement(
                "div",
                { className: "ingredient-amount",
                    onDoubleClick: this.dblclickAmount },
                this.props.amount
            );
            if (this.state.editingAmount) {
                amountSection = React.createElement(
                    "div",
                    { className: "ingredient-amount" },
                    React.createElement("input", { name: "edit-amount",
                        className: "edit-amount",
                        onChange: this.handleChange,
                        onBlur: this.handleBlur,
                        value: this.state.editingAmountValue })
                );
            }

            var itemSection = React.createElement(
                "div",
                { className: "ingredient-item",
                    onDoubleClick: this.dblclickItem },
                this.props.item
            );
            if (this.state.editingItem) {
                itemSection = React.createElement(
                    "div",
                    { className: "ingredient-item" },
                    React.createElement("input", { name: "edit-item",
                        className: "edit-item",
                        onChange: this.handleChange,
                        onBlur: this.handleBlur,
                        value: this.state.editingItemValue })
                );
            }

            return React.createElement(
                "div",
                { className: "recipe-ingredient" },
                amountSection,
                itemSection
            );
        }
    }]);

    return IngredientLine;
}(React.Component);

var CurrentRecipe = function (_React$Component2) {
    _inherits(CurrentRecipe, _React$Component2);

    function CurrentRecipe() {
        _classCallCheck(this, CurrentRecipe);

        return _possibleConstructorReturn(this, (CurrentRecipe.__proto__ || Object.getPrototypeOf(CurrentRecipe)).apply(this, arguments));
    }

    _createClass(CurrentRecipe, [{
        key: "render",
        value: function render() {
            var ingredients = this.props.recipe.ingredients.map(function (e, i) {
                return React.createElement(IngredientLine, { key: i,
                    amount: e.amount,
                    item: e.item });
            });
            return React.createElement(
                "div",
                { className: "recipe-card" },
                React.createElement(
                    "h3",
                    { className: "recipe-name" },
                    this.props.recipe.name
                ),
                React.createElement(
                    "div",
                    null,
                    ingredients,
                    React.createElement(
                        "div",
                        { className: "recipe-ingredient" },
                        React.createElement("div", { className: "ingredient-amount" }),
                        React.createElement("div", { className: "ingredient-item" })
                    )
                )
            );
        }
    }]);

    return CurrentRecipe;
}(React.Component);

var App = function (_React$Component3) {
    _inherits(App, _React$Component3);

    function App(props) {
        _classCallCheck(this, App);

        var _this3 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this3.state = {
            recipes: [{
                name: 'Steven\'s Red Beans & Rice',
                ingredients: [{ amount: '2 cans', item: 'red beans' }, { amount: '2 packages', item: 'Uncle Ben\'s 90 second white rice' }, { amount: '1 package', item: 'smoked sausage' }, { amount: '3/4', item: 'onion diced' }, { amount: '3/4', item: 'bell pepper diced' }, { amount: '3 dashes', item: 'Tony\'s Cajun Seasoning' }]
            }, {
                name: 'Steven\'s Mac n Cheese',
                ingredients: [{ amount: '1 package', item: 'macaroni pasta' }, { amount: '1 package', item: 'cream cheese' }, { amount: '1/2 package', item: 'sharp cheddar' }, { amount: '1/2 package', item: 'mild cheddar' }, { amount: '2 tblsp', item: 'salt' }, { amount: '1/8 gallon', item: 'milk' }]
            }],
            selectedRecipe: 0
        };

        _this3.selectRecipeHandler = function (e) {
            _this3.setState({ selectedRecipe: e.target.getAttribute('data-index') });
        };
        return _this3;
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "app-container" },
                React.createElement(RecipeList, {
                    recipes: this.state.recipes,
                    select: this.selectRecipeHandler }),
                React.createElement(CurrentRecipe, { recipe: this.state.recipes[this.state.selectedRecipe] })
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));