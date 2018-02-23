"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//@ts-check

var MIN_RECIPE_LINES = 14;
var MIN_CARD_LINES = 6;

function RecipeList(props) {
    var recipeItems = props.recipes.map(function (e, i) {
        return React.createElement(
            "li",
            { className: "recipe-item", key: i },
            React.createElement(
                "span",
                { onClick: props.select, "data-index": i },
                e.name
            ),
            React.createElement(
                "button",
                { className: "delete-recipe-button",
                    "data-index": i,
                    onClick: props.deleteRecipe },
                "X"
            )
        );
    });

    var emptyLine = function emptyLine(i) {
        return React.createElement("li", { key: i, className: "recipe-item", onDoubleClick: props.addRecipe });
    };

    var j = recipeItems.length;
    for (var i = 0; i < MIN_RECIPE_LINES - j; i++) {
        recipeItems.push(emptyLine("blank" + i));
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
        emptyLine("blank-last")
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

        _this.focusItem = function () {
            _this.setState({ editingItem: true, editingAmount: false });
            setTimeout(function () {
                _this.editItem.focus();
            }, 100);
        };

        _this.focusAmount = function () {
            _this.setState({ editingItem: false, editingAmount: true });
            setTimeout(function () {
                _this.editAmount.focus();
            }, 100);
        };

        _this.updateAmount = function (amount) {
            _this.props.updateIngredient(amount, _this.props.item);
        };

        _this.updateItem = function (item) {
            _this.props.updateIngredient(_this.props.amount, item);
        };

        _this.dblclickAmount = function (e) {
            e.preventDefault();
            _this.focusAmount();
        };

        _this.dblclickItem = function (e) {
            e.preventDefault();
            _this.focusItem();
        };

        _this.handleChange = function (e) {
            if (e.target.name === "edit-amount") {
                _this.setState({ editingAmountValue: e.target.value });
            } else if (e.target.name === "edit-item") {
                _this.setState({ editingItemValue: e.target.value });
            }
        };

        _this.handleAmountKeyDown = function (e) {
            switch (e.key) {
                case "Backspace":
                    {
                        if (e.target.value === "") {
                            if (_this.state.editingItemValue === "") {
                                e.preventDefault();
                                _this.setState({ editingAmount: false, editingItem: false });
                                e.target.blur();
                            }
                        }
                    }break;
                case "Tab":
                    {
                        e.preventDefault();
                        e.target.blur();
                        _this.focusItem();
                    }break;
                case "Enter":
                    {
                        e.target.blur();
                        _this.focusItem();
                    }break;
            }
        };

        _this.handleItemKeyDown = function (e) {
            switch (e.key) {
                case "Backspace":
                    {
                        if (_this.state.editingItemValue === "") {
                            e.preventDefault();
                            _this.focusAmount();
                        }
                    }break;
                case "Enter":
                    {
                        e.target.blur();
                    }break;
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
            var _this2 = this;

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
                        ref: function ref(input) {
                            _this2.editAmount = input;
                        },
                        type: "text",
                        className: "edit-amount",
                        onChange: this.handleChange,
                        onBlur: this.handleBlur,
                        onKeyDown: this.handleAmountKeyDown,
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
                        ref: function ref(input) {
                            _this2.editItem = input;
                        },
                        type: "text",
                        className: "edit-item",
                        onChange: this.handleChange,
                        onBlur: this.handleBlur,
                        onKeyDown: this.handleItemKeyDown,
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

        var _this3 = _possibleConstructorReturn(this, (CurrentRecipe.__proto__ || Object.getPrototypeOf(CurrentRecipe)).call(this, props));

        _this3.state = {
            nameValue: props.recipe.name,
            editingName: false
        };

        _this3.updateName = function (newName) {
            _this3.props.updateRecipe(_this3.props.recipeIndex, _extends({}, _this3.props.recipe, {
                name: newName
            }));
        };

        _this3.updateIngredient = function (ingredientIndex) {
            return function (amount, item) {
                var new_ingredients = this.props.recipe.ingredients;

                if (ingredientIndex > new_ingredients.length) {
                    ingredientIndex = new_ingredients.length;
                };
                if (amount === "" && item === "") {
                    new_ingredients.splice(ingredientIndex, 1);
                } else {
                    new_ingredients[ingredientIndex] = { amount: amount, item: item };
                }

                this.props.updateRecipe(this.props.recipeIndex, _extends({}, this.props.recipe, {
                    ingredients: new_ingredients
                }));
                this.forceUpdate();
            }.bind(_this3);
        };

        _this3.handleNameKeyDown = function (e) {
            if (e.key == "Enter") {
                e.target.blur();
            }
        };

        _this3.handleNameDblClick = function (e) {
            e.preventDefault();
            _this3.setState({ editingName: true });
        };

        _this3.handleNameChange = function (e) {
            _this3.setState({ nameValue: e.target.value });
        };

        _this3.handleNameBlur = function (e) {
            _this3.setState({ editingName: false });
            _this3.updateName(_this3.state.nameValue);
        };
        return _this3;
    }

    _createClass(CurrentRecipe, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            if (prevProps.recipe != this.props.recipe) {
                this.setState({ nameValue: this.props.recipe.name });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var ingredientLine = function ingredientLine(e, i) {
                return React.createElement(IngredientLine, {
                    key: _this4.props.recipe.name + i,
                    blank: false,
                    amount: e.amount,
                    item: e.item,
                    updateIngredient: _this4.updateIngredient(i) });
            };
            var ingredients = this.props.recipe.ingredients.map(ingredientLine);

            var blankLine = function blankLine(i) {
                return React.createElement(IngredientLine, {
                    key: _this4.props.recipe.name + i,
                    blank: true,
                    amount: '',
                    item: '',
                    updateIngredient: _this4.updateIngredient(i) });
            };

            var j = ingredients.length;

            for (var i = 0; i < MIN_CARD_LINES - j; i++) {
                ingredients.push(blankLine(ingredients.length));
            }
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
                    ref: function ref(input) {
                        _this4.editName = input;
                    },
                    onChange: this.handleNameChange,
                    onBlur: this.handleNameBlur,
                    onKeyDown: this.handleNameKeyDown,
                    value: this.state.nameValue }),
                React.createElement(
                    "div",
                    null,
                    ingredients,
                    blankLine(ingredients.length)
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

        var _this5 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this5.state = {
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

        _this5.selectRecipeHandler = function (e) {
            _this5.setState({ selectedRecipe: e.target.getAttribute('data-index'), cardVisible: true });
        };

        _this5.updateRecipe = function (recipeIndex, recipeData) {
            _this5.setState(function (prevState) {
                var new_recipes = prevState.recipes.slice();
                new_recipes[recipeIndex] = recipeData;
                if (recipeData.name === "") {
                    new_recipes[recipeIndex].name = "Recipe " + (1 + Number(recipeIndex));
                }
                return _extends({}, prevState, { recipes: new_recipes });
            });
        };

        _this5.handleRecipeListClick = function (e) {
            if (_this5.state.cardVisible) {
                _this5.setState({ cardVisible: false });
            }
        };

        _this5.addRecipe = function (e) {
            _this5.setState(function (prevState) {
                return _extends({}, prevState, {
                    recipes: [].concat(_toConsumableArray(prevState.recipes), [{ name: String.fromCharCode(0x200b) + 'Recipe ' + (prevState.recipes.length + 1), ingredients: [] }]),
                    selectedRecipe: prevState.recipes.length,
                    cardVisible: true
                });
            });
        };

        _this5.deleteRecipe = function (e) {
            var i = e.target.getAttribute("data-index");
            _this5.setState(function (prevState) {
                var newRecipes = prevState.recipes.slice();
                newRecipes.splice(i, 1);
                if (newRecipes.length < 1) {
                    newRecipes = [{ name: String.fromCharCode(0x200b) + "Recipe 1", ingredients: [] }];
                }
                return _extends({}, prevState, {
                    recipes: newRecipes,
                    selectedRecipe: 0
                });
            });
        };
        return _this5;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var localRecipes = JSON.parse(localStorage.getItem("errpr-recipes"));
            if (localRecipes) {
                this.setState({ recipes: localRecipes });
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            if (prevState.recipes != this.state.recipes) {
                localStorage.setItem("errpr-recipes", JSON.stringify(this.state.recipes));
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "app-container" },
                React.createElement(RecipeList, {
                    recipes: this.state.recipes,
                    select: this.selectRecipeHandler,
                    handleClick: this.handleRecipeListClick,
                    addRecipe: this.addRecipe,
                    deleteRecipe: this.deleteRecipe }),
                React.createElement(CurrentRecipe, {
                    visible: this.state.cardVisible,
                    recipe: this.state.recipes[this.state.selectedRecipe],
                    recipeIndex: this.state.selectedRecipe,
                    updateRecipe: this.updateRecipe })
            );
        }
    }]);

    return App;
}(React.Component);
// @ts-ignore


ReactDOM.render(React.createElement(App, null), document.getElementById('root'));