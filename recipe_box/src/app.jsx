function RecipeList(props) {
    let recipeItems = props.recipes.map((e, i) => <li onClick={props.select}
                                                      data-index={i} 
                                                      key={i}>{e.name}</li>);
    return(
        <ul>
            {recipeItems}
        </ul>
    );
}

class CurrentRecipe extends React.Component {
    render() {
        return(
            <div>{JSON.stringify(this.props.recipe)})</div>
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
                }
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
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));