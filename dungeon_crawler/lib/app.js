'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//@ts-check
var TILE_VISIBILITY = 11;
var TRANSITION_SPEED = 180;

var PERQ_FREQUENCY = 3;

var TOTAL_ROOMS_TALL = 30;
var TOTAL_ROOMS_WIDE = 30;
var MIN_ROOM_SIZE = 8;

var NUMBER_OF_FLOOR_TILES = 4;
var NUMBER_OF_ITEM_DROP_ENTITIES = 3;
var NUMBER_OF_ENEMY_ENTITIES = 4; // not including boss

var ENTITY_NOTHING = 0;
var ENTITY_FOOD = 1;
var ENTITY_UPGRADE = 2;

var ENTITY_ZOMBIE = 3;
var ENTITY_RED_ZOMBIE = 4;
var ENTITY_ELF = 5;
var ENTITY_RED_ELF = 6;
var ENTITY_BOSS = 7;

var TILE_FLOOR_GRAVEL = 0;
var TILE_FLOOR_GRASS = 1;
var TILE_FLOOR_MUD = 2;
var TILE_FLOOR_BRICK = 3;
var TILE_NOTHINGNESS = 5;
var TILE_WALL_TOP = 6;
var TILE_WALL_BOTTOM = 7;
var TILE_WALL_LEFT = 8;
var TILE_WALL_RIGHT = 9;
var TILE_WALL_CORNER_TOP_LEFT = 10;
var TILE_WALL_CORNER_TOP_RIGHT = 11;
var TILE_WALL_CORNER_BOTTOM_LEFT = 12;
var TILE_WALL_CORNER_BOTTOM_RIGHT = 13;
var TILE_DOOR_LEFT = 14;
var TILE_DOOR_TOP = 15;
var TILE_DOOR_BOTTOM = 16;
var TILE_DOOR_RIGHT = 17;

var WALL_WITHOUT_DOOR = 1;
var WALL_WITH_DOOR = 2;

var Entity = function () {
    /** @param {number} t */
    function Entity(t) {
        _classCallCheck(this, Entity);

        this.facing = Math.random() > 0.5 ? 'r' : 'l';
        this.type = t;
        this.hp = 0;
        this.attack = 0;
        this.xpvalue = 0;
        this.notification = "";
        switch (t) {
            case ENTITY_ZOMBIE:
                this.hp = 2;this.attack = 1;this.xpvalue = 1;break;
            case ENTITY_RED_ZOMBIE:
                this.hp = 6;this.attack = 3;this.xpvalue = 2;break;
            case ENTITY_ELF:
                this.hp = 20;this.attack = 6;this.xpvalue = 5;break;
            case ENTITY_RED_ELF:
                this.hp = 40;this.attack = 12;this.xpvalue = 12;break;
            case ENTITY_BOSS:
                this.hp = 200;this.attack = 20;break;
        }
    }

    /** @param {number} amount */


    _createClass(Entity, [{
        key: 'takeDamage',
        value: function takeDamage(amount) {
            this.hp = this.hp - amount;
            if (this.hp <= 0) {
                this.type = this.spawnLoot();
                return this.xpvalue;
            }
            return false;
        }
    }, {
        key: 'spawnLoot',
        value: function spawnLoot() {
            var baseChance = 0.21;
            var droppedAnything = Math.random() < baseChance + perqs.greed / 10;
            if (droppedAnything) {
                var drop = Math.floor(Math.random() * 6);
                switch (drop) {
                    case 0:
                        return ENTITY_UPGRADE;
                    case 1:
                        return ENTITY_FOOD;
                    case 2:
                        return ENTITY_FOOD;
                    case 3:
                        return ENTITY_FOOD;
                    case 4:
                        return ENTITY_FOOD;
                    case 5:
                        return ENTITY_FOOD;
                    default:
                        return ENTITY_NOTHING;
                }
            } else {
                return 0;
            }
        }
    }, {
        key: 'kill',
        value: function kill() {
            this.type = ENTITY_NOTHING;
        }
    }]);

    return Entity;
}();

// ended up not needing to be a class, oh well


var Room = function Room(x, y, height, width, walls) {
    var id = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : rooms.length;
    var boss = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    _classCallCheck(this, Room);

    this.x = x;
    this.y = y;
    this.height = height;
    this.midHeight = Math.floor(height / 2);
    this.width = width;
    this.midWidth = Math.floor(width / 2);
    this.walls = walls;
    this.id = id;
    this.enemyPool = [0];
    this.tiles = [[0]];
    this.entities = [[]];
    this.boss = boss;
};

/** @type {number[][]} */


var roomMap = void 0;
/** @type {Room[]} */
var rooms = void 0;
var currentRoomId = 1;
var perqs = {
    carbs: 0,
    greed: 0,
    armor: 0
};
var bossSpawned = void 0;

function resetGlobals() {
    roomMap = Array(TOTAL_ROOMS_TALL).fill(null).map(function (e) {
        return Array(TOTAL_ROOMS_WIDE).fill(0);
    });
    roomMap[Math.floor(TOTAL_ROOMS_TALL / 2)][Math.floor(TOTAL_ROOMS_WIDE / 2)] = 1;
    rooms = [new Room(0, 0, 0, 0, {}, 0)];
    rooms.push(new Room(Math.floor(TOTAL_ROOMS_TALL / 2), Math.floor(TOTAL_ROOMS_WIDE / 2), 10, 10, { right: 2, left: 1, up: 1, down: 1 }, 1));
    rooms[1].enemyPool = generateRoomEnemyPool(1);
    rooms[1].tiles = generateRoomTiles(rooms[1]);
    rooms[1].entities = generateRoomEntities(rooms[1]);
    currentRoomId = 1;
    perqs = {
        carbs: 0,
        greed: 0,
        armor: 0
    };
    bossSpawned = false;
}

resetGlobals();

function spawnPlayerNotification(text) {
    var p = document.createElement("p");
    p.innerText = text;
    p.classList.add("floating-notification");
    document.getElementById("player-notifications-container").appendChild(p);
    setTimeout(function () {
        p.classList.add("float-out-animation");
    }, 100);
    setTimeout(function () {
        p.remove();
    }, 1100);
}

function spawnEntityNotification(direction, text) {
    var p = document.createElement("p");
    p.innerText = text;

    p.classList.add("entity-notification");
    p.classList.add("note-" + direction);
    document.getElementById("player-notifications-container").appendChild(p);
    setTimeout(function () {
        p.classList.add("float-down");
    }, 100);
    setTimeout(function () {
        p.remove();
    }, 1100);
}

function spawnDamageNotification(text) {
    var p = document.createElement("p");
    p.innerText = text;
    p.classList.add("floating-damage");
    document.getElementById("player-notifications-container").appendChild(p);
    setTimeout(function () {
        p.classList.add("float-out-damage");
    }, 100);
    setTimeout(function () {
        p.remove();
    }, 1100);
}

function generateRoomEnemyPool(roomId) {
    var intensity = Math.floor(roomId / 4) + NUMBER_OF_ITEM_DROP_ENTITIES;
    var enemies = [];

    if (intensity < NUMBER_OF_ITEM_DROP_ENTITIES) {
        intensity = NUMBER_OF_ITEM_DROP_ENTITIES;
    }

    if (intensity >= ENTITY_BOSS) {
        intensity = ENTITY_BOSS - 1;
    }

    var lowest_enemy = intensity - 2;
    var low_enemy = intensity - 1;
    var avg_enemy = intensity;
    var high_enemy = intensity + 1;
    var highest_enemy = intensity + 2;
    if (lowest_enemy >= NUMBER_OF_ITEM_DROP_ENTITIES) {
        enemies.push(lowest_enemy);
        enemies.push(lowest_enemy);
    }
    if (low_enemy >= NUMBER_OF_ITEM_DROP_ENTITIES) {
        enemies.push(low_enemy);
        enemies.push(low_enemy);
        enemies.push(low_enemy);
    }
    enemies.push(avg_enemy);
    enemies.push(avg_enemy);
    enemies.push(avg_enemy);
    enemies.push(avg_enemy);
    enemies.push(avg_enemy);
    enemies.push(avg_enemy);
    if (high_enemy < ENTITY_BOSS) {
        enemies.push(high_enemy);
        enemies.push(high_enemy);
    }
    if (highest_enemy < ENTITY_BOSS) {
        enemies.push(highest_enemy);
    }
    return enemies;
}

function randomEnemy(room) {
    var enemies = room.enemyPool;
    for (var i = enemies.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref = [enemies[j], enemies[i]];
        enemies[i] = _ref[0];
        enemies[j] = _ref[1];
    }
    return new Entity(enemies[0]);
}

/** @param {Room} room
 * @returns {Entity[][]}   */
function generateRoomEntities(room) {
    var m = Array(room.height).fill(0);
    for (var i = 1; i < room.height - 1; i++) {
        m[i] = Array(room.width).fill(0);
        for (var j = 1; j < room.width - 1; j++) {
            if (i == room.midHeight && j == 1 || i == room.midHeight && j == room.width - 2 || i == 1 && j == room.midWidth || i == room.height - 2 && j == room.midWidth) {
                //dont spawn enemy in front of door
                m[i][j] = 0;
                continue;
            }
            //should probably switch to perlin noise
            if (Math.random() > 0.82) {
                m[i][j] = randomEnemy(room);
            } else {
                m[i][j] = new Entity(0);
            }
        }
    }
    return m;
}

function matchNeighboringDoors(x, y, walls) {
    var w = walls;
    var leftRoom = roomMap[y][x - 1];
    var rightRoom = roomMap[y][x + 1];
    var upRoom = roomMap[y - 1][x];
    var downRoom = roomMap[y + 1][x];
    if (leftRoom > 0 && rooms[leftRoom].walls.right == 2) {
        w.left = 2;
    }
    if (rightRoom > 0 && rooms[rightRoom].walls.left == 2) {
        w.right = 2;
    }
    if (upRoom > 0 && rooms[upRoom].walls.down == 2) {
        w.up = 2;
    }
    if (downRoom > 0 && rooms[downRoom].walls.up == 2) {
        w.down = 2;
    }

    return w;
}

function randomizeWalls() {
    var w = ["left", "up", "right", "down"];
    var sorter = function sorter(a, b) {
        return Math.random() > 0.5 ? 1 : -1;
    };
    w.sort(sorter);
    w.sort(sorter);
    return w;
}

function wallNeighborExists(direction, x, y) {
    switch (direction) {
        case "left":
            return roomMap[y][x - 1] != undefined && roomMap[y][x - 1] > 0;
        case "up":
            return roomMap[y][x - 1] != undefined && roomMap[y - 1][x] > 0;
        case "right":
            return roomMap[y][x - 1] != undefined && roomMap[y][x + 1] > 0;
        case "down":
            return roomMap[y][x - 1] != undefined && roomMap[y + 1][x] > 0;
    }
}

function createAdditionalDoors(walls, roomx, roomy) {
    var total_doors = walls.left + walls.right + walls.up + walls.down - 4;
    if (total_doors >= 4) {
        return walls;
    } // already maxed on doors
    var doorsToAdd = 4 - total_doors - Math.floor(Math.random() * 2);
    if (doorsToAdd == 0) {
        doorsToAdd = 1;
    }
    var w = randomizeWalls();
    for (var i = 0; doorsToAdd > 0; i++) {
        if (wallNeighborExists(w[i], roomx, roomy)) {
            // dont spawn a door here because we would already
            // have a door if there was one to connect to
            continue;
        } else {
            walls[w[i]] = 2;
            doorsToAdd--;
        }
    }
    return walls;
}

function createBossRoom(directionEntered, prevRoom) {
    var newX = prevRoom.x;
    var newY = prevRoom.y;
    var walls = { left: 1, right: 1, up: 1, down: 1 };
    switch (directionEntered) {
        case "right":
            newX++;break;
        case "left":
            newX--;break;
        case "up":
            newY--;break;
        case "down":
            newY++;break;
    }

    walls = matchNeighboringDoors(newX, newY, walls);

    var id = rooms.length;
    var newRoom = new Room(newX, newY, 7, 7, walls, id, true);
    roomMap[newY][newX] = id;
    newRoom.tiles = generateRoomTiles(newRoom, 1);
    newRoom.entities = Array(newRoom.height).fill(null).map(function (e) {
        return Array(newRoom.width).fill(0);
    });
    var boss = new Entity(ENTITY_BOSS);
    newRoom.entities[newRoom.midHeight][newRoom.midWidth] = boss;
    //@ts-ignore
    newRoom.boss = boss;
    rooms.push(newRoom);
    return newRoom;
}

function createRoom(directionEntered, prevRoom) {
    var newX = prevRoom.x;
    var newY = prevRoom.y;
    var walls = { left: 1, right: 1, up: 1, down: 1 };
    switch (directionEntered) {
        case "right":
            newX++;break;
        case "left":
            newX--;break;
        case "up":
            newY--;break;
        case "down":
            newY++;break;
    }

    walls = matchNeighboringDoors(newX, newY, walls);

    walls = createAdditionalDoors(walls, newX, newY);

    var id = rooms.length;
    var newRoom = new Room(newX, newY, Math.floor(Math.random() * 10) + MIN_ROOM_SIZE, Math.floor(Math.random() * 10) + MIN_ROOM_SIZE, walls, id);
    roomMap[newY][newX] = id;
    newRoom.enemyPool = generateRoomEnemyPool(id);
    newRoom.tiles = generateRoomTiles(newRoom);
    newRoom.entities = generateRoomEntities(newRoom);
    rooms.push(newRoom);
    return newRoom;
}

/** @param {string} directionEntered the direction player traveled to hit the door
 *  @param {Object} prevRoom the room player was in when they hit the door */
function enterNewDoor(directionEntered, prevRoom) {
    var newRoom = void 0;
    if (!bossSpawned && Math.floor(Math.random() * currentRoomId) > 4) {
        // create boss room
        newRoom = createBossRoom(directionEntered, prevRoom);
        bossSpawned = true;
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
function generateRoomTiles(room) {
    var forceTile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var height = room.height;
    var width = room.width;
    var m = Array(height);

    for (var i = 0; i < height; i++) {
        m[i] = Array(width);
        m[i][0] = TILE_WALL_LEFT;
        m[i][width - 1] = TILE_WALL_RIGHT;

        for (var j = 1; j < width - 1; j++) {
            if (i == 0) {
                m[i][j] = TILE_WALL_TOP;
            } else if (i == height - 1) {
                m[i][j] = TILE_WALL_BOTTOM;
            } else {
                m[i][j] = forceTile ? forceTile : floorTile();
            }
        }
    }

    // put in doors
    if (room.walls.left == WALL_WITH_DOOR) {
        m[room.midHeight][0] = TILE_DOOR_LEFT;
    }
    if (room.walls.right == WALL_WITH_DOOR) {
        m[room.midHeight][width - 1] = TILE_DOOR_RIGHT;
    }
    if (room.walls.up == WALL_WITH_DOOR) {
        m[0][room.midWidth] = TILE_DOOR_TOP;
    }
    if (room.walls.down == WALL_WITH_DOOR) {
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
    var x1 = Math.ceil(x - TILE_VISIBILITY / 2);
    var x2 = Math.ceil(x + TILE_VISIBILITY / 2);
    var y1 = Math.ceil(y - TILE_VISIBILITY / 2);
    var y2 = Math.ceil(y + TILE_VISIBILITY / 2);
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
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
    var x1 = Math.floor(x - TILE_VISIBILITY / 2 + 1);
    var x2 = Math.floor(x + TILE_VISIBILITY / 2 + 1);
    var y1 = Math.floor(y - TILE_VISIBILITY / 2 + 1);
    var y2 = Math.floor(y + TILE_VISIBILITY / 2 + 1);
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(ENTITY_NOTHING);
                continue;
            }
            t[i - y1].push(room.entities[i][j]);
        }
    }

    return t;
}

function getVisibleRooms(x, y) {
    var x1 = x - 2;
    var x2 = x + 3;
    var y1 = y - 2;
    var y2 = y + 3;
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > TOTAL_ROOMS_TALL - 1 || j > TOTAL_ROOMS_WIDE - 1) {
                t[i - y1].push(0);
                continue;
            }
            t[i - y1].push(roomMap[i][j]);
        }
    }

    return t;
}

/*
    Begin React stuff 
*/

function EntityCell(props) {
    var e = props.entity;
    if (e == ENTITY_NOTHING || e.type == ENTITY_NOTHING) {
        return React.createElement('div', { className: 'entity entity-0' });
    } else {
        var note = React.createElement('p', { className: 'entity-notification' });
        if (props.entity.notification && props.entity.notification !== "") {
            note = React.createElement(
                'p',
                { className: 'entity-notification float-down' },
                props.entity.notification
            );
        }
        return React.createElement(
            'div',
            { className: "entity entity-" + e.type + " facing-" + e.facing },
            note
        );
    }
}

function EntityRow(props) {
    var entityCells = props.entities.map(function (e, j) {
        return React.createElement(EntityCell, { key: '' + props.i + j, entity: e ? e : ENTITY_NOTHING });
    });
    return React.createElement(
        'div',
        { className: 'entity-row' },
        entityCells
    );
}

function EntityGrid(props) {
    var entityRows = props.entities.map(function (e, i) {
        return React.createElement(EntityRow, { key: i, i: i, entities: e });
    });
    return React.createElement(
        'div',
        { id: 'entity-grid', className: 'entity-grid' },
        entityRows
    );
}

function TileCell(props) {
    return React.createElement('div', { className: "tile tile-" + props.tile });
}

function TileRow(props) {
    var tileCells = props.tiles.map(function (e, j) {
        return React.createElement(TileCell, { key: '' + props.i + j, tile: e });
    });
    return React.createElement(
        'div',
        { className: 'tile-row' },
        tileCells
    );
}

function TileGrid(props) {
    var tileRows = props.tiles.map(function (e, i) {
        return React.createElement(TileRow, { key: i, i: i, tiles: e });
    });
    return React.createElement(
        'div',
        { id: 'tile-grid', className: 'tile-grid' },
        tileRows
    );
}

var UserInterface = function (_React$Component) {
    _inherits(UserInterface, _React$Component);

    function UserInterface(props) {
        _classCallCheck(this, UserInterface);

        var _this = _possibleConstructorReturn(this, (UserInterface.__proto__ || Object.getPrototypeOf(UserInterface)).call(this, props));

        _this.moveLeft = function (e) {
            _this.props.moveHandler("left");
        };
        _this.moveRight = function (e) {
            _this.props.moveHandler("right");
        };
        _this.moveUp = function (e) {
            _this.props.moveHandler("up");
        };
        _this.moveDown = function (e) {
            _this.props.moveHandler("down");
        };
        return _this;
    }

    _createClass(UserInterface, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'ui-overlay' },
                React.createElement(
                    'button',
                    { onClick: this.moveLeft, className: 'move-button', id: 'move-button-left' },
                    ' '
                ),
                React.createElement('button', { onClick: this.moveRight, className: 'move-button', id: 'move-button-right' }),
                React.createElement('button', { onClick: this.moveUp, className: 'move-button', id: 'move-button-up' }),
                React.createElement('button', { onClick: this.moveDown, className: 'move-button', id: 'move-button-down' }),
                React.createElement(
                    'p',
                    { className: 'ui-text', id: 'ui-player-hp' },
                    'HP:',
                    this.props.player.hp
                ),
                React.createElement(
                    'p',
                    { className: 'ui-text', id: 'ui-player-weapon' },
                    'ATK:',
                    this.props.player.weaponDamage
                ),
                React.createElement(
                    'p',
                    { className: "ui-text" + (this.props.boss ? "" : " invisible"), id: 'ui-boss-hp' },
                    'BOSS HP:',
                    this.props.boss ? this.props.boss.hp : ""
                ),
                React.createElement(
                    'p',
                    { className: 'ui-text', id: 'ui-player-level' },
                    'LVL:',
                    this.props.player.level
                ),
                React.createElement(
                    'p',
                    { className: 'ui-text', id: 'ui-player-xptnl' },
                    'XP-REQ:',
                    this.props.player.xptnl
                )
            );
        }
    }]);

    return UserInterface;
}(React.Component);

function GameOverInterface(props) {
    var alive = props.player.hp > 0;
    var victory = props.boss && props.boss.hp <= 0;
    var toggleScreen = alive || victory;
    return React.createElement(
        'div',
        { className: "game-over-screen-container " + (alive && !victory ? "invisible" : "") },
        React.createElement(
            'h1',
            { className: "dark-souls " + (alive || victory ? "invisible" : "") },
            'YOU DIED'
        ),
        React.createElement(
            'h1',
            { className: "dark-souls " + (victory && alive ? "" : "invisible") },
            'YOU WON'
        ),
        React.createElement(
            'button',
            { className: "respawn-button" + (alive && !victory ? " invisible" : ""), onClick: props.reset },
            'Try Again'
        )
    );
}

function PerqInterface(props) {
    if (!props.visible) {
        return null;
    }
    return React.createElement(
        'div',
        { id: 'perq-interface' },
        React.createElement(
            'p',
            { id: 'perq-caption' },
            'Choose a perquisite'
        ),
        React.createElement(
            'div',
            { onClick: function onClick() {
                    return props.choiceHandler('carbs');
                }, className: 'perq-choice', id: 'perq-carbs' },
            React.createElement('img', { src: 'http://error.diodeware.com/fcc/dungeon_crawler/food.png', className: 'perq-icon', id: 'perq-carbs-icon' }),
            React.createElement(
                'h3',
                { className: 'perq-title' },
                'Carboload'
            ),
            React.createElement(
                'p',
                { className: 'perq-description' },
                'Food heals for more'
            )
        ),
        React.createElement(
            'div',
            { onClick: function onClick() {
                    return props.choiceHandler('greed');
                }, className: 'perq-choice', id: 'perq-greed' },
            React.createElement('img', { src: 'http://error.diodeware.com/fcc/dungeon_crawler/bag.png', className: 'perq-icon', id: 'perq-greed-icon' }),
            React.createElement(
                'h3',
                { className: 'perq-title' },
                'Greediness'
            ),
            React.createElement(
                'p',
                { className: 'perq-description' },
                'Loot drops more often'
            )
        ),
        React.createElement(
            'div',
            { onClick: function onClick() {
                    return props.choiceHandler('armor');
                }, className: 'perq-choice', id: 'perq-armor' },
            React.createElement('img', { src: 'http://error.diodeware.com/fcc/dungeon_crawler/armor.png', className: 'perq-icon', id: 'perq-armor-icon' }),
            React.createElement(
                'h3',
                { className: 'perq-title' },
                'Armor'
            ),
            React.createElement(
                'p',
                { className: 'perq-description' },
                'Take less damage'
            )
        )
    );
}

function MiniMapRoom(props) {
    if (props.room == 0) {
        return React.createElement('div', { className: 'minimap-cell empty-cell' });
    }
    var room = rooms[props.room];

    return React.createElement(
        'div',
        { className: 'minimap-cell' },
        React.createElement('div', { className: "minimap-door minimap-door-up" + (room.walls.up == 2 ? " door-exists" : "") }),
        React.createElement('div', { className: "minimap-door minimap-door-down" + (room.walls.down == 2 ? " door-exists" : "") }),
        React.createElement('div', { className: "minimap-door minimap-door-left" + (room.walls.left == 2 ? " door-exists" : "") }),
        React.createElement('div', { className: "minimap-door minimap-door-right" + (room.walls.right == 2 ? " door-exists" : "") }),
        React.createElement('div', { className: "minimap-room" + (room.boss ? " boss-room" : "") })
    );
}

function MiniMapRow(props) {
    var minimapRooms = props.rooms.map(function (e) {
        return React.createElement(MiniMapRoom, { room: e });
    });
    return React.createElement(
        'div',
        { className: 'minimap-row' },
        minimapRooms
    );
}

function MiniMapGrid(props) {
    var minimapRows = props.rooms.map(function (e) {
        return React.createElement(MiniMapRow, { rooms: e });
    });
    return React.createElement(
        'div',
        { id: 'minimap-viewport' },
        React.createElement(
            'div',
            { id: 'minimap-grid' },
            minimapRows
        )
    );
}

var defaultAppState = {
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
    rooms: [[]],
    boss: false,
    perqTime: false
};

var App = function (_React$Component2) {
    _inherits(App, _React$Component2);

    function App(props) {
        _classCallCheck(this, App);

        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this2.state = defaultAppState;

        _this2.move = _this2.move.bind(_this2);

        _this2.handleKeyDowns = function (e) {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();_this2.setState({ facing: 'l' });break;
                case "ArrowRight":
                    e.preventDefault();_this2.setState({ facing: 'r' });break;
            }
        };

        _this2.handleKeyUps = function (e) {
            if (_this2.state.moving) {
                return;
            }
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();_this2.move("down");break;
                case "ArrowLeft":
                    e.preventDefault();_this2.move("left");break;
                case "ArrowUp":
                    e.preventDefault();_this2.move("up");break;
                case "ArrowRight":
                    e.preventDefault();_this2.move("right");break;
            }
        };

        _this2.resetGame = function (e) {
            resetGlobals();
            _this2.setState(defaultAppState);
            _this2.setState({
                tiles: getVisibleTiles(1, 5, rooms[1]),
                entities: getVisibleEntities(1, 5, rooms[1])
            });
        };

        _this2.perqOff = function (perq) {
            _this2.setState({
                perqTime: false
            });
            perqs[perq]++;
        };
        return _this2;
    }

    _createClass(App, [{
        key: 'playerDeath',
        value: function playerDeath() {
            this.setState(function (prevState) {
                return {
                    player: _extends({}, prevState.player, {
                        hp: 0,
                        weaponDamage: 0
                    }),
                    moving: true
                };
            });
        }

        /** @param {number} amount */

    }, {
        key: 'takeDamage',
        value: function takeDamage(amount) {
            amount = amount - perqs.armor;
            if (amount <= 0) {
                amount = 1;
            }
            spawnDamageNotification("-" + amount);
            var nextHp = this.state.player.hp - amount;
            if (nextHp <= 0) {
                this.playerDeath();
            } else {
                document.getElementById("tile-viewport").classList.add("damage");
                setTimeout(function () {
                    return document.getElementById("tile-viewport").classList.remove("damage");
                }, 300);
                this.setState(function (prevState) {
                    return { player: _extends({}, prevState.player, { hp: nextHp }) };
                });
            }
        }
    }, {
        key: 'gainXp',
        value: function gainXp(xpValue) {
            var p = this.state.player;
            p.xptnl = p.xptnl - xpValue;
            if (p.xptnl <= 0) {
                p.level = p.level + 1;
                p.xptnl = 3 + p.level;
                p.hp = p.hp + 3 + perqs.carbs;
                p.weaponDamage = p.weaponDamage + 1;
                spawnPlayerNotification("LEVEL UP");
                if (p.level % PERQ_FREQUENCY == 0) {
                    this.setState({ perqTime: true });
                }
            }
            this.setState({ player: p });
        }

        /** @param {Entity} enemyEntity */

    }, {
        key: 'fightEnemy',
        value: function fightEnemy(enemyEntity, direction) {
            var xp = enemyEntity.takeDamage(this.state.player.weaponDamage);
            spawnEntityNotification(direction, this.state.player.weaponDamage);
            if (enemyEntity.type == ENTITY_BOSS) {
                this.setState({ boss: enemyEntity });
            }
            if (xp) {
                this.gainXp(xp);
            }
            this.takeDamage(enemyEntity.attack);
        }
    }, {
        key: 'consumeFood',
        value: function consumeFood(foodEntity) {
            foodEntity.kill();
            var hp = this.state.player.hp + 3 + perqs.carbs;
            this.setState(function (prevState) {
                return { player: _extends({}, prevState.player, { hp: hp }) };
            });
            spawnPlayerNotification("HP UP");
        }
    }, {
        key: 'consumeUpgrade',
        value: function consumeUpgrade(upgradeEntity) {
            upgradeEntity.kill();
            var d = this.state.player.weaponDamage + 1;
            this.setState(function (prevState) {
                return { player: _extends({}, prevState.player, { weaponDamage: d }) };
            });
            spawnPlayerNotification("WEAPON UP");
        }

        /** @param {string} direction
         *  @param {Room} newRoom
         */

    }, {
        key: 'animateRoomChange',
        value: function animateRoomChange(direction, newRoom) {
            var newX = void 0;
            var newY = void 0;
            switch (direction) {
                case "left":
                    newX = newRoom.width - 2;newY = newRoom.midHeight;break;
                case "right":
                    newX = 1;newY = newRoom.midHeight;break;
                case "up":
                    newX = newRoom.midWidth;newY = newRoom.height - 2;break;
                case "down":
                    newX = newRoom.midWidth;newY = 1;break;
            }
            this.setState(function (prevState) {
                return {
                    tiles: getVisibleTiles(newX, newY, newRoom),
                    entities: getVisibleEntities(newX, newY, newRoom),
                    rooms: getVisibleRooms(newRoom.x, newRoom.y),
                    player: _extends({}, prevState.player, { x: newX, y: newY }),
                    boss: newRoom.boss
                };
            });
        }
    }, {
        key: 'enterDoor',
        value: function enterDoor(direction) {
            var prevRoom = rooms[currentRoomId];
            var newRoomX = prevRoom.x;
            var newRoomY = prevRoom.y;
            switch (direction) {
                case "left":
                    newRoomX--;break;
                case "right":
                    newRoomX++;break;
                case "up":
                    newRoomY--;break;
                case "down":
                    newRoomY++;break;
            }
            var nextRoomId = roomMap[newRoomY][newRoomX];
            if (nextRoomId == 0) {
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

    }, {
        key: 'interact',
        value: function interact(type, x, y, direction) {
            switch (type) {
                case "enemy":
                    this.fightEnemy(rooms[currentRoomId].entities[y][x], direction);break;
                case "door":
                    this.enterDoor(direction);break;
                case "upgrade":
                    this.consumeUpgrade(rooms[currentRoomId].entities[y][x]);break;
                case "food":
                    this.consumeFood(rooms[currentRoomId].entities[y][x]);break;
            }
            return false;
        }

        /** @param {string} direction */

    }, {
        key: 'move',
        value: function move(direction) {
            var _this3 = this;

            if (this.state.moving) {
                return;
            }
            if (this.state.ignoreNextMove) {
                return;
            }
            var opposite = void 0;
            var newX = this.state.player.x;
            var newY = this.state.player.y;
            var newF = this.state.facing;
            switch (direction) {
                case "left":
                    opposite = "right";newX--;newF = "l";break;
                case "right":
                    opposite = "left";newX++;newF = "r";break;
                case "up":
                    opposite = "down";newY--;break;
                case "down":
                    opposite = "up";newY++;break;
            }
            var collision = this.checkCollision(newX, newY);
            if (collision) {
                this.interact(collision, newX, newY, direction);
                if (collision == "enemy" || collision == "wall" || collision == "door") {
                    return;
                }
            }
            this.setState({ moving: true, facing: newF });

            document.getElementById("tile-grid").classList.add("translate-" + opposite);
            document.getElementById("entity-grid").classList.add("translate-" + opposite);

            setTimeout(function () {
                var p = _this3.state.player;
                _this3.setState(function (prevState) {
                    return _extends({}, prevState, {
                        player: _extends({}, prevState.player, { x: newX, y: newY }),
                        tiles: getVisibleTiles(newX, newY, rooms[currentRoomId]),
                        entities: getVisibleEntities(newX, newY, rooms[currentRoomId]),
                        moving: false
                    });
                });
                document.getElementById("tile-grid").className = "tile-grid";
                document.getElementById("entity-grid").className = "entity-grid";
            }, TRANSITION_SPEED);
        }
    }, {
        key: 'checkCollision',
        value: function checkCollision(x, y) {
            var room = rooms[currentRoomId];
            var tile = room.tiles[y][x];
            var entity = room.entities[y][x];
            if (tile == TILE_WALL_TOP || tile == TILE_WALL_BOTTOM || tile == TILE_WALL_RIGHT || tile == TILE_WALL_LEFT) {
                return "wall";
            }
            if (tile == TILE_DOOR_TOP || tile == TILE_DOOR_BOTTOM || tile == TILE_DOOR_RIGHT || tile == TILE_DOOR_LEFT) {
                return "door";
            }
            if (entity.type == ENTITY_UPGRADE) {
                return "upgrade";
            }
            if (entity.type == ENTITY_FOOD) {
                return "food";
            }
            if (entity.type == ENTITY_ZOMBIE || entity.type == ENTITY_RED_ZOMBIE || entity.type == ENTITY_ELF || entity.type == ENTITY_RED_ELF || entity.type == ENTITY_BOSS) {
                return "enemy";
            }
            return false;
        }
    }, {
        key: 'registerKeys',
        value: function registerKeys() {
            document.addEventListener("keyup", this.handleKeyUps);
            document.addEventListener("keydown", this.handleKeyDowns);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var p = this.state.player;
            var r = rooms[currentRoomId];
            this.setState({ tiles: getVisibleTiles(p.x, p.y, r),
                entities: getVisibleEntities(p.x, p.y, r),
                rooms: getVisibleRooms(r.x, r.y) });
            this.registerKeys();
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'app-container' },
                React.createElement(
                    'div',
                    { id: 'tile-viewport' },
                    React.createElement('div', { className: "character-sprite" + (this.state.facing == 'l' ? ' facing-left' : ' facing-right') + (this.state.moving ? ' moving' : '') }),
                    React.createElement('div', { id: 'player-notifications-container' }),
                    React.createElement(TileGrid, { tiles: this.state.tiles }),
                    React.createElement(EntityGrid, { entities: this.state.entities }),
                    React.createElement(MiniMapGrid, { rooms: this.state.rooms }),
                    React.createElement('div', { id: 'lighting-gradient-horizontal' }),
                    React.createElement('div', { id: 'lighting-gradient-vertical' }),
                    React.createElement(PerqInterface, { visible: this.state.perqTime, choiceHandler: this.perqOff }),
                    React.createElement(UserInterface, { moveHandler: this.move, player: this.state.player, boss: this.state.boss }),
                    React.createElement(GameOverInterface, { player: this.state.player, reset: this.resetGame, boss: this.state.boss })
                )
            );
        }
    }]);

    return App;
}(React.Component);

//@ts-ignore


ReactDOM.render(React.createElement(App, null), document.getElementById('root'));