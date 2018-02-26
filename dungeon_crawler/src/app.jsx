//@ts-check
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

Walls ids
0 - unused
1 - wall
2 - wall with door

*/

const TILE_VISIBILITY = 11;

const TRANSITION_SPEED = 250;

let roomMap = Array(11).fill(null).map(e => Array(11).fill(0));
roomMap[5][5] = 1;
let rooms = [null,{
    id: 1,
    x: 5,
    y: 5,
    height: 10,
    width: 10,
    doors: {
        right: 0 // I dont think this is necessary with the roomMap
    },
    walls: {
        right: 2,
        left: 1,
        up: 1,
        down: 1
    },
    tiles: [[0]],
    entities: [[0]]
}];
let currentRoomId = 1;
rooms[1].tiles = generateRoomTiles(rooms[1]);
rooms[1].entities = generateRoomEntities(rooms[1]);

/** @param {Object} room 
 * @param {number} room.height
 * @param {number} room.width
 * @returns {number[][]}   */
function generateRoomEntities(room) {
    let m = Array(room.height).fill(0);
    for(let i = 1; i < room.height - 1; i++) {
        m[i] = Array(room.width).fill(0);
        for(let j = 1; j < room.width - 1; j++) {
            m[i][j] = (Math.random() > 0.8) ? 2 : 0;
        }
    }
    return m;
}


/** @param {string} directionEntered the direction player traveled to hit the door
 *  @param {Object} prevRoom the room player was in when they hit the door
 */
function enterNewDoor(directionEntered, prevRoom) {

}

/** @param {string} directionEntered the direction player traveled to hit the door
 *  @param {Object} newRoom the room we are now entering
 */
function changeRoom(directionEntered, newRoom) {

}

/** @returns {number} */
function floorTile() {
    return Math.floor(Math.random() * 4);
}

/**
 * @param {Object} room
 * @param {number} room.height
 * @param {number} room.width
 * @param {Object} room.walls
 * @param {number} room.walls.up
 * @param {number} room.walls.down
 * @param {number} room.walls.left
 * @param {number} room.walls.right
 * @returns {number[][]}
 */
function generateRoomTiles(room) {
    let height = room.height;
    let width = room.width;
    let m = Array(height);

    for(let i = 0; i < height; i++) {
        m[i] = Array(width);
        m[i][0] = 9;
        m[i][width - 1] = 9;

        for(let j = 1; j < width - 1; j++) {
            if(i == 0) {
                m[i][j] = 8;
            } else if(i == height - 1) {
                m[i][j] = 8;
            } else {
                m[i][j] = floorTile();
            }
        }
    }

    // put in doors
    if(room.walls.left == 2) {
        m[Math.floor(height / 2)][0] = 4;
    }
    if(room.walls.right == 2) {
        m[Math.floor(height / 2)][width - 1] = 4;
    }
    if(room.walls.up == 2) {
        m[0][Math.floor(width / 2)] = 4;
    }
    if(room.walls.down == 2) {
        m[height - 1][Math.floor(width / 2)] = 4;
    }
    
    // put in corners
    m[0][0] = 7; 
    m[0][width - 1] = 7;
    m[height - 1][0] = 7;
    m[height - 1][width - 1] = 7;

    return m;
}

/** 
 * @param {number} x
 * @param {number} y
 * @param {Object} room
 * @param {number} room.height
 * @param {number} room.width
 * @param {number[][]} room.tiles
 * @returns {number[][]}
 */
function getVisibleTiles(x, y, room) {
    let x1 = Math.floor(x - (TILE_VISIBILITY / 2));
    let x2 = Math.floor(x + (TILE_VISIBILITY / 2));
    let y1 = Math.floor(y - (TILE_VISIBILITY / 2));
    let y2 = Math.floor(y + (TILE_VISIBILITY / 2));
    let t = [];

    for(let i = y1; i < y2; i++) {
        t.push([]);
        for(let j = x1; j < x2; j++) {
            if(i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(5);
                continue;
            }
            t[i - y1].push(room.tiles[i][j]);
        }
    }
    
    return t;
}

/** 
 * @param {number} x
 * @param {number} y
 * @param {Object} room
 * @param {number} room.height
 * @param {number} room.width
 * @param {number[][]} room.entities
 * @returns {number[][]}
 */
function getVisibleEntities(x, y, room) {
    let x1 = Math.floor(x - (TILE_VISIBILITY / 2));
    let x2 = Math.floor(x + (TILE_VISIBILITY / 2));
    let y1 = Math.floor(y - (TILE_VISIBILITY / 2));
    let y2 = Math.floor(y + (TILE_VISIBILITY / 2));
    let t = [];

    for(let i = y1; i < y2; i++) {
        t.push([]);
        for(let j = x1; j < x2; j++) {
            if(i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(room.entities[i][j]);
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

function checkCollision(direction) {
    return false;
}

function interact(direction) {
    return false;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: [[1]],
            entityTiles: [[0]],
            player: {
                x: 5,
                y: 5
            },
            moving: false,
            aiming: false,
            ignoreNextMove: false,
            facing: 'l',
        }

        this.move = (direction) => {
            if(this.state.moving) { return; }
            if(this.state.ignoreNextMove) { return; }
            if(checkCollision(direction)) {
                interact(direction);
                return;
            }
            this.setState({ moving: true });
            let opposite;
            let newX = this.state.player.x;
            let newY = this.state.player.y;
            switch(direction) {
                case("left"): opposite = "right"; newX = newX-1; break;
                case("right"): opposite = "left"; newX = newX+1; break;
                case("up"): opposite = "down"; newY = newY-1; break;
                case("down"): opposite = "up"; newY = newY+1; break;
            }
            document.getElementById("tile-grid").classList.add("translate-" + opposite);
            document.getElementById("entity-grid").classList.add("translate-" + opposite);

            setTimeout(() => {
                let p = this.state.player;
                this.setState({ 
                    player: { x: newX, y: newY },
                    tiles: getVisibleTiles(newX, newY, rooms[currentRoomId]),
                    entityTiles: getVisibleEntities(newX, newY, rooms[currentRoomId]),
                    moving: false
                });
                document.getElementById("tile-grid").classList = "tile-grid";
                document.getElementById("entity-grid").classList = "entity-grid";
            }, TRANSITION_SPEED);
        }

        this.moveLeft = () => {
            this.move("left");
        }

        this.moveRight = () => {
            this.move("right");
        }

        this.moveUp = () => {
            this.move("up");
        }

        this.moveDown = () => {
            this.move("down");
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
        this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y, rooms[currentRoomId]),
                        entityTiles: getVisibleEntities(this.state.player.x, this.state.player.y, rooms[currentRoomId]) });
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