const MAP_HEIGHT = 300;
const MAP_WIDTH = 300;
const map = generateMap();

const TILE_VISIBILITY = 11;

const TRANSITION_SPEED = 250;

/** @returns {number[][]}   */
function generateMap() {
    let m = Array(MAP_HEIGHT);
    for(let i = 0; i < MAP_HEIGHT; i++) {
        m[i] = Array(MAP_WIDTH);
        for(let j = 0; j < MAP_WIDTH; j++) {
            m[i][j] = Math.floor(Math.random() * 4);
        }
    }
    return m;
}

/** 
 * @param {number} x
 * @param {number} y
 * @returns {number[][]}
 */
function getVisibleTiles(x, y) {
    let x1 = Math.floor(x - (TILE_VISIBILITY / 2));
    let x2 = Math.floor(x + (TILE_VISIBILITY / 2));
    let y1 = Math.floor(y - (TILE_VISIBILITY / 2));
    let y2 = Math.floor(y + (TILE_VISIBILITY / 2));
    let t = [];

    for(let i = y1; i < y2; i++) {
        t.push([]);
        for(let j = x1; j < x2; j++) {
            t[i - y1].push(map[i][j]);
        }
    }
    
    return t;
}

function TileCell(props) {
    return <div className={"tile tile-" + props.tile}></div>;
}

function TileRow(props) {
    let tileCells = props.tiles.map((e, j) => {
        return <TileCell key={`${props.i}${j}`} tile={e} />;
    });
    return(
        <div className="tile-row">
            {tileCells}
        </div>
    );
}

function TileGrid(props) {
    let tileRows = props.tiles.map((e, i) => {
        return <TileRow key={i} i={i} tiles={e} />;
    });
    return(
        <div id="tile-grid" className="tile-grid">
            {tileRows}
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: [[1]],
            player: {
                x: 150,
                y: 150
            }
        }

        this.moveLeft = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-right");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x-1, y: p.y },
                    tiles: getVisibleTiles(p.x-1, p.y),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        }

        this.moveRight = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-left");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x+1, y: p.y },
                    tiles: getVisibleTiles(p.x+1, p.y),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        }

        this.moveUp = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-down");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x, y: p.y-1 },
                    tiles: getVisibleTiles(p.x, p.y-1),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        }

        this.moveDown = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-up");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x, y: p.y+1 },
                    tiles: getVisibleTiles(p.x, p.y+1),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
            }, TRANSITION_SPEED);
        }

        this.handleKeys = (e) => {
            if(this.state.moving) { return; }
            switch(e.key) {
                case("ArrowDown"): e.preventDefault(); this.moveDown(); break;
                case("ArrowLeft"): e.preventDefault(); this.moveLeft(); break;
                case("ArrowUp"): e.preventDefault(); this.moveUp(); break;
                case("ArrowRight"): e.preventDefault(); this.moveRight(); break;
            }
        }
    }

    registerKeys() {
        // spamming move causes a small graphics glitch, so we listen for keyup instead of keydown
        document.addEventListener("keyup", this.handleKeys);
    }

    

    componentWillMount() {
        this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y) });
        this.registerKeys();
    }
    
    render() {
        return(
            <div id="app-container">
                <button className="control-btn" onClick={this.moveLeft}>left</button>
                <button className="control-btn" onClick={this.moveUp}>Up</button>
                <button className="control-btn" onClick={this.moveDown}>Down</button>
                <button className="control-btn" onClick={this.moveRight}>Right</button>
                <div id="tile-viewport">
                    <div className="character-sprite"></div>
                    <TileGrid tiles={this.state.tiles} />
                    <div id="lighting-gradient-horizontal"></div>
                    <div id="lighting-gradient-vertical"></div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));