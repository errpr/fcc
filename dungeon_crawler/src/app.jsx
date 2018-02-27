//@ts-check
const TILE_VISIBILITY = 11;
const TRANSITION_SPEED = 180;

const NUMBER_OF_FLOOR_TILES = 4;
const NUMBER_OF_ITEM_DROP_ENTITIES = 3;
const NUMBER_OF_ENEMY_ENTITIES = 4; // not including boss

const ENTITY_NOTHING = 0;
const ENTITY_FOOD = 1;
const ENTITY_UPGRADE = 2;

const ENTITY_ZOMBIE = 3;
const ENTITY_RED_ZOMBIE = 4;
const ENTITY_ELF = 5;
const ENTITY_RED_ELF = 6;
const ENTITY_BOSS = 7;

const TILE_FLOOR_GRAVEL = 0;
const TILE_FLOOR_GRASS = 1;
const TILE_FLOOR_MUD = 2;
const TILE_FLOOR_BRICK = 3;
const TILE_NOTHINGNESS = 5;
const TILE_WALL_TOP = 6;
const TILE_WALL_BOTTOM = 7;
const TILE_WALL_LEFT = 8;
const TILE_WALL_RIGHT = 9;
const TILE_WALL_CORNER_TOP_LEFT = 10;
const TILE_WALL_CORNER_TOP_RIGHT = 11;
const TILE_WALL_CORNER_BOTTOM_LEFT = 12;
const TILE_WALL_CORNER_BOTTOM_RIGHT = 13;
const TILE_DOOR_LEFT = 14;
const TILE_DOOR_TOP = 15;
const TILE_DOOR_BOTTOM = 16;
const TILE_DOOR_RIGHT = 17;

const WALL_WITHOUT_DOOR = 1;
const WALL_WITH_DOOR = 2;

class Entity {
    /** @param {number} t */
    constructor(t) {
        this.facing = Math.random() > 0.5 ? 'r' : 'l';
        this.type = t;
        this.hp = 0;
        this.attack = 0;
        this.xpvalue = 0;
        switch(t) {
            case(ENTITY_ZOMBIE): this.hp = 2; this.attack = 1; this.xpvalue = 1; break;
            case(ENTITY_RED_ZOMBIE): this.hp = 10; this.attack = 5; this.xpvalue = 4; break;  
            case(ENTITY_ELF): this.hp = 20; this.attack = 10; this.xpvalue = 8; break;
            case(ENTITY_RED_ELF): this.hp = 30; this.attack = 15; this.xpvalue = 16; break;
            case(ENTITY_BOSS): this.hp = 100; this.attack = 20; break;
        }
    }

    /** @param {number} amount */
    takeDamage(amount) {
        this.hp = this.hp - amount;
        if(this.hp <= 0) {
            this.type = this.spawnLoot();
            return this.xpvalue;
        }
        return false;
    }

    spawnLoot() {
        let baseChance = 0.15
        let droppedAnthing = (Math.random() < (baseChance + (perqs.greed / 10)));
        if(droppedAnthing) {
            let drop = Math.floor(Math.random() * 2);
            switch(drop) {
                case(0): return ENTITY_UPGRADE;
                case(1): return ENTITY_FOOD;
                default: return ENTITY_NOTHING;
            }
        } else {
            return 0;
        }
    }

    kill() {
        this.type = ENTITY_NOTHING;
    }
}

// ended up not needing to be a class, oh well
class Room {
    constructor(x, y, height, width, walls, id = rooms.length, boss = false) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.midHeight = Math.floor(height / 2);
        this.width = width;
        this.midWidth = Math.floor(width / 2);
        this.walls = walls;
        this.id = id;
        this.tiles = [[0]];
        this.entities = [[]];
        this.boss = boss;
    }
}

function spawnPlayerNotification(text) {
    let p = document.createElement("p");
    p.innerText = text;
    p.classList.add("floating-notification");
    document.getElementById("player-notifications-container").appendChild(p);
    setTimeout(()=>{ p.classList.add("float-out-animation") }, 100);
    setTimeout(()=>{ p.remove() }, 1100);
}

/** @type {number[][]} */
let roomMap;
/** @type {Room[]} */
let rooms;
let currentRoomId = 1;
let perqs = {
    carbs: 0,
    greed: 0,
    armor: 0
};

function resetGlobals() {
    roomMap = Array(TILE_VISIBILITY).fill(null).map(e => Array(TILE_VISIBILITY).fill(0));
    roomMap[5][5] = 1;
    rooms = [new Room(0,0,0,0,{},0)];
    rooms.push(new Room(5, 5, 10, 10, { right: 2, left: 1, up: 1, down: 1}, 1));
    rooms[1].tiles = generateRoomTiles(rooms[1]);
    rooms[1].entities = generateRoomEntities(rooms[1]);
    currentRoomId = 1;
    perqs = {
        carbs: 0,
        greed: 0,
        armor: 0
    }
}

resetGlobals();

function randomEnemy() {
    return Math.floor(Math.random() * NUMBER_OF_ENEMY_ENTITIES) + NUMBER_OF_ITEM_DROP_ENTITIES
}

/** @param {Room} room
 * @returns {Entity[][]}   */
function generateRoomEntities(room) {
    let m = Array(room.height).fill(0);
    for(let i = 1; i < room.height - 1; i++) {
        m[i] = Array(room.width).fill(0);
        for(let j = 1; j < room.width - 1; j++) {
            if( (i == room.midHeight && j == 1) ||
                (i == room.midHeight && j == room.width - 2) ||
                (i == 1 && j == room.midWidth) ||
                (i == room.height - 2 && j == room.midWidth) {
                //dont spawn enemy in front of door
                m[i][j] = 0;
                continue;
            }
            //should probably switch to perlin noise
            m[i][j] = (Math.random() > 0.85) ? randomEnemy() : 0;
        }
    }
    return m;
}

function matchNeighboringDoors(x, y, walls) {
    let w = walls;
    let leftRoom = roomMap[y][x-1];
    let rightRoom = roomMap[y][x+1];
    let upRoom = roomMap[y-1][x];
    let downRoom = roomMap[y+1][x];
    if(leftRoom > 0 && rooms[leftRoom].walls.right == 2) {
        w.left = 2;
    }
    if(rightRoom > 0 && rooms[rightRoom].walls.left == 2) {
        w.right = 2;
    }
    if(upRoom > 0 && rooms[upRoom].walls.down == 2) {
        w.up = 2;
    }
    if(downRoom > 0 && rooms[downRoom].walls.up == 2) {
        w.down = 2;
    }

    return w;
}

// this algorithm is borked and spawns too many doors, but my brain is tired
function createAdditionalDoors(walls) {
    let doorsToPlace = 2 + Math.floor(Math.random() * 2);
    let w = ["left", "right", "up", "down"];
    for (let i = w.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [w[i], w[j]] = [w[j], w[i]];
    }
    let i = 0;
    while(doorsToPlace > 0) {
        let wallToCheck = walls[w[i]];
        if(wallToCheck == 2) {
            doorsToPlace--;
        } else {
            walls[w[i]] = 2;
            doorsToPlace--;
        }
        if(i > 4) {
            console.log("Somethings wrong with door placement.");
            break;
        }
        i++;
    }
    return walls;
}

function createBossRoom(directionEntered, prevRoom) {
    let newX = prevRoom.x;
    let newY = prevRoom.y;
    let walls = { left: 1, right: 1, up: 1, down: 1};
    switch(directionEntered) {
        case("right"): newX++; break;
        case("left"): newX--; break;
        case("up"): newY--; break;
        case("down"): newY++; break;
    }

    walls = matchNeighboringDoors(newX, newY, walls);

    let id = rooms.length;
    let newRoom = new Room( newX,
                            newY,
                            Math.floor(Math.random() * 10) + 6, 
                            Math.floor(Math.random() * 10) + 6,
                            walls,
                            id,
                            true );
    roomMap[newY][newX] = id;
    newRoom.tiles = generateRoomTiles(newRoom, 1);
    newRoom.entities = Array(newRoom.height).fill(null).map(e => Array(newRoom.width).fill(0));
    let boss = new Entity(ENTITY_BOSS);
    newRoom.entities[newRoom.midHeight][newRoom.midWidth] = boss;
    //@ts-ignore
    newRoom.boss = boss;
    rooms.push(newRoom);
    return newRoom;
}

function createRoom(directionEntered, prevRoom) {
    let newX = prevRoom.x;
    let newY = prevRoom.y;
    let walls = { left: 1, right: 1, up: 1, down: 1};
    switch(directionEntered) {
        case("right"): newX++; break;
        case("left"): newX--; break;
        case("up"): newY--; break;
        case("down"): newY++; break;
    }

    walls = matchNeighboringDoors(newX, newY, walls);

    walls = createAdditionalDoors(walls);

    let id = rooms.length;
    let newRoom = new Room( newX,
                            newY,
                            Math.floor(Math.random() * 10) + 6, 
                            Math.floor(Math.random() * 10) + 6,
                            walls,
                            id );
    roomMap[newY][newX] = id;
    newRoom.tiles = generateRoomTiles(newRoom);
    newRoom.entities = generateRoomEntities(newRoom);
    rooms.push(newRoom);
    return newRoom;
}


/** @param {string} directionEntered the direction player traveled to hit the door
 *  @param {Object} prevRoom the room player was in when they hit the door */
function enterNewDoor(directionEntered, prevRoom) {
    let newRoom;
    if(Math.floor(Math.random() * currentRoomId) > 4) {
        // create boss room
        newRoom = createBossRoom(directionEntered, prevRoom);
    } else {
        newRoom = createRoom(directionEntered, prevRoom);
    }
    changeRoom(directionEntered, newRoom);
    return newRoom.id;
}

/** @param {string} directionEntered the direction player traveled to hit the door
 *  @param {Object} newRoom the room we are now entering */
function changeRoom(directionEntered, newRoom) {
    currentRoomId = newRoom.id;
}

/** @returns {number} */
function floorTile() {
    return Math.floor(Math.random() * NUMBER_OF_FLOOR_TILES);
}

/**
 * @param {Room} room
 * @param {number | boolean} forceTile
 * @returns {number[][]}
 */
function generateRoomTiles(room, forceTile = false) {
    let height = room.height;
    let width = room.width;
    let m = Array(height);

    for(let i = 0; i < height; i++) {
        m[i] = Array(width);
        m[i][0] = TILE_WALL_LEFT;
        m[i][width - 1] = TILE_WALL_RIGHT;

        for(let j = 1; j < width - 1; j++) {
            if(i == 0) {
                m[i][j] = TILE_WALL_TOP;
            } else if(i == height - 1) {
                m[i][j] = TILE_WALL_BOTTOM;
            } else {
                m[i][j] = (forceTile ? forceTile : floorTile());
            }
        }
    }

    // put in doors
    if(room.walls.left == WALL_WITH_DOOR) {
        m[room.midHeight][0] = TILE_DOOR_LEFT;
    }
    if(room.walls.right == WALL_WITH_DOOR) {
        m[room.midHeight][width - 1] = TILE_DOOR_RIGHT;
    }
    if(room.walls.up == WALL_WITH_DOOR) {
        m[0][room.midWidth] = TILE_DOOR_TOP;
    }
    if(room.walls.down == WALL_WITH_DOOR) {
        m[height - 1][room.midWidth] = TILE_DOOR_BOTTOM;
    }
    
    // put in corners
    m[0][0] = TILE_WALL_CORNER_TOP_LEFT; 
    m[0][width - 1] = TILE_WALL_CORNER_TOP_RIGHT;
    m[height - 1][0] = TILE_WALL_CORNER_BOTTOM_LEFT;
    m[height - 1][width - 1] = TILE_WALL_CORNER_BOTTOM_RIGHT;

    return m;
}

/** 
 * @param {number} x
 * @param {number} y
 * @param {Room} room
 * @returns {number[][]}
 */
function getVisibleTiles(x, y, room) {
    let x1 = Math.ceil(x - (TILE_VISIBILITY / 2));
    let x2 = Math.ceil(x + (TILE_VISIBILITY / 2));
    let y1 = Math.ceil(y - (TILE_VISIBILITY / 2));
    let y2 = Math.ceil(y + (TILE_VISIBILITY / 2));
    let t = [];

    for(let i = y1; i < y2; i++) {
        t.push([]);
        for(let j = x1; j < x2; j++) {
            if(i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(TILE_NOTHINGNESS);
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
 * @param {Room} room
 * @returns {number[][]}
 */
function getVisibleEntities(x, y, room) {
    let x1 = Math.ceil(x - (TILE_VISIBILITY / 2));
    let x2 = Math.ceil(x + (TILE_VISIBILITY / 2));
    let y1 = Math.ceil(y - (TILE_VISIBILITY / 2));
    let y2 = Math.ceil(y + (TILE_VISIBILITY / 2));
    let t = [];

    for(let i = y1; i < y2; i++) {
        t.push([]);
        for(let j = x1; j < x2; j++) {
            if(i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(ENTITY_NOTHING);
                continue;
            }
            t[i - y1].push(room.entities[i][j]);
        }
    }
    
    return t;
}

/*
    Begin React stuff 
*/

function EntityCell(props) {
    let e = props.entity;
    if(e == ENTITY_NOTHING || e.type == ENTITY_NOTHING) {
        return <div className="entity entity-0"></div>;
    } else {
        return <div className={"entity entity-" + e.type + " facing-" + e.facing}></div>;
    }
}

function EntityRow(props) {
    let entityCells = props.entities.map((e, j) => {
        return <EntityCell key={`${props.i}${j}`} entity={e ? e : ENTITY_NOTHING } />; 
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

class UserInterface extends React.Component {
    constructor(props) {
        super(props);

        this.moveLeft = (e) => {
            this.props.moveHandler("left");
        }
        this.moveRight = (e) => {
            this.props.moveHandler("right");
        }
        this.moveUp = (e) => {
            this.props.moveHandler("up");
        }
        this.moveDown = (e) => {
            this.props.moveHandler("down");
        }
    }

    render() {
        return(
            <div id="ui-overlay">
                <button onClick={this.moveLeft} className="move-button" id="move-button-left" > </button>
                <button onClick={this.moveRight} className="move-button" id="move-button-right" ></button>
                <button onClick={this.moveUp} className="move-button" id="move-button-up" ></button>
                <button onClick={this.moveDown} className="move-button" id="move-button-down" ></button>
                <p className="ui-text" id="ui-player-hp">HP:{this.props.player.hp}</p>
                <p className="ui-text" id="ui-player-weapon">ATK:{this.props.player.weaponDamage}</p>
                <p className={"ui-text" + (this.props.boss ? "" : " invisible")} id="ui-boss-hp">BOSS HP:{(this.props.boss ? this.props.boss.hp : "")}</p>
                <p className="ui-text" id="ui-player-level">LVL:{this.props.player.level}</p>
                <p className="ui-text" id="ui-player-xptnl">XP-REQ:{this.props.player.xptnl}</p>
            </div>
        );
    }
}

function GameOverInterface(props) {
    let alive = props.player.hp > 0;
    let victory = props.boss && props.boss.hp <= 0;
    let toggleScreen = (alive || victory);
    return (<div className={"game-over-screen-container " + (alive && !victory ? "invisible" : "")}>
                <h1 className={"dark-souls " + (alive || victory ? "invisible" : "")}>YOU DIED</h1>
                <h1 className={"dark-souls " + (victory && alive ? "" : "invisible")}>YOU WON</h1>
                <button className={"respawn-button" + (alive && !victory ? " invisible" : "")} onClick={props.reset}>Try Again</button>
            </div>);
}

function PerqInterface(props) {
    if(!props.visible) {
        return null;
    }
    return(
        <div id="perq-interface">
            <p id="perq-caption">Choose a perquisite</p>
            <div onClick={() => props.choiceHandler('carbs')} className="perq-choice" id="perq-carbs">
                <img src="http://error.diodeware.com/fcc/dungeon_crawler/food.png" className="perq-icon" id="perq-carbs-icon"></img>
                <h3 className="perq-title">Carboload</h3>
                <p className="perq-description">Food heals for more</p>
            </div>
            <div onClick={() => props.choiceHandler('greed')} className="perq-choice" id="perq-greed">
                <img src="http://error.diodeware.com/fcc/dungeon_crawler/bag.png" className="perq-icon" id="perq-greed-icon"></img>
                <h3 className="perq-title">Greediness</h3>
                <p className="perq-description">Loot drops more often</p>
            </div>
            <div onClick={() => props.choiceHandler('armor')} className="perq-choice" id="perq-armor">
                <img src="http://error.diodeware.com/fcc/dungeon_crawler/armor.png" className="perq-icon" id="perq-armor-icon"></img>
                <h3 className="perq-title">Armor</h3>
                <p className="perq-description">Take less damage</p>
            </div>
        </div>);
}

const defaultAppState = {
    player: {
        x: 1,
        y: 5,
        hp: 30,
        weaponDamage: 1,
        level: 1,
        xptnl: 3
    },
    moving: false,
    aiming: false,
    ignoreNextMove: false,
    facing: 'l',
    tiles: [[]],
    entities: [[]],
    boss: false,
    perqTime: false,
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultAppState;

        this.move = this.move.bind(this);

        this.handleKeyDowns = (e) => {
            switch(e.key) {
                case("ArrowLeft"): e.preventDefault(); this.setState({ facing: 'l' }); break;
                case("ArrowRight"): e.preventDefault(); this.setState({ facing: 'r' }); break;
            }
        }

        this.handleKeyUps = (e) => {
            if(this.state.moving) { return; }
            switch(e.key) {
                case("ArrowDown"): e.preventDefault(); this.move("down"); break;
                case("ArrowLeft"): e.preventDefault(); this.move("left"); break;
                case("ArrowUp"): e.preventDefault(); this.move("up"); break;
                case("ArrowRight"): e.preventDefault(); this.move("right"); break;
            }
        }

        this.resetGame = (e) => {
            resetGlobals();
            this.setState(defaultAppState);
            this.setState({
                tiles: getVisibleTiles(1, 5, rooms[1]),
                entities: getVisibleEntities(1, 5, rooms[1])
            });
        }

        this.perqOff = (perq) => {
            this.setState({
                perqTime: false,
            });
            perqs[perq]++;
        }
    }

    playerDeath() {
        this.setState(prevState => { return {
            player: {
                ...prevState.player,
                hp: 0,
                weaponDamage: 0,
            },
            moving: true
        } });
    }

    /** @param {number} amount */
    takeDamage(amount) {
        amount = amount - perqs.armor;
        if(amount <= 0) {
            amount = 1;
        }
        let nextHp = this.state.player.hp - amount;
        if(nextHp <= 0) {
            this.playerDeath();
        } else {
            document.getElementById("tile-viewport").classList.add("damage");
            setTimeout(() => document.getElementById("tile-viewport").classList.remove("damage"), 300);
            this.setState(prevState => {
                return { player: { ...prevState.player, hp: nextHp } };
            });
        }
    }


    gainXp() {
        let p = this.state.player;
        p.xptnl--;
        if(p.xptnl <= 0) {
            p.level = p.level + 1;
            p.xptnl = Math.round(Math.log(p.level) * 5);
            p.hp = p.hp + 3;
            p.weaponDamage = p.weaponDamage + 1;
            spawnPlayerNotification("LEVEL UP");
            if(p.level % 5 == 0) {
                this.setState({ perqTime: true });
            }
        }
        this.setState({ player: p });
    }

    /** @param {Entity} enemyEntity */
    fightEnemy(enemyEntity) {
        let slain = enemyEntity.takeDamage(this.state.player.weaponDamage);
        if(enemyEntity.type == 2) {
            this.setState({ boss: enemyEntity });
        }
        if(slain) {
            this.gainXp();
        }
        this.takeDamage(enemyEntity.attack);
    }

    consumeFood(foodEntity) {
        foodEntity.kill();
        let hp = this.state.player.hp + 3 + perqs.carbs;
        this.setState(prevState => { return { player: { ...prevState.player, hp: hp} } });
        spawnPlayerNotification("HP UP");
    }

    consumeUpgrade(upgradeEntity) {
        upgradeEntity.kill();
        let d = this.state.player.weaponDamage + 1;
        this.setState(prevState => { return { player: { ...prevState.player, weaponDamage: d} } });
        spawnPlayerNotification("WEAPON UP");
    }

    /** @param {string} direction
     *  @param {Room} newRoom
     */
    animateRoomChange(direction, newRoom) {
        let newX;
        let newY;
        switch(direction) {
            case("left"): newX = newRoom.width - 2; newY = newRoom.midHeight; break;
            case("right"): newX = 1; newY = newRoom.midHeight; break;
            case("up"): newX = newRoom.midWidth; newY = newRoom.height - 2; break;
            case("down"): newX = newRoom.midWidth; newY = 1; break;
        }       
        this.setState(prevState => { return {
            tiles: getVisibleTiles(newX, newY, newRoom),
            entities: getVisibleEntities(newX, newY, newRoom),
            player: { ...prevState.player, x: newX, y: newY },
            boss: newRoom.boss,
        }});
    }

    enterDoor(direction) {
        let prevRoom = rooms[currentRoomId];
        let newRoomX = prevRoom.x;
        let newRoomY = prevRoom.y;
        switch(direction) {
            case("left"): newRoomX--; break;
            case("right"): newRoomX++; break;
            case("up"): newRoomY--; break;
            case("down"): newRoomY++; break;
        }
        let nextRoomId = roomMap[newRoomY][newRoomX];
        if(nextRoomId == 0) {
            nextRoomId = enterNewDoor(direction, prevRoom);
            this.animateRoomChange(direction, rooms[nextRoomId]);
        } else {
            changeRoom(direction, rooms[nextRoomId]);
            this.animateRoomChange(direction, rooms[nextRoomId]);
        }
    }

    /** @param {string} type
     *  @param {number} x
     *  @param {number} y */
    interact(type, x, y, direction) {
        switch(type) {
            case("enemy"): this.fightEnemy(rooms[currentRoomId].entities[y][x]); break;
            case("door"): this.enterDoor(direction); break;
            case("upgrade"): this.consumeUpgrade(rooms[currentRoomId].entities[y][x]); break;
            case("food"): this.consumeFood(rooms[currentRoomId].entities[y][x]); break;
        }
        return false;
    }

    /** @param {string} direction */
    move(direction) {
        if(this.state.moving) { return; }
        if(this.state.ignoreNextMove) { return; }
        let opposite;
        let newX = this.state.player.x;
        let newY = this.state.player.y;
        let newF = this.state.facing;
        switch(direction) {
            case("left"): opposite = "right"; newX--; newF = "l"; break;
            case("right"): opposite = "left"; newX++; newF = "r"; break;
            case("up"): opposite = "down"; newY--; break;
            case("down"): opposite = "up"; newY++; break;
        }
        let collision = this.checkCollision(newX, newY);
        if(collision) {
            this.interact(collision, newX, newY, direction);
            if(collision == "enemy" || collision == "wall" || collision == "door") {
                return;
            }
        }
        this.setState({ moving: true, facing: newF });
        
        document.getElementById("tile-grid").classList.add("translate-" + opposite);
        document.getElementById("entity-grid").classList.add("translate-" + opposite);

        setTimeout(() => {
            let p = this.state.player;
            this.setState(prevState => { return {
                ...prevState, 
                player: { ...prevState.player, x: newX, y: newY },
                tiles: getVisibleTiles(newX, newY, rooms[currentRoomId]),
                entities: getVisibleEntities(newX, newY, rooms[currentRoomId]),
                moving: false
            }; });
            document.getElementById("tile-grid").className = "tile-grid";
            document.getElementById("entity-grid").className = "entity-grid";
        }, TRANSITION_SPEED);
    }

    checkCollision(x, y) {
        let room = rooms[currentRoomId];
        let tile = room.tiles[y][x];
        let entity = room.entities[y][x];
        if( tile == TILE_WALL_TOP    || 
            tile == TILE_WALL_BOTTOM || 
            tile == TILE_WALL_RIGHT  || 
            tile == TILE_WALL_LEFT) {
            return "wall";
        }
        if( tile == TILE_DOOR_TOP    || 
            tile == TILE_DOOR_BOTTOM || 
            tile == TILE_DOOR_RIGHT  || 
            tile == TILE_DOOR_LEFT) {
            return "door";
        }
        if(entity.type == ENTITY_UPGRADE) {
            return "upgrade";
        }
        if(entity.type == ENTITY_FOOD) {
            return "food";
        }
        if( entity.type == ENTITY_ZOMBIE || 
            entity.type == ENTITY_RED_ZOMBIE ||
            entity.type == ENTITY_ELF ||
            entity.type == ENTITY_RED_ELF ||
            entity.type == ENTITY_BOSS) {
            return "enemy";
        }
        return false;
    }

    registerKeys() {
        document.addEventListener("keyup", this.handleKeyUps);
        document.addEventListener("keydown", this.handleKeyDowns);
    }

    componentWillMount() {
        this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y, rooms[currentRoomId]),
                        entities: getVisibleEntities(this.state.player.x, this.state.player.y, rooms[currentRoomId]) });
        this.registerKeys();
    }
    
    render() {
        return(
            <div id="app-container">
                <div id="tile-viewport">
                    <div className={"character-sprite" + 
                                    (this.state.facing == 'l' ? ' facing-left' : ' facing-right') +
                                    (this.state.moving ? ' moving' : '')}></div>
                    <div id="player-notifications-container"></div>
                    <TileGrid tiles={this.state.tiles} />
                    <EntityGrid entities={this.state.entities} />
                    <div id="lighting-gradient-horizontal"></div>
                    <div id="lighting-gradient-vertical"></div>
                    <PerqInterface visible={this.state.perqTime} choiceHandler={this.perqOff} />
                    <UserInterface moveHandler={this.move} player={this.state.player} boss={this.state.boss} />
                    <GameOverInterface player={this.state.player} reset={this.resetGame} boss={this.state.boss} />
                </div>
            </div>
        );
    }
}

//@ts-ignore
ReactDOM.render(<App />, document.getElementById('root'));