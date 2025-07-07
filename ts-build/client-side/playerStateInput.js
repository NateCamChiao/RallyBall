import { DIRECTION, getAnimationLoopDuration, PlayerStates } from "./constants.js";
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
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
            animationLength: Infinity
        };
    }
}
export class IdleState extends PlayerStateInput {
    playerState = PlayerStates.Idle;
    lastKey;
    constructor(keybinds, direction, lastkey = "") {
        super(keybinds, direction);
        this.lastKey = lastkey;
    }
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        if (keysHeld.has(this.keybinds.left)) {
            return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        if (keysHeld.has(this.keybinds.right)) {
            return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if (keysHeld.has(this.keybinds.down)) {
            return new PassingState(this.keybinds, this.dir);
        }
        if (keysHeld.has(this.keybinds.up)) {
            return new JumpingState(this.keybinds, this.dir);
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
        if (!keysHeld.has(this.keybinds.left) && !keysHeld.has(this.keybinds.right)) {
            return new IdleState(this.keybinds, this.dir);
        }
        if (keysHeld.has(this.keybinds.left) && this.dir == DIRECTION.RIGHT) {
            return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        if (keysHeld.has(this.keybinds.right) && this.dir == DIRECTION.LEFT) {
            return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if (keysHeld.has(this.keybinds.up)) {
            return new JumpingState(this.keybinds, this.dir, true);
        }
        return null;
    }
}
export class PassingState extends PlayerStateInput {
    playerState = PlayerStates.Passing;
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        if (keysHeld.has(this.keybinds.down)) {
            return new SettingState(this.keybinds, this.dir);
        }
        return null;
    }
    getDefaultTimeoutBehavior() {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
            animationLength: getAnimationLoopDuration(this.playerState)
        };
    }
}
export class SettingState extends PlayerStateInput {
    playerState = PlayerStates.Setting;
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        if (keysHeld.has(this.keybinds.left)) {
            //set ball left
        }
        else if (keysHeld.has(this.keybinds.right)) {
            //set ball right
        }
        if (keysHeld.has(this.keybinds.up)) {
            //tipping?
        }
        return null;
    }
    getDefaultTimeoutBehavior() {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
            animationLength: getAnimationLoopDuration(this.playerState)
        };
    }
}
export class JumpingState extends PlayerStateInput {
    playerState = PlayerStates.Jumping;
    hasMomentum;
    constructor(keybinds, dir, hasMomentum = false) {
        super(keybinds, dir);
        this.hasMomentum = hasMomentum;
    }
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        let isOnGround;
        if (keysHeld.has(this.keybinds.left)) {
            //long spike
            // return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        else if (keysHeld.has(this.keybinds.right)) {
            //block
            // return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if (keysHeld.has(this.keybinds.down)) {
            //sharp spike
            return new SpikingState(this.keybinds, this.dir);
        }
        if (keysHeld.has(this.keybinds.up)) {
            //quick jump
        }
        return null;
    }
}
export class FallingState extends PlayerStateInput {
    playerState = PlayerStates.Falling;
    constructor(keybinds, dir) {
        super(keybinds, dir);
    }
    onInput(inputData) {
        return null;
    }
    getDefaultTimeoutBehavior() {
        let timeUntilLanding = 1000; //TODO change this later 
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
            animationLength: timeUntilLanding
        };
    }
}
export class SpikingState extends PlayerStateInput {
    playerState = PlayerStates.Spiking;
    constructor(keybinds, dir) {
        super(keybinds, dir);
    }
    getDefaultTimeoutBehavior() {
        return {
            playerStateGetter: () => new FallingState(this.keybinds, this.dir),
            animationLength: getAnimationLoopDuration(this.playerState)
        };
    }
}
