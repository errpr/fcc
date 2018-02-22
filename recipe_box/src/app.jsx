function RecipeList(props) {
    let recipeItems = props.recipes.map((e, i) => <li className="recipe-item"
                                                      onClick={props.select}
                                                      data-index={i} 
                                                      key={i}>{e.name}</li>);
    return(
        <ul className="recipe-list">
            {recipeItems}
        </ul>
    );
}

class IngredientLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingAmount: false,
            editingItem: false,
            editingAmountValue: props.amount,
            editingItemValue: props.item
        }

        this.updateAmount = (amount) => {
            this.props.updateIngredient(amount, this.props.item);
        }

        this.updateItem = (item) => {
            this.props.updateIngredient(this.props.amount, item);
        }
        
        this.dblclickAmount = (e) => {
            this.setState({editingAmount: true});
        }

        this.dblclickItem = (e) => {
            this.setState({editingItem: true});
        }
        
        this.handleChange = (e) => {
            if(e.target.name === "edit-amount") {
                this.setState({ editingAmountValue: e.target.value });
            } else {
                this.setState({ editingItemValue: e.target.value });
            }
        }

        this.handleBlur = (e) => {
            if(e.target.name === "edit-amount") {
                this.updateAmount(this.state.editingAmountValue);
                this.setState({ editingAmount: false });
            } else {
                this.updateItem(this.state.editingItemValue);
                this.setState({ editingItem: false });
            }
        }
    }



    render() {
        return(
            <div className="recipe-ingredient">
                <div className={"ingredient-amount" + (!this.state.editingAmount ? " visible" : " invisible")} 
                     onDoubleClick={this.dblclickAmount}>
                     {this.props.amount}
                </div>
                <div className={"ingredient-amount" + (this.state.editingAmount ? " visible" : " invisible")}>
                    <input name="edit-amount" 
                            className="edit-amount"
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur} 
                            value={this.state.editingAmountValue} />
                </div>

                <div className={"ingredient-item" + (!this.state.editingItem ? " visible" : " invisible")}
                     onDoubleClick={this.dblclickItem}>
                     {this.props.item}
                </div>
                <div className={"ingredient-item" + (this.state.editingItem ? " visible" : " invisible")}>
                    <input name="edit-item" 
                           className="edit-item"  
                           onChange={this.handleChange} 
                           onBlur={this.handleBlur}
                           value={this.state.editingItemValue} />
                </div>
            </div>
        );
    }
}

class CurrentRecipe extends React.Component {
    constructor(props) {
        super(props);

        this.updateIngredient = (ingredientIndex) => {
            return function(amount, item) {
                let new_ingredient = this.props.recipe.ingredients;
                new_ingredient[ingredientIndex] = { amount, item }
                this.props.updateRecipe({
                    ...this.props.recipe,
                    ingredients: new_ingredient
                })
            }.bind(this);
        }
    }

    render() {
        let ingredients = this.props
                              .recipe
                              .ingredients
                              .map((e, i) => { 
                                  return(<IngredientLine key={i}
                                                         amount={e.amount}
                                                         item={e.item} 
                                                         updateIngredient={this.updateIngredient(i)} />); });
        return(
            <div className="recipe-card">
                <h3 className="recipe-name">
                    {this.props.recipe.name}
                </h3>
                <div>
                    {ingredients}
                    <div className="recipe-ingredient">
                        <div className="ingredient-amount"></div>
                        <div className="ingredient-item"></div>
                    </div>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [
                {
                    name: 'Steven\'s Red Beans & Rice',
                    ingredients: [
                        { amount: '2 cans',     item: 'red beans'},
                        { amount: '2 packages', item: 'Uncle Ben\'s 90 second white rice' },
                        { amount: '1 package',  item: 'smoked sausage' },
                        { amount: '3/4',        item: 'onion diced' },
                        { amount: '3/4',        item: 'bell pepper diced' },
                        { amount: '3 dashes',   item: 'Tony\'s Cajun Seasoning' }
                    ]
                },{
                    name: 'Steven\'s Mac n Cheese',
                    ingredients: [
                        { amount: '1 package',  item: 'macaroni pasta'},
                        { amount: '1 package',  item: 'cream cheese' },
                        { amount: '1/2 package',item: 'sharp cheddar' },
                        { amount: '1/2 package',item: 'mild cheddar' },
                        { amount: '2 tblsp',    item: 'salt' },
                        { amount: '1/8 gallon', item: 'milk' },
                    ]
                },
            ],
            selectedRecipe: 0
        }

        this.selectRecipeHandler = (e) => {
            this.setState({ selectedRecipe: e.target.getAttribute('data-index') });
        }

        this.updateRecipe = (recipeIndex) => {
            return function(recipeData) {
                this.setState(prevState => {
                    let new_recipes = prevState.recipes.slice();
                    new_recipes[recipeIndex] = recipeData;
                    return { ...prevState, recipes: new_recipes }
                });
            }.bind(this);
        }
    }

    

    render() {
        return(
            <div id="app-container">
                <RecipeList 
                    recipes={this.state.recipes} 
                    select={this.selectRecipeHandler} />
                <CurrentRecipe 
                    recipe={this.state.recipes[this.state.selectedRecipe]}
                    updateRecipe={this.updateRecipe(this.state.selectedRecipe)} />
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));