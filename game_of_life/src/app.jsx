function Cell(props) {
    return(
        <div onClick={props.cellClick}
             data-index-i={props.index[0]}
             data-index-j={props.index[1]}
             className={"cell cell" + (props.status === 2 ? "-alive" : "-dead" )}>
        </div>);
}

function CellRow(props) {
    let cells = props.cells.map((e, j) => { 
        return <Cell key={`${props.i}${j}`} 
                     index={[props.i, j]} 
                     status={e} 
                     cellClick={props.cellClick} /> 
    });
    return(
        <div className="cell-row">
            {cells}
        </div>
    );
}

function CellGrid(props) {
    let cellRows = props.cells.map((row, i) => {
        return <CellRow 
                    cellClick={props.cellClick}
                    key={i} 
                    i={i} 
                    cells={row} />
    });
    return(
        <div className="cell-grid">
            {cellRows}
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: this.createCells(30,30)
        };
        this.onClick = this.onClick.bind(this);
        this.cellClick = this.cellClick.bind(this);
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

                if(this.state.cells[i][j] === 1) {
                    // it's dead jim
                    if(neighbor_count === 3) {
                        // it's respawned jim
                        nextCells[i].push(2);
                    } else {
                        nextCells[i].push(1);
                    }
                } else {
                    // it's alive
                    if(neighbor_count < 2) {
                        nextCells[i].push(1);
                    } else if(neighbor_count < 4) {
                        nextCells[i].push(2);
                    } else {
                        nextCells[i].push(1);
                    }
                }
            }
        }
        this.setState({ cells: nextCells});
    }

    randomizeCells() {
        let nextCells = [];
        for(let i = 0; i < this.state.cells.length; i++) {
            nextCells.push([])
            for(let j = 0; j < this.state.cells[i].length; j++) {
                nextCells[i].push(Math.random() > 0.7 ? 2 : 1);
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

    cellClick(e) {
        let i = e.target.getAttribute("data-index-i");
        let j = e.target.getAttribute("data-index-j");
        let newCells = this.state.cells.slice();
        newCells[i][j] = (newCells[i][j] === 2 ? 1 : 2);
        this.setState({ cells: newCells });
    }

    // react lifecycle stuff

    componentDidMount() {
        this.randomizeCells();
    }

    render() {

        return(
            <div className="app-container">
                <h1 onClick={this.onClick}>App</h1>
                <CellGrid cells={this.state.cells}
                          cellClick={this.cellClick} />
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));