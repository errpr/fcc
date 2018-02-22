//@ts-check
function RecipeList(props) {
    let recipeItems = props.recipes.map((e, i) => <li className="recipe-item"
                                                      onClick={props.select}
                                                      data-index={i} 
                                                      key={i}>{e.name}</li>);
    let emptyLine = <li className="recipe-item" onClick={props.addRecipe}></li>;
    for(let i = 0; i < 30 - recipeItems.length; i++){
        recipeItems.push(emptyLine);
    }
    return(
        <ul className="recipe-list" onClick={props.handleClick}>
            <li className="recipe-item"><h1>Recipes</h1></li>
            {recipeItems}
            {emptyLine}
        </ul>
    );
}

// @ts-ignore
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
            } else if(e.target.name === "edit-item" ) {
                this.setState({ editingItemValue: e.target.value });
            }
        }

        this.handleBlur = (e) => {
            if(e.target.name === "edit-amount") {
                this.updateAmount(this.state.editingAmountValue);
                this.setState({ editingAmount: false });
            } else if(e.target.name === "edit-item" ) {
                this.updateItem(this.state.editingItemValue);
                this.setState({ editingItem: false });
            }
        }
    }



    render() {
        return(
            <div className="recipe-ingredient">
                <div className={"ingredient-amount" + (!this.state.editingAmount ? "" : " invisible")} 
                     onDoubleClick={this.dblclickAmount}>
                     {this.props.amount}
                </div>
                <div className={"ingredient-amount" + (this.state.editingAmount ? "" : " invisible")}>
                    <input name="edit-amount" 
                           type="text"
                           className="edit-amount"
                           onChange={this.handleChange} 
                           onBlur={this.handleBlur} 
                           value={this.state.editingAmountValue} />
                </div>

                <div className={"ingredient-item" + (!this.state.editingItem ? "" : " invisible")}
                     onDoubleClick={this.dblclickItem}>
                     {this.props.item}
                </div>
                <div className={"ingredient-item" + (this.state.editingItem ? "" : " invisible")}>
                    <input name="edit-item"
                           type="text"
                           className="edit-item"  
                           onChange={this.handleChange} 
                           onBlur={this.handleBlur}
                           value={this.state.editingItemValue} />
                </div>
            </div>
        );
    }
}

// @ts-ignore
class CurrentRecipe extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nameValue: props.recipe.name,
            editingName: false
        }

        this.updateName = (newName) => {
            if(!newName) {
                this.setState({ nameValue: props.recipe.name });
                return;
            }
            this.props.updateRecipe({
                ...this.props.recipe,
                name: newName
            })
        }

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

        this.handleNameDblClick = (e) => {
            this.setState({ editingName: true });
        }

        this.handleNameChange = (e) => {
            this.setState({ nameValue: e.target.value });
        }

        this.handleNameBlur = (e) => {
            this.setState({ editingName: false });
            this.updateName(this.state.nameValue);
        }
    }

    render() {
        let ingredients = this.props
                              .recipe
                              .ingredients
                              .map((e, i) => { return(
                                <IngredientLine key={this.props.recipe.name + i}
                                                amount={e.amount}
                                                item={e.item} 
                                                updateIngredient={this.updateIngredient(i)} />
                              ); });
        return(
            <div className={"recipe-card" + (this.props.visible ? '' : ' invisible')}>
                <h3 className={"recipe-name" + (!this.state.editingName ? '' : ' invisible')}
                    onDoubleClick={this.handleNameDblClick}>
                    {this.props.recipe.name}
                </h3>
                <input  className={"recipe-name" + (this.state.editingName ? '' : ' invisible')}
                        type="text" 
                        onChange={this.handleNameChange}
                        onBlur={this.handleNameBlur} 
                        value={this.state.nameValue} />
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

// @ts-ignore
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
                        { amount: '3 dashes',   item: 'Tony\'s Cajun Seasoning' },
                        { amount: '1 tblsp',    item: 'chili pepper powdered'},
                        { amount: '1 tblsp',    item: 'cayenne pepper powdered'}
                    ]
                },{
                    name: 'Steven\'s Mac n Cheese',
                    ingredients: [
                        { amount: '1 package',  item: 'macaroni pasta'},
                        { amount: '1 package',  item: 'cream cheese' },
                        { amount: '1/2 package',item: 'sharp cheddar shredded' },
                        { amount: '1/2 package',item: 'mild cheddar shredded' },
                        { amount: '2 tblsp',    item: 'salt' },
                        { amount: '1/8 gallon', item: 'milk' },
                    ]
                },
            ],
            selectedRecipe: 0,
            cardVisible: false
        }

        this.selectRecipeHandler = (e) => {
            this.setState({ selectedRecipe: e.target.getAttribute('data-index'), cardVisible: true });
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

        this.handleRecipeListClick = (e) => {
            if(this.state.cardVisible) {
                this.setState({cardVisible: false});
            }
        }
    }

    

    render() {
        return(
            <div id="app-container">
                <RecipeList 
                    recipes={this.state.recipes} 
                    select={this.selectRecipeHandler}
                    handleClick={this.handleRecipeListClick} />
                <CurrentRecipe 
                    visible={this.state.cardVisible}
                    recipe={this.state.recipes[this.state.selectedRecipe]}
                    updateRecipe={this.updateRecipe(this.state.selectedRecipe)} />
            </div>
        );
    }
}
// @ts-ignore
ReactDOM.render(<App />, document.getElementById('root'));