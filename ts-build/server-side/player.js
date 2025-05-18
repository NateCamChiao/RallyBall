"use strict";
// enum DIRECTION = {
//     LEFT: 0,
//     RIGHT: 0
// }
Object.defineProperty(exports, "__esModule", { value: true });
class StateHandler {
    constructor() {
        this.playerState;
        this.player;
    }
}
class ServerPlayer {
    constructor() {
        this.name;
        this.id;
        this.position = {
            x: 0,
            y: 0,
            facing: DIRECTION.LEFT
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.stateHandler = new StateHandler();
    }
}
