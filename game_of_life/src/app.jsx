class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: this.createCells(30,30)
        };
        this.onClick = this.onClick.bind(this);
    }

    updateCells() {
        let nextCells = [];
        for(let i = 0; i < this.state.cells.length; i++) {
            nextCells.push([]);
            for(let j = 0; j < this.state.cells[i].length; j++) {
                let neighbors = [];
                if(i > 0) {
                    if(j > 0) {
                        neighbors.push(this.state.cells[i-1][j-1]);
                    }
                    neighbors.push(this.state.cells[i-1][j]);
                    if(j < this.state.cells[i].length - 1) {
                        neighbors.push(this.state.cells[i-1][j+1]);
                    }
                }
                if(j > 0) {
                    neighbors.push(this.state.cells[i][j-1]);
                }
                if(j < this.state.cells[i].length - 1) {
                    neighbors.push(this.state.cells[i][j+1]);
                }
                if(i < this.state.cells.length - 1) {
                    if(j > 0) {
                        neighbors.push(this.state.cells[i+1][j-1]);
                    }
                    neighbors.push(this.state.cells[i+1][j]);
                    if(j < this.state.cells[i].length - 1) {
                        neighbors.push(this.state.cells[i+1][j+1]);
                    }
                }
                let neighbor_count = neighbors.reduce((acc, ele) => { return ele === 2 ? acc + 1 : acc }, 0);
                nextCells[i].push(neighbor_count);
            }
        }
        console.log(nextCells);
    }

    randomizeCells() {
        let nextCells = [];
        for(let i = 0; i < this.state.cells.length; i++) {
            nextCells.push([])
            for(let j = 0; j < this.state.cells[i].length; j++) {
                nextCells[i].push(Math.random() > 0.5 ? 1 : 2);
            }
        }
        this.setState({ cells: nextCells });
    }

    createCells(height, width) {
        let cells = [];
        for(let i = 0; i < height; i++) {
            cells.push([])
            for(let j = 0; j < width; j++) {
                cells[i].push(1);
            }
        }
        return cells;
    }

    // event handlers

    onClick(e) {
        this.updateCells();
    }

    // react lifecycle stuff

    componentDidMount() {
        this.randomizeCells();
    }

    render() {
        return(<h1 onClick={this.onClick}>App</h1>);
    }
}
ReactDOM.render(<App />, document.getElementById('root'));