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
export const POSITION_FUNCTIONS = {
    Idle: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Running: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Jumping: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Spiking: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Passing: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Setting: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Blocking: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Stepback: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Falling: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    Diving: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
    JumpServeTossing: function (coords, dir, t) {
        return { x: coords.x, y: coords.y };
    },
};
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
export const CLIENT_RENDERING = {
    Idle: {
        animation: ANIMATION_DETAILS.Idle,
        position: POSITION_FUNCTIONS.Idle
    },
    Running: {
        animation: ANIMATION_DETAILS.Running,
        position: POSITION_FUNCTIONS.Running
    },
    Passing: {
        animation: ANIMATION_DETAILS.Passing,
        position: POSITION_FUNCTIONS.Passing
    },
    Jumping: {
        animation: ANIMATION_DETAILS.Jumping,
        position: POSITION_FUNCTIONS.Jumping
    },
    Setting: {
        animation: ANIMATION_DETAILS.Setting,
        position: POSITION_FUNCTIONS.Setting
    },
    Spiking: {
        animation: ANIMATION_DETAILS.Spiking,
        position: POSITION_FUNCTIONS.Spiking
    },
    Blocking: {
        animation: ANIMATION_DETAILS.Blocking,
        position: POSITION_FUNCTIONS.Blocking
    },
    Stepback: {
        animation: ANIMATION_DETAILS.Stepback,
        position: POSITION_FUNCTIONS.Stepback
    },
    Falling: {
        animation: ANIMATION_DETAILS.Falling,
        position: POSITION_FUNCTIONS.Falling
    },
    Diving: {
        animation: ANIMATION_DETAILS.Diving,
        position: POSITION_FUNCTIONS.Diving
    },
    JumpServeTossing: {
        animation: ANIMATION_DETAILS.JumpServeTossing,
        position: POSITION_FUNCTIONS.JumpServeTossing
    },
};
export const PERFECT_SCALING_RATIO = 1.8;
export const SCALING_UNIT_TO_PLAYER_SIZE = 0.17; //multiply by scaling unit to get player size
export const PLAYER_FRAME_WIDTH = 100; // width on sprite map
export const PLAYER_ANIMATION = {
    FRAME_WIDTH: 100, //width of player in assets
    WIDTH: 0,
    HEIGHT: 0
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
