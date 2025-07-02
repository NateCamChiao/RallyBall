import { DIRECTION, getCycleTime, PlayerStates } from "./constants.js";
export class PlayerStateInput {
    keybinds;
    dir;
    constructor(keybinds, direction) {
        this.keybinds = keybinds;
        this.dir = direction;
    }
    onInput(inputData) {
        return null;
    }
    getDefaultTimeoutBehavior() {
        return {
            playerState: new IdleState(this.keybinds, this.dir),
            animationLength: Infinity
        };
    }
}
export class IdleState extends PlayerStateInput {
    playerState = PlayerStates.Idle;
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        console.log(keysHeld);
        if (keysHeld.has(this.keybinds.left)) {
            return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        else if (keysHeld.has(this.keybinds.right)) {
            return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if (keysHeld.has(this.keybinds.down)) {
            return new PassingState(this.keybinds, this.dir);
        }
        return null;
    }
}
export class RunningState extends PlayerStateInput {
    playerState = PlayerStates.Running;
    lastState;
    constructor(keybinds, direction, lastPlayerState = PlayerStates.Idle) {
        super(keybinds, direction);
        this.lastState = lastPlayerState;
    }
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        console.log(keysHeld);
        if (!keysHeld.has(this.keybinds.left) && !keysHeld.has(this.keybinds.right)) {
            return new IdleState(this.keybinds, this.dir);
        }
        return null;
    }
}
export class PassingState extends PlayerStateInput {
    playerState = PlayerStates.Passing;
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        return null;
    }
    getDefaultTimeoutBehavior() {
        console.log(getCycleTime(this.playerState));
        return {
            playerState: new IdleState(this.keybinds, this.dir),
            animationLength: getCycleTime(this.playerState)
        };
    }
}
