import { ANIMATION_DETAILS, DIRECTION, getAnimationLoopDuration, PlayerStates, SERVER } from "./constants.js";
import { PositionFunctionUtils } from "./positionFunctions.js";
export class PlayerStateInput {
    keybinds;
    dir;
    motionSupplier;
    constructor(keybinds, direction, motionSupplier) {
        this.keybinds = keybinds;
        this.dir = direction;
        this.motionSupplier = motionSupplier;
    }
    onInput(inputData) {
        return null;
    }
    getDefaultTimeoutBehavior() {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: Infinity
        };
    }
}
export class IdleState extends PlayerStateInput {
    playerState = PlayerStates.Idle;
    lastKey;
    constructor(keybinds, direction, motionSupplier, lastkey = "") {
        super(keybinds, direction, motionSupplier);
        this.lastKey = lastkey;
    }
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        if (keysHeld.has(this.keybinds.left)) {
            return new RunningState(this.keybinds, DIRECTION.LEFT, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.right)) {
            return new RunningState(this.keybinds, DIRECTION.RIGHT, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.down)) {
            return new PassingState(this.keybinds, this.dir, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.up)) {
            return new JumpingState(this.keybinds, this.dir, this.motionSupplier);
        }
        return null;
    }
}
export class RunningState extends PlayerStateInput {
    playerState = PlayerStates.Running;
    lastState;
    constructor(keybinds, direction, motionSupplier, lastPlayerState = PlayerStates.Idle) {
        super(keybinds, direction, motionSupplier);
        this.lastState = lastPlayerState;
    }
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        if (!keysHeld.has(this.keybinds.left) && !keysHeld.has(this.keybinds.right)) {
            return new IdleState(this.keybinds, this.dir, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.left) && this.dir == DIRECTION.RIGHT) {
            return new RunningState(this.keybinds, DIRECTION.LEFT, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.right) && this.dir == DIRECTION.LEFT) {
            return new RunningState(this.keybinds, DIRECTION.RIGHT, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.up)) {
            return new JumpingState(this.keybinds, this.dir, this.motionSupplier, true);
        }
        return null;
    }
}
export class PassingState extends PlayerStateInput {
    playerState = PlayerStates.Passing;
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        if (keysHeld.has(this.keybinds.down)) {
            return new SettingState(this.keybinds, this.dir, this.motionSupplier);
        }
        return null;
    }
    getDefaultTimeoutBehavior() {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
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
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: getAnimationLoopDuration(this.playerState)
        };
    }
}
export class JumpingState extends PlayerStateInput {
    playerState = PlayerStates.Jumping;
    hasMomentum;
    constructor(keybinds, dir, motionSupplier, hasMomentum = false) {
        super(keybinds, dir, motionSupplier);
        this.hasMomentum = hasMomentum;
    }
    onInput(inputData) {
        let { keysDown, keysUp, keysHeld } = inputData;
        let isOnGround;
        if (keysHeld.has(this.keybinds.left)) {
            //long spike
            // return new RunningState(this.keybinds, DIRECTION.LEFT, this.motionSupplier);
        }
        else if (keysHeld.has(this.keybinds.right)) {
            //block
            // return new RunningState(this.keybinds, DIRECTION.RIGHT, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.down)) {
            //sharp spike
            return new SpikingState(this.keybinds, this.dir, this.motionSupplier);
        }
        if (keysHeld.has(this.keybinds.up)) {
            //quick jump
        }
        return null;
    }
    getDefaultTimeoutBehavior() {
        let timeBeforeJump = 1 / ANIMATION_DETAILS.Jumping.fps * 7;
        //total time from start of jump to landing (including jump windup)
        let landingTime = PositionFunctionUtils.calculateTrajectory(this.motionSupplier().position, { vx: 0, vy: SERVER.player.jumpForce }, 0, SERVER.player.floorLevel, SERVER.player.gravity).landingTime + timeBeforeJump;
        console.log(this.motionSupplier(), PositionFunctionUtils.calculateTrajectory(this.motionSupplier().position, { vx: 0, vy: SERVER.player.jumpForce }, landingTime, SERVER.player.floorLevel, SERVER.player.gravity).coords.y);
        landingTime *= 1000; // convert from sec to millis
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: landingTime
        };
    }
}
export class FallingState extends PlayerStateInput {
    playerState = PlayerStates.Falling;
    constructor(keybinds, dir, motionSupplier) {
        super(keybinds, dir, motionSupplier);
    }
    onInput(inputData) {
        return null;
    }
    getDefaultTimeoutBehavior() {
        let timeUntilLanding = 1000; //TODO change this later 
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: timeUntilLanding
        };
    }
}
export class SpikingState extends PlayerStateInput {
    playerState = PlayerStates.Spiking;
    constructor(keybinds, dir, motionSupplier) {
        super(keybinds, dir, motionSupplier);
    }
    getDefaultTimeoutBehavior() {
        return {
            playerStateGetter: () => new FallingState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: getAnimationLoopDuration(this.playerState)
        };
    }
}
