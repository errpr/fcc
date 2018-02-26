const MAP_HEIGHT = 300;
const MAP_WIDTH = 300;
const map = generateMap();
const entityMap = generateEntityMap();
const TILE_VISIBILITY = 11;

const TRANSITION_SPEED = 250;

/*
Tile ids
0 - floor tile 0
1 - floor tile 1
2 - floor tile 2
3 - floor tile 3
4 - door tile
5 - blackness
6 - unused
7 - wall corner tile
8 - horizontally running wall tile
9 - vertically running wall tile
*/

/*
Walls ids
0 - no wall
1 - wall
2 - wall with door
*/

/*
mock up of room data structure that would have doors on the left and right walls
Room = {
    id: 2 // index in the rooms array,
    doors: { // ids of rooms doors lead to
        left: 1,
        right: 0 // 0 means spawn a new room when we go through the door
    },
    walls: {
        left: 2,
        right: 2,
        down: 1,
        up: 1
    }
}
*/

/** @returns {number[][]}   */
function generateMap() {
    let m = Array(MAP_HEIGHT);
    for(let i = 0; i < MAP_HEIGHT; i++) {
        m[i] = Array(MAP_WIDTH);
        for(let j = 0; j < MAP_WIDTH; j++) {
            m[i][j] = floorTile();
        }
    }
    return m;
}

function generateEntityMap() {
    let m = Array(MAP_HEIGHT);
    for(let i = 0; i < MAP_HEIGHT; i++) {
        m[i] = Array(MAP_WIDTH);
        for(let j = 0; j < MAP_WIDTH; j++) {
            m[i][j] = (Math.random() > 0.8) ? 1 : 0;
        }
    }
    return m;
}

function generateMapNew() {
    let rooms = []
    let boss_spawned = false;
    let i = 0;
    while(!boss_spawned) {
        boss_spawned = Math.random() * 20 < i;
    }
}

function floorTile() {
    return Math.floor(Math.random() * 4);
}

/**
 * @param {number} height
 * @param {number} width
 * @param {Object} walls
 * @param {number} walls.left
 * @param {number} walls.right
 * @param {number} walls.up
 * @param {number} wall.down
 * @param {boolean} boss_room
 * @returns {number[][]}
 */
function generateRoom(height, width, walls, boss_room) {
    let m = Array(height);
    for(let i = 0; i < height; i++) {
        m[i] = Array(width);
        for(let j = 0; j < width; j++) {
            if(i == 0) {
                // top row
                if(j == 0) {
                    // top left corner
                    if(walls.left != 0 && walls.up != 0) {
                        m[i][j] = 7; continue;// wall corner
                    }
                    if(walls.left != 0) {
                        m[i][j] = 9; continue;// vertical wall
                    }
                    if(walls.up != 0) {
                        m[i][j] = 8; continue;// horizontal wall
                    }
                    m[i][j] = floorTile(); continue;
                }

                if(j == width - 1) {
                    // top right corner
                    if(walls.right != 0 && walls.up != 0) {
                        m[i][j] = 7; continue;// wall corner
                    }
                    if(walls.right != 0) {
                        m[i][j] = 9; continue;// vertical wall
                    }
                    if(walls.up != 0) {
                        m[i][j] = 8; continue;// horizontal wall
                    }
                    m[i][j] = floorTile(); continue;
                }

                if(walls.up != 0) {
                    if(j == Math.floor(width / 2) && walls.up == 2) {
                        m[i][j] = 4; continue;// door
                    }
                    m[i][j] = 8; continue;// horizontal wall
                }

                m[i][j] = floorTile(); continue;
            } // end if top row

            if(i == height - 1) {
                // bottom row
                if(j == 0) {
                    // bottom left corner
                    if(walls.left != 0 && walls.down !=0) {
                        m[i][j] = 7; continue; // wall corner
                    }
                    if(walls.left != 0) {
                        m[i][j] = 9; continue; // vertical wall
                    }
                    if(walls.down != 0) {
                        m[i][j] = 8; continue; // horizontal wall
                    }

                    m[i][j] = floorTile(); continue; 
                }

                if(j == width - 1) {
                    // bottom right corner
                    if(walls.right != 0 && walls.down !=0) {
                        m[i][j] = 7; continue; //corner wall
                    }
                    if(walls.right != 0) {
                        m[i][j] = 9; continue; // vertical wall
                    }
                    if(walls.down !=0) {
                        m[i][j] = 8; continue; // horizontal wall
                    }

                    m[i][j] = floorTile(); continue;
                }

                if(walls.down != 0) {
                    if(j == Math.floor(width / 2) && walls.down == 2) {
                        m[i][j] = 4; continue; // door
                    }
                    m[i][j] = 8; continue; // horizontal wall
                }
            } // end if bottom row

            if(j == 0) {
                //left edge
                if(walls.left != 0) {
                    if(i == Math.floor(height / 2) && walls.left == 2) {
                        m[i][j] = 4; continue; // door
                    }
                    m[i][j] = 9; continue; // vertical wall
                }
            }

            if(j == width - 1) {
                //right edge
                if(walls.right != 0) {
                    if(i == Math.floor(height / 2) && walls.right == 2) {
                        m[i][j] = 4; continue; // door
                    }
                }
            }

            m[i][j] = floorTile(); continue;
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
            if(i < 0 || j < 0 || i > MAP_HEIGHT - 1 || j > MAP_WIDTH - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(map[i][j]);
        }
    }
    
    return t;
}

function getVisibleEntities(x, y) {
    let x1 = Math.floor(x - (TILE_VISIBILITY / 2));
    let x2 = Math.floor(x + (TILE_VISIBILITY / 2));
    let y1 = Math.floor(y - (TILE_VISIBILITY / 2));
    let y2 = Math.floor(y + (TILE_VISIBILITY / 2));
    let t = [];

    for(let i = y1; i < y2; i++) {
        t.push([]);
        for(let j = x1; j < x2; j++) {
            if(i < 0 || j < 0 || i > MAP_HEIGHT - 1 || j > MAP_WIDTH - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(entityMap[i][j]);
        }
    }
    
    return t;
}

function EntityCell(props) {
    return <div className={"entity entity-" + props.entity}></div>;
}

function EntityRow(props) {
    let entityCells = props.entities.map((e, j) => {
        return <EntityCell key={`${props.i}${j}`} entity={e ? e : 0} />; 
    });
    return(
        <div className="entity-row">
            {entityCells}
        </div>
    );
}

function EntityGrid(props) {
    let entityRows = props.entities.map((e, i) => {
        return <EntityRow key={i} i={i} entities={e} />;
    });
    return(
        <div id="entity-grid" className="entity-grid">
            {entityRows}
        </div>
    );
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
            entityTiles: [[0]],
            player: {
                x: 150,
                y: 150
            },
            moving: false,
            facing: 'l'
        }

        this.moveLeft = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-right");
            document.getElementById("entity-grid").classList.add("translate-right");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x-1, y: p.y },
                    tiles: getVisibleTiles(p.x-1, p.y),
                    entityTiles: getVisibleEntities(p.x-1, p.y),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        }

        this.moveRight = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-left");
            document.getElementById("entity-grid").classList.add("translate-left");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x+1, y: p.y },
                    tiles: getVisibleTiles(p.x+1, p.y),
                    entityTiles: getVisibleEntities(p.x+1, p.y),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        }

        this.moveUp = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-down");
            document.getElementById("entity-grid").classList.add("translate-down");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x, y: p.y-1 },
                    tiles: getVisibleTiles(p.x, p.y-1),
                    entityTiles: getVisibleEntities(p.x, p.y-1),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        }

        this.moveDown = () => {
            if(this.state.moving) { return; }
            this.setState({ moving: true });
            document.getElementById("tile-grid").classList.add("translate-up");
            document.getElementById("entity-grid").classList.add("translate-up");
            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: p.x, y: p.y+1 },
                    tiles: getVisibleTiles(p.x, p.y+1),
                    entityTiles: getVisibleEntities(p.x, p.y+1),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        }
        this.handleKeyDowns = (e) => {
            switch(e.key) {
                case("ArrowLeft"): e.preventDefault(); this.setState({ facing: 'l' }); break;
                case("ArrowRight"): e.preventDefault(); this.setState({ facing: 'r' }); break;
            }
        }

        this.handleKeyUps = (e) => {
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
        document.addEventListener("keyup", this.handleKeyUps);
        document.addEventListener("keydown", this.handleKeyDowns);
    }

    componentWillMount() {
        this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y),
                        entityTiles: getVisibleEntities(this.state.player.x, this.state.player.y) });
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
                    <div className={"character-sprite" + 
                                    (this.state.facing == 'l' ? ' facing-left' : ' facing-right') +
                                    (this.state.moving ? ' moving' : '')}></div>
                    <TileGrid tiles={this.state.tiles} />
                    <EntityGrid entities={this.state.entityTiles} />
                    <div id="lighting-gradient-horizontal"></div>
                    <div id="lighting-gradient-vertical"></div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));