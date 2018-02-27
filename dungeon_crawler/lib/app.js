'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//@ts-check

var TILE_VISIBILITY = 11;

var TRANSITION_SPEED = 180;

var Entity = function () {
    /** @param {number} t */
    function Entity(t) {
        _classCallCheck(this, Entity);

        this.facing = Math.random() > 0.5 ? 'r' : 'l';
        this.type = t;
        this.hp = 0;
        this.attack = 0;
        this.xpvalue = 0;
        switch (t) {
            case 3:
                this.hp = 2;this.attack = 1;this.xpvalue = 1;break;
            case 4:
                this.hp = 10;this.attack = 5;this.xpvalue = 4;break;
            case 5:
                this.hp = 20;this.attack = 10;this.xpvalue = 8;break;
            case 6:
                this.hp = 30;this.attack = 15;this.xpvalue = 16;break;
            case 7:
                this.hp = 100;this.attack = 20;break;
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
            var baseChance = 0.15;
            var droppedAnthing = Math.random() < baseChance + perqs.greed / 10;
            if (droppedAnthing) {
                var drop = Math.floor(Math.random() * 2);
                switch (drop) {
                    case 0:
                        return 1; // dmg up
                    case 1:
                        return 2; // hp up
                    default:
                        return 0; // nada
                }
            } else {
                return 0;
            }
        }
    }, {
        key: 'kill',
        value: function kill() {
            this.type = 0;
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
    this.width = width;
    this.walls = walls;
    this.id = id;
    this.tiles = [[0]];
    this.entities = [[]];
    this.boss = boss;
};

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

function resetGlobals() {
    roomMap = Array(11).fill(null).map(function (e) {
        return Array(11).fill(0);
    });
    roomMap[5][5] = 1;
    rooms = [new Room(0, 0, 0, 0, {}, 0)];
    rooms.push(new Room(5, 5, 10, 10, { right: 2, left: 1, up: 1, down: 1 }, 1));
    rooms[1].tiles = generateRoomTiles(rooms[1]);
    rooms[1].entities = generateRoomEntities(rooms[1]);
    currentRoomId = 1;
    perqs = {
        carbs: 0,
        greed: 0,
        armor: 0
    };
}

resetGlobals();

/** @param {Room} room
 * @returns {Entity[][]}   */
function generateRoomEntities(room) {
    var m = Array(room.height).fill(0);
    for (var i = 1; i < room.height - 1; i++) {
        m[i] = Array(room.width).fill(0);
        for (var j = 1; j < room.width - 1; j++) {
            if (i == Math.floor(room.height / 2) && j == 1 || i == Math.floor(room.height / 2) && j == room.width - 2 || i == 1 && j == Math.floor(room.width / 2) || i == room.height - 2 && j == Math.floor(room.width / 2)) {
                //dont spawn enemy in front of door
                m[i][j] = 0;
                continue;
            }
            //should probably switch to perlin noise
            m[i][j] = Math.random() > 0.85 ? new Entity(Math.floor(Math.random() * 4) + 3) : 0;
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

// this algorithm is borked and spawns too many doors, but my brain is tired
function createAdditionalDoors(walls) {
    var doorsToPlace = 2 + Math.floor(Math.random() * 2);
    var w = ["left", "right", "up", "down"];
    for (var _i = w.length - 1; _i > 0; _i--) {
        var j = Math.floor(Math.random() * (_i + 1));
        var _ref = [w[j], w[_i]];
        w[_i] = _ref[0];
        w[j] = _ref[1];
    }
    var i = 0;
    while (doorsToPlace > 0) {
        var wallToCheck = walls[w[i]];
        if (wallToCheck == 2) {
            doorsToPlace--;
        } else {
            walls[w[i]] = 2;
            doorsToPlace--;
        }
        if (i > 4) {
            console.log("Somethings wrong with door placement.");
            break;
        }
        i++;
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
    var newRoom = new Room(newX, newY, Math.floor(Math.random() * 10) + 6, Math.floor(Math.random() * 10) + 6, walls, id, true);
    roomMap[newY][newX] = id;
    newRoom.tiles = generateRoomTiles(newRoom, 1);
    newRoom.entities = Array(newRoom.height).fill(null).map(function (e) {
        return Array(newRoom.width).fill(0);
    });
    var boss = new Entity(7);
    newRoom.entities[Math.floor(newRoom.height / 2)][Math.floor(newRoom.width / 2)] = boss;
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

    walls = createAdditionalDoors(walls);

    var id = rooms.length;
    var newRoom = new Room(newX, newY, Math.floor(Math.random() * 10) + 6, Math.floor(Math.random() * 10) + 6, walls, id);
    roomMap[newY][newX] = id;
    newRoom.tiles = generateRoomTiles(newRoom);
    newRoom.entities = generateRoomEntities(newRoom);
    rooms.push(newRoom);
    return newRoom;
}

/** @param {string} directionEntered the direction player traveled to hit the door
 *  @param {Object} prevRoom the room player was in when they hit the door */
function enterNewDoor(directionEntered, prevRoom) {
    var newRoom = void 0;
    if (Math.floor(Math.random() * currentRoomId) > 4) {
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
    return Math.floor(Math.random() * 4);
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
        m[i][0] = 8;
        m[i][width - 1] = 9;

        for (var j = 1; j < width - 1; j++) {
            if (i == 0) {
                m[i][j] = 6;
            } else if (i == height - 1) {
                m[i][j] = 7;
            } else {
                m[i][j] = forceTile ? forceTile : floorTile();
            }
        }
    }

    // put in doors
    if (room.walls.left == 2) {
        m[Math.floor(height / 2)][0] = 14;
    }
    if (room.walls.right == 2) {
        m[Math.floor(height / 2)][width - 1] = 17;
    }
    if (room.walls.up == 2) {
        m[0][Math.floor(width / 2)] = 15;
    }
    if (room.walls.down == 2) {
        m[height - 1][Math.floor(width / 2)] = 16;
    }

    // put in corners
    m[0][0] = 10;
    m[0][width - 1] = 11;
    m[height - 1][0] = 12;
    m[height - 1][width - 1] = 13;

    return m;
}

/** 
 * @param {number} x
 * @param {number} y
 * @param {Room} room
 * @returns {number[][]}
 */
function getVisibleTiles(x, y, room) {
    var x1 = Math.floor(x - TILE_VISIBILITY / 2) + 1;
    var x2 = Math.floor(x + TILE_VISIBILITY / 2) + 1;
    var y1 = Math.floor(y - TILE_VISIBILITY / 2) + 1;
    var y2 = Math.floor(y + TILE_VISIBILITY / 2) + 1;
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
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
 * @param {Room} room
 * @returns {number[][]}
 */
function getVisibleEntities(x, y, room) {
    var x1 = Math.floor(x - TILE_VISIBILITY / 2) + 1;
    var x2 = Math.floor(x + TILE_VISIBILITY / 2) + 1;
    var y1 = Math.floor(y - TILE_VISIBILITY / 2) + 1;
    var y2 = Math.floor(y + TILE_VISIBILITY / 2) + 1;
    var t = [];

    for (var i = y1; i < y2; i++) {
        t.push([]);
        for (var j = x1; j < x2; j++) {
            if (i < 0 || j < 0 || i > room.height - 1 || j > room.width - 1) {
                t[i - y1].push(0);
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
    var e = props.entity;
    if (e == 0 || e.type == 0) {
        return React.createElement('div', { className: 'entity entity-0' });
    } else {
        return React.createElement('div', { className: "entity entity-" + e.type + " facing-" + e.facing });
    }
}

function EntityRow(props) {
    var entityCells = props.entities.map(function (e, j) {
        return React.createElement(EntityCell, { key: '' + props.i + j, entity: e ? e : 0 });
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
        value: function gainXp() {
            var p = this.state.player;
            p.xptnl--;
            if (p.xptnl <= 0) {
                p.level = p.level + 1;
                p.xptnl = Math.round(Math.log(p.level) * 5);
                p.hp = p.hp + 3;
                p.weaponDamage = p.weaponDamage + 1;
                spawnPlayerNotification("LEVEL UP");
                if (p.level % 5 == 0) {
                    this.setState({ perqTime: true });
                }
            }
            this.setState({ player: p });
        }

        /** @param {Entity} enemyEntity */

    }, {
        key: 'fightEnemy',
        value: function fightEnemy(enemyEntity) {
            var slain = enemyEntity.takeDamage(this.state.player.weaponDamage);
            if (enemyEntity.type == 2) {
                this.setState({ boss: enemyEntity });
            }
            if (slain) {
                this.gainXp();
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
    }, {
        key: 'animateRoomChange',
        value: function animateRoomChange(direction, newRoom) {
            var newX = void 0;
            var newY = void 0;
            switch (direction) {
                case "left":
                    newX = newRoom.width - 2;newY = Math.floor(newRoom.height / 2);break;
                case "right":
                    newX = 1;newY = Math.floor(newRoom.height / 2);break;
                case "up":
                    newX = Math.floor(newRoom.width / 2);newY = newRoom.height - 2;break;
                case "down":
                    newX = Math.floor(newRoom.width / 2);newY = 1;break;
            }
            this.setState(function (prevState) {
                return {
                    tiles: getVisibleTiles(newX, newY, newRoom),
                    entities: getVisibleEntities(newX, newY, newRoom),
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
                    this.fightEnemy(rooms[currentRoomId].entities[y][x]);break;
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
            if (tile == 6 || tile == 7 || tile == 8 || tile == 9) {
                return "wall";
            }
            if (tile == 14 || tile == 15 || tile == 16 || tile == 17) {
                return "door";
            }
            if (entity.type == 3) {
                return "upgrade";
            }
            if (entity.type == 4) {
                return "food";
            }
            if (entity.type == 1 || entity.type == 2) {
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
            this.setState({ tiles: getVisibleTiles(this.state.player.x, this.state.player.y, rooms[currentRoomId]),
                entities: getVisibleEntities(this.state.player.x, this.state.player.y, rooms[currentRoomId]) });
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