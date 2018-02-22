"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//@ts-check
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
    var emptyLine = React.createElement("li", { className: "recipe-item", onClick: props.addRecipe });
    for (var i = 0; i < 30 - recipeItems.length; i++) {
        recipeItems.push(emptyLine);
    }
    return React.createElement(
        "ul",
        { className: "recipe-list", onClick: props.handleClick },
        React.createElement(
            "li",
            { className: "recipe-item" },
            React.createElement(
                "h1",
                null,
                "Recipes"
            )
        ),
        recipeItems,
        emptyLine
    );
}

// @ts-ignore

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

        _this.updateAmount = function (amount) {
            _this.props.updateIngredient(amount, _this.props.item);
        };

        _this.updateItem = function (item) {
            _this.props.updateIngredient(_this.props.amount, item);
        };

        _this.dblclickAmount = function (e) {
            _this.setState({ editingAmount: true });
        };

        _this.dblclickItem = function (e) {
            _this.setState({ editingItem: true });
        };

        _this.handleChange = function (e) {
            if (e.target.name === "edit-amount") {
                _this.setState({ editingAmountValue: e.target.value });
            } else if (e.target.name === "edit-item") {
                _this.setState({ editingItemValue: e.target.value });
            }
        };

        _this.handleBlur = function (e) {
            if (e.target.name === "edit-amount") {
                _this.updateAmount(_this.state.editingAmountValue);
                _this.setState({ editingAmount: false });
            } else if (e.target.name === "edit-item") {
                _this.updateItem(_this.state.editingItemValue);
                _this.setState({ editingItem: false });
            }
        };
        return _this;
    }

    _createClass(IngredientLine, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "recipe-ingredient" },
                React.createElement(
                    "div",
                    { className: "ingredient-amount" + (!this.state.editingAmount ? "" : " invisible"),
                        onDoubleClick: this.dblclickAmount },
                    this.props.amount
                ),
                React.createElement(
                    "div",
                    { className: "ingredient-amount" + (this.state.editingAmount ? "" : " invisible") },
                    React.createElement("input", { name: "edit-amount",
                        type: "text",
                        className: "edit-amount",
                        onChange: this.handleChange,
                        onBlur: this.handleBlur,
                        value: this.state.editingAmountValue })
                ),
                React.createElement(
                    "div",
                    { className: "ingredient-item" + (!this.state.editingItem ? "" : " invisible"),
                        onDoubleClick: this.dblclickItem },
                    this.props.item
                ),
                React.createElement(
                    "div",
                    { className: "ingredient-item" + (this.state.editingItem ? "" : " invisible") },
                    React.createElement("input", { name: "edit-item",
                        type: "text",
                        className: "edit-item",
                        onChange: this.handleChange,
                        onBlur: this.handleBlur,
                        value: this.state.editingItemValue })
                )
            );
        }
    }]);

    return IngredientLine;
}(React.Component);

// @ts-ignore


var CurrentRecipe = function (_React$Component2) {
    _inherits(CurrentRecipe, _React$Component2);

    function CurrentRecipe(props) {
        _classCallCheck(this, CurrentRecipe);

        var _this2 = _possibleConstructorReturn(this, (CurrentRecipe.__proto__ || Object.getPrototypeOf(CurrentRecipe)).call(this, props));

        _this2.state = {
            nameValue: props.recipe.name,
            editingName: false
        };

        _this2.updateName = function (newName) {
            if (!newName) {
                _this2.setState({ nameValue: props.recipe.name });
                return;
            }
            _this2.props.updateRecipe(_extends({}, _this2.props.recipe, {
                name: newName
            }));
        };

        _this2.updateIngredient = function (ingredientIndex) {
            return function (amount, item) {
                var new_ingredient = this.props.recipe.ingredients;
                new_ingredient[ingredientIndex] = { amount: amount, item: item };
                this.props.updateRecipe(_extends({}, this.props.recipe, {
                    ingredients: new_ingredient
                }));
            }.bind(_this2);
        };

        _this2.handleNameDblClick = function (e) {
            _this2.setState({ editingName: true });
        };

        _this2.handleNameChange = function (e) {
            _this2.setState({ nameValue: e.target.value });
        };

        _this2.handleNameBlur = function (e) {
            _this2.setState({ editingName: false });
            _this2.updateName(_this2.state.nameValue);
        };
        return _this2;
    }

    _createClass(CurrentRecipe, [{
        key: "render",
        value: function render() {
            var _this3 = this;

            var ingredients = this.props.recipe.ingredients.map(function (e, i) {
                return React.createElement(IngredientLine, { key: _this3.props.recipe.name + i,
                    amount: e.amount,
                    item: e.item,
                    updateIngredient: _this3.updateIngredient(i) });
            });
            return React.createElement(
                "div",
                { className: "recipe-card" + (this.props.visible ? '' : ' invisible') },
                React.createElement(
                    "h3",
                    { className: "recipe-name" + (!this.state.editingName ? '' : ' invisible'),
                        onDoubleClick: this.handleNameDblClick },
                    this.props.recipe.name
                ),
                React.createElement("input", { className: "recipe-name" + (this.state.editingName ? '' : ' invisible'),
                    type: "text",
                    onChange: this.handleNameChange,
                    onBlur: this.handleNameBlur,
                    value: this.state.nameValue }),
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

// @ts-ignore


var App = function (_React$Component3) {
    _inherits(App, _React$Component3);

    function App(props) {
        _classCallCheck(this, App);

        var _this4 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this4.state = {
            recipes: [{
                name: 'Steven\'s Red Beans & Rice',
                ingredients: [{ amount: '2 cans', item: 'red beans' }, { amount: '2 packages', item: 'Uncle Ben\'s 90 second white rice' }, { amount: '1 package', item: 'smoked sausage' }, { amount: '3/4', item: 'onion diced' }, { amount: '3/4', item: 'bell pepper diced' }, { amount: '3 dashes', item: 'Tony\'s Cajun Seasoning' }, { amount: '1 tblsp', item: 'chili pepper powdered' }, { amount: '1 tblsp', item: 'cayenne pepper powdered' }]
            }, {
                name: 'Steven\'s Mac n Cheese',
                ingredients: [{ amount: '1 package', item: 'macaroni pasta' }, { amount: '1 package', item: 'cream cheese' }, { amount: '1/2 package', item: 'sharp cheddar shredded' }, { amount: '1/2 package', item: 'mild cheddar shredded' }, { amount: '2 tblsp', item: 'salt' }, { amount: '1/8 gallon', item: 'milk' }]
            }],
            selectedRecipe: 0,
            cardVisible: false
        };

        _this4.selectRecipeHandler = function (e) {
            _this4.setState({ selectedRecipe: e.target.getAttribute('data-index'), cardVisible: true });
        };

        _this4.updateRecipe = function (recipeIndex) {
            return function (recipeData) {
                this.setState(function (prevState) {
                    var new_recipes = prevState.recipes.slice();
                    new_recipes[recipeIndex] = recipeData;
                    return _extends({}, prevState, { recipes: new_recipes });
                });
            }.bind(_this4);
        };

        _this4.handleRecipeListClick = function (e) {
            if (_this4.state.cardVisible) {
                _this4.setState({ cardVisible: false });
            }
        };
        return _this4;
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "app-container" },
                React.createElement(RecipeList, {
                    recipes: this.state.recipes,
                    select: this.selectRecipeHandler,
                    handleClick: this.handleRecipeListClick }),
                React.createElement(CurrentRecipe, {
                    visible: this.state.cardVisible,
                    recipe: this.state.recipes[this.state.selectedRecipe],
                    updateRecipe: this.updateRecipe(this.state.selectedRecipe) })
            );
        }
    }]);

    return App;
}(React.Component);
// @ts-ignore


ReactDOM.render(React.createElement(App, null), document.getElementById('root'));