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
        
        this.dblclickAmount = (e) => {
            this.setState({editingAmount: true});
        }

        this.dblclickItem = (e) => {
            this.setState({editingItem: true});
        }
    
    }



    render() {

        let amountSection = <div className="ingredient-amount" 
                                 onDoubleClick={this.dblclickAmount}>{this.props.amount}</div>;
        if(this.state.editingAmount){
            amountSection = <div className="ingredient-amount">
                                <input name="edit-amount" 
                                       className="edit-amount" 
                                       onChange={this.handleChange} 
                                       onBlur={this.handleBlur} 
                                       value={this.state.editingAmountValue} />
                            </div>;
        }
        
        let itemSection = <div className="ingredient-item" 
                                 onDoubleClick={this.dblclickItem}>{this.props.item}</div>;
        if(this.state.editingItem){
            itemSection = <div className="ingredient-item">
                                <input name="edit-item" 
                                       className="edit-item" 
                                       onChange={this.handleChange} 
                                       onBlur={this.handleBlur}
                                       value={this.state.editingItemValue} />
                            </div>;
        }

        return(
            <div className="recipe-ingredient">
                {amountSection}
                {itemSection}
            </div>
        );
    }
}

class CurrentRecipe extends React.Component {
    render() {
        let ingredients = this.props
                              .recipe
                              .ingredients
                              .map((e, i) => { 
                                  return(<IngredientLine key={i}
                                                         amount={e.amount}
                                                         item={e.item} />); });
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
    }

    render() {
        return(
            <div id="app-container">
                <RecipeList 
                    recipes={this.state.recipes} 
                    select={this.selectRecipeHandler} />
                <CurrentRecipe recipe={this.state.recipes[this.state.selectedRecipe]} />
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));