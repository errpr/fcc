const TICK_DELAY = 250;
const GRID_WIDTH = 30;
const GRID_HEIGHT = 30;

function Cell(props) {
    return(
        <div onClick={props.cellClick}
             data-index-i={props.index[0]}
             data-index-j={props.index[1]}
             className={"cell cell" + (props.status === 1 ? "-alive" : "-dead" )}>
        </div>);
}

function CellRow(props) {
    let cells = props.cells.map((e, j) => { 
        return <Cell key={`${props.i}${j}`} 
                     index={[props.i, j]} 
                     status={e} 
                     cellClick={props.cellClick} />; 
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
                    cells={row} />;
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
            cells: this.createCells(GRID_HEIGHT, GRID_WIDTH),
            running: false,
            runInterval: undefined,
            generationCount: 0
        };
        this.nextCells = this.state.cells.slice();

        // ES6 ladies and gentlemen
        this.updateCells = this.updateCells.bind(this);
        this.runClick = this.runClick.bind(this);
        this.stepClick = this.stepClick.bind(this);
        this.cellClick = this.cellClick.bind(this);
        this.clearClick = this.clearClick.bind(this);
        this.beginRunning = this.beginRunning.bind(this);
        this.endRunning = this.endRunning.bind(this);
    }

    updateCells() {
        for(let i = 0; i < this.state.cells.length; i++) {
            for(let j = 0; j < this.state.cells[i].length; j++) {
                let neighbors_count = 0;
                if(i > 0) {
                    if(j > 0) {
                        neighbors_count += this.state.cells[i-1][j-1];
                    }
                    neighbors_count += this.state.cells[i-1][j];
                    if(j < this.state.cells[i].length - 1) {
                        neighbors_count += this.state.cells[i-1][j+1];
                    }
                }
                if(j > 0) {
                    neighbors_count += this.state.cells[i][j-1];
                }
                if(j < this.state.cells[i].length - 1) {
                    neighbors_count += this.state.cells[i][j+1];
                }
                if(i < this.state.cells.length - 1) {
                    if(j > 0) {
                        neighbors_count += this.state.cells[i+1][j-1];
                    }
                    neighbors_count += this.state.cells[i+1][j];
                    if(j < this.state.cells[i].length - 1) {
                        neighbors_count += this.state.cells[i+1][j+1];
                    }
                }

                if(this.state.cells[i][j] === 0) {
                    // it's dead jim
                    if(neighbors_count === 3) {
                        // it's respawned jim
                        this.nextCells[i][j] = 1;
                    } else {
                        this.nextCells[i][j] = 0;
                    }
                } else {
                    // it's alive
                    if(neighbors_count < 2) {
                        this.nextCells[i][j] = 0;
                    } else if(neighbors_count < 4) {
                        this.nextCells[i][j] = 1;
                    } else {
                        this.nextCells[i][j] = 0;
                    }
                }
            }
        }
        this.setState({ cells: this.nextCells, generationCount: this.state.generationCount + 1 });
    }

    clearCells() {
        this.setState({ cells: this.createCells(GRID_HEIGHT, GRID_WIDTH), running: false, generationCount: 0 })
    }

    randomizeCells() {
        let nextCells = [];
        for(let i = 0; i < this.state.cells.length; i++) {
            nextCells.push([])
            for(let j = 0; j < this.state.cells[i].length; j++) {
                nextCells[i].push(Math.random() > 0.7 ? 1 : 0);
            }
        }
        this.setState({ cells: nextCells });
    }

    createCells(height, width) {
        let cells = [];
        for(let i = 0; i < height; i++) {
            cells.push([])
            for(let j = 0; j < width; j++) {
                cells[i].push(0);
            }
        }
        return cells;
    }

    beginRunning() {
        this.updateCells();
        let runInterval = setInterval(this.updateCells, TICK_DELAY);
        this.setState({ runInterval });
    }

    endRunning() {
        clearInterval(this.state.runInterval);
    }

    // event handlers

    stepClick(e) {
        this.updateCells();
    }

    cellClick(e) {
        let i = e.target.getAttribute("data-index-i");
        let j = e.target.getAttribute("data-index-j");
        let newCells = this.state.cells.slice();
        newCells[i][j] = (newCells[i][j] === 1 ? 0 : 1);
        this.setState({ cells: newCells, running: false });
    }

    runClick(e) {
        this.setState({ running: !this.state.running });
    }

    clearClick(e) {
        this.clearCells();
    }

    // lifecycle stuff

    componentDidMount() {
        this.randomizeCells();
    }

    componentDidUpdate(prevProps, prevState) {
        if(!prevState.running && this.state.running) {
            this.beginRunning();
        }
        if(prevState.running && !this.state.running) {
            this.endRunning();
        }
    }

    render() {

        return(
            <div className="app-container">
                <h1>Conway Twitty's Game-o-Life</h1>
                <CellGrid cells={this.state.cells}
                          cellClick={this.cellClick} />
                <button className="app-controls" onClick={this.clearClick}>Clear</button>
                <button className="app-controls" onClick={this.stepClick}>Step</button>
                <button className="app-controls" onClick={this.runClick}>{this.state.running ? "Pause" : "Run"}</button>
                <div className="gen-display">Generation {this.state.generationCount}</div>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));