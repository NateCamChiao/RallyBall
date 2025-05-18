"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIRECTION = exports.PLAYER_ANIMATION = exports.PLAYER_FRAME_WIDTH = exports.PERFECT_SCALING_RATIO = exports.ANIMATION_DETAILS = exports.PHYSICS_FUNCTIONS = void 0;
exports.PHYSICS_FUNCTIONS = {
    Idle: function (x, y, t) {
        return { x: x, y: y };
    },
    Running: function (x, y, t) {
        return {
            x: 0,
            y: 0
        };
    },
    Jumping: function (x, y, t) {
        return {
            x: 0,
            y: 0
        };
    },
    Spiking: function (x, y, t) {
        return {
            x: 0,
            y: 0
        };
    },
    Passing: function (x, y, t) {
        return {
            x: 0,
            y: 0
        };
    }
};
exports.ANIMATION_DETAILS = {
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
exports.PERFECT_SCALING_RATIO = 1.8;
exports.PLAYER_FRAME_WIDTH = 100; // width on sprite map
exports.PLAYER_ANIMATION = {
    FRAME_WIDTH: 100,
    WIDTH: 0,
    HEIGHT: 0
};
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
    DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
})(DIRECTION || (exports.DIRECTION = DIRECTION = {}));
