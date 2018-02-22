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

class CurrentRecipe extends React.Component {
    render() {
        let ingredients = this.props
                              .recipe
                              .ingredients
                              .map((e, i) => { 
                                  return(<div key={i} className="recipe-ingredient">
                                    <div className="ingredient-amount">{e.amount}</div>
                                    <div className="ingredient-item">{e.item}</div>
                                  </div>) } );
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