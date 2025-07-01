export var PlayerStates;
(function (PlayerStates) {
    PlayerStates["Idle"] = "Idle";
    PlayerStates["Running"] = "Running";
    PlayerStates["Passing"] = "Passing";
    PlayerStates["Jumping"] = "Jumping";
    PlayerStates["Setting"] = "Setting";
    PlayerStates["Spiking"] = "Spiking";
    PlayerStates["Blocking"] = "Blocking";
    PlayerStates["Stepback"] = "Stepback";
    PlayerStates["Falling"] = "Falling";
    PlayerStates["Diving"] = "Diving";
    PlayerStates["JumpServeTossing"] = "JumpServeTossing";
})(PlayerStates || (PlayerStates = {}));
/*
todo delete this
ball positioning for later
Ball: function(coords: Coordinates, velocity: {vx: number, vy: number}, t:any): Coordinates{
        return {x: coords.x, y: coords.y};
    },
*/
export const calculateGravity = (yInitial, gravity, time) => {
    return {
        x: 0,
        y: 0
    };
};
export const ANIMATION_DETAILS = {
    Idle: {
        maxFrame: 4,
        mapRow: 1,
        fps: 10
    },
    Running: {
        maxFrame: 8,
        mapRow: 0,
        fps: 16
    },
    Passing: {
        maxFrame: 7,
        mapRow: 2,
        fps: 50
    },
    Jumping: {
        maxFrame: 8,
        mapRow: 3,
        fps: 12
    },
    Setting: {
        maxFrame: 6,
        mapRow: 7,
        fps: 14
    },
    Spiking: {
        maxFrame: 8,
        mapRow: 4,
        fps: 20
    },
    Blocking: {
        maxFrame: 5,
        mapRow: 8,
        fps: 14
    },
    Stepback: {
        maxFrame: 3,
        mapRow: 0,
        fps: 0
    },
    Falling: {
        freezeFrame: 7,
        maxFrame: 1,
        mapRow: 4,
        fps: 0
    },
    Diving: {
        maxFrame: 8,
        mapRow: 6,
        fps: 10
    },
    JumpServeTossing: {
        maxFrame: 7,
        mapRow: 9,
        fps: 0
    },
};
export const PERFECT_SCALING_RATIO = 1.8;
export const SCALING_UNIT_TO_PLAYER_SIZE = 0.17; //multiply by scaling unit to get player size
export const PLAYER_FRAME_WIDTH = 100; // width on sprite map
export const PLAYER_ANIMATION = {
    FRAME_WIDTH: 100, //width of player in assets
    WIDTH: 0,
    HEIGHT: 0,
    NAME_CONST: {
        NAME_RATIO_TO_SCALING_UNIT: 25 / 1638,
        LEFT_AMOUNT_BY_PLAYER_SIZE: -0.05,
        DOWN_AMOUNT_BY_PLAYER_SIZE: 0.15
    }
};
export var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
    DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
})(DIRECTION || (DIRECTION = {}));
export var GAMESTATES;
(function (GAMESTATES) {
    GAMESTATES[GAMESTATES["QUEING"] = 0] = "QUEING";
    GAMESTATES[GAMESTATES["SERVING"] = 1] = "SERVING";
    GAMESTATES[GAMESTATES["PLAYING"] = 2] = "PLAYING";
    GAMESTATES[GAMESTATES["PAUSED"] = 3] = "PAUSED";
    GAMESTATES[GAMESTATES["ENDED"] = 4] = "ENDED";
    GAMESTATES[GAMESTATES["SANDBOX"] = 5] = "SANDBOX";
})(GAMESTATES || (GAMESTATES = {}));
export var PLAYERTYPE;
(function (PLAYERTYPE) {
    PLAYERTYPE[PLAYERTYPE["REAL"] = 0] = "REAL";
    PLAYERTYPE[PLAYERTYPE["ONLINE"] = 1] = "ONLINE";
    PLAYERTYPE[PLAYERTYPE["AI"] = 2] = "AI";
    PLAYERTYPE[PLAYERTYPE["DUMMY"] = 3] = "DUMMY";
})(PLAYERTYPE || (PLAYERTYPE = {}));
