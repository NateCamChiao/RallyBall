import { ANIMATION_DETAILS, ClientInputData, Coordinates, DIRECTION, getAnimationLoopDuration, KeybindMap, PhysicsState, PlayerStateLabels, SERVER } from "./constants.js";
import { PositionFunctions, PositionFunctionUtils } from "./positionFunctions.js";

export abstract class PlayerState{
    abstract playerStateLabel: PlayerStateLabels;
    keybinds: KeybindMap;
    dir: DIRECTION;
    lastPhysicsState: PhysicsState;
    lastTimestamp: number;
    constructor(keybinds: KeybindMap, direction: DIRECTION, lastPhysicsState: PhysicsState){
        this.keybinds = keybinds;
        this.dir = direction;
        this.lastPhysicsState = lastPhysicsState;
        this.lastTimestamp = Date.now();
    }

    onInput(inputData: ClientInputData): PlayerState | null {

        return null;
    }

    updatePhysics(): PlayerState | null {
        return null;
    }

    getPhysicsState(timeElapsed: number): PhysicsState{
        return this.lastPhysicsState;
    }

    getFinalPosition(): PhysicsState{
        return this.getPhysicsState(Date.now() - this.lastTimestamp);
    }

    getDefaultTimeoutBehavior(): {playerStateGetter: () => PlayerState, animationLength: number} {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.getFinalPosition()),
            animationLength: Infinity
        };
    }
    
}
export class IdleState extends PlayerState{
    playerStateLabel = PlayerStateLabels.Idle;
    lastKey: string;
    constructor(keybinds: KeybindMap, direction: DIRECTION, lastPhysicsState: PhysicsState, lastkey = ""){
        super(keybinds, direction, lastPhysicsState);
        this.lastKey = lastkey;
        this.lastPhysicsState.velocity.vx = 0;
        this.lastPhysicsState.velocity.vy = 0;
    }
    onInput(inputData: ClientInputData): PlayerState | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        if(keysHeld.has(this.keybinds.left)){
            return new RunningState(this.keybinds, DIRECTION.LEFT, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.right)){
            return new RunningState(this.keybinds, DIRECTION.RIGHT, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.down)){
            return new PassingState(this.keybinds, this.dir, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.up)){
            return new JumpingState(this.keybinds, this.dir, this.getFinalPosition());
        }
        return null;
    }
}

export class RunningState extends PlayerState{
    playerStateLabel = PlayerStateLabels.Running;
    lastState: PlayerStateLabels;
    constructor(keybinds: KeybindMap, direction:DIRECTION, lastPhysicsState: PhysicsState, lastPlayerState = PlayerStateLabels.Idle){
        super(keybinds, direction, lastPhysicsState);
        this.lastState = lastPlayerState;
    }
    onInput(inputData: ClientInputData): PlayerState | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        if(!keysHeld.has(this.keybinds.left) && !keysHeld.has(this.keybinds.right)){
            return new IdleState(this.keybinds, this.dir, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.left) && this.dir == DIRECTION.RIGHT){
            return new RunningState(this.keybinds, DIRECTION.LEFT, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.right) && this.dir == DIRECTION.LEFT){
            return new RunningState(this.keybinds, DIRECTION.RIGHT, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.up)){
            return new JumpingState(this.keybinds, this.dir, this.getFinalPosition(), true);
        }
        return null;
    }

    getPhysicsState(timeElapsed: number): PhysicsState {
        let newPosition: Coordinates = {x:0, y: this.lastPhysicsState.position.y}
        let maxPositionX = this.dir == DIRECTION.LEFT ? SERVER.netPos.bottom.x + SERVER.netPos.bottom.w - 0.03 : SERVER.netPos.bottom.x - SERVER.player.size + 0.03;
        newPosition.x = PositionFunctionUtils.millisToSec(timeElapsed) * SERVER.player.runningSpeed;
        if(this.dir == DIRECTION.LEFT){
            newPosition.x = -newPosition.x;
        }
        maxPositionX *= 200;
        newPosition.x += this.lastPhysicsState.position.x;
        if(this.dir == DIRECTION.LEFT && this.lastPhysicsState.position.x >= maxPositionX && timeElapsed> PositionFunctionUtils.timeFromDist(this.lastPhysicsState.position.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        else if(this.dir == DIRECTION.RIGHT && this.lastPhysicsState.position.x <= maxPositionX && timeElapsed > PositionFunctionUtils.timeFromDist(this.lastPhysicsState.position.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        return {
            position: newPosition,
            velocity: {vx: this.dir == DIRECTION.LEFT ? -SERVER.player.runningSpeed : SERVER.player.runningSpeed, vy: 0}
        }
    }
}

export class PassingState extends PlayerState{
    playerStateLabel = PlayerStateLabels.Passing;

    onInput(inputData: ClientInputData): PlayerState | null {
        let {keysDown, keysUp, keysHeld} = inputData;
        if(keysHeld.has(this.keybinds.down)){
            return new SettingState(this.keybinds, this.dir, this.getFinalPosition());
        }
        return null;
    }
    override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerState; animationLength: number; } {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.getFinalPosition()),
            animationLength: getAnimationLoopDuration(this.playerStateLabel)
        }
    }
}

export class SettingState extends PlayerState{
    playerStateLabel = PlayerStateLabels.Setting;

    onInput(inputData: ClientInputData): PlayerState | null {
        let {keysDown, keysUp, keysHeld} = inputData;

        if(keysHeld.has(this.keybinds.left)){
            //set ball left
        }
        else if(keysHeld.has(this.keybinds.right)){
            //set ball right
        }
        if(keysHeld.has(this.keybinds.up)){
            //tipping?
        }
        return null;
    }
    override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerState; animationLength: number; } {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.getFinalPosition()),
            animationLength: getAnimationLoopDuration(this.playerStateLabel)
        }
    }
}

export class JumpingState extends PlayerState{
    playerStateLabel = PlayerStateLabels.Jumping;
    hasMomentum: boolean;
    constructor(keybinds: KeybindMap, dir: DIRECTION,  lastPhysicsState: PhysicsState, hasMomentum = false){
        super(keybinds, dir, lastPhysicsState);
        this.hasMomentum = hasMomentum;
        this.lastTimestamp = Date.now();
        if(this.lastPhysicsState.velocity.vx != 0){
            this.lastPhysicsState.velocity.vx = Math.sign(this.lastPhysicsState.velocity.vx) * SERVER.player.jumpingForwardSpeed;
        }
        this.lastPhysicsState.velocity.vy = SERVER.player.jumpForce;

    }
    onInput(inputData: ClientInputData): PlayerState | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        let isOnGround: boolean;
        if(keysHeld.has(this.keybinds.left)){
            //long spike
            // return new RunningState(this.keybinds, DIRECTION.LEFT, this.getFinalPosition());
        }
        else if(keysHeld.has(this.keybinds.right)){
            //block
            // return new RunningState(this.keybinds, DIRECTION.RIGHT, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.down)){
            //sharp spike
            return new SpikingState(this.keybinds, this.dir, this.getFinalPosition());
        }
        if(keysHeld.has(this.keybinds.up)){
            //quick jump
        }
        return null;
    }

    getPhysicsState(timeElapsed: number): PhysicsState {
        let newPosition: Coordinates = {x:this.lastPhysicsState.position.x, y: this.lastPhysicsState.position.y};
        const jumpTime = 1 / ANIMATION_DETAILS.Jumping.fps * 7;
        let trajectoryData = PositionFunctionUtils.calculateTrajectory(
            {position: this.lastPhysicsState.position, velocity: {vx: this.lastPhysicsState.velocity.vx, vy: SERVER.player.jumpForce}}, 
            PositionFunctionUtils.millisToSec(timeElapsed) - jumpTime,
            SERVER.player.floorLevel, SERVER.player.gravity
        );
        if(PositionFunctionUtils.millisToSec(timeElapsed) >= jumpTime){
            newPosition = trajectoryData.coords;
        }
        return {
            position: PositionFunctionUtils.clampXPosition(newPosition, this.lastPhysicsState.position, this.dir),
            velocity: {vx: this.lastPhysicsState.velocity.vx, vy: this.lastPhysicsState.velocity.vy + SERVER.player.gravity * (PositionFunctionUtils.millisToSec(timeElapsed) - jumpTime)}
        }
    }

    override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerState; animationLength: number; } {
        let timeBeforeJump = 1 / ANIMATION_DETAILS.Jumping.fps * 7;
        //total time from start of jump to landing (including jump windup)
        let landingTime = PositionFunctionUtils.calculateTrajectory({position: this.lastPhysicsState.position, velocity: {vx: 0, vy: SERVER.player.jumpForce}}, 0, SERVER.player.floorLevel, SERVER.player.gravity).landingTime + timeBeforeJump;
        // let landingTime = 3; // todo 
        // console.log(this.lastPhysicsState(), PositionFunctionUtils.calculateTrajectory(this.lastPhysicsState().position, {vx: 0, vy: SERVER.player.jumpForce}, landingTime, SERVER.player.floorLevel, SERVER.player.gravity).coords.y);
        landingTime *= 1000; // convert from sec to millis
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.getFinalPosition()),
            animationLength: landingTime
        }
    }
}

export class FallingState extends PlayerState{
    playerStateLabel = PlayerStateLabels.Falling;
    constructor(keybinds: KeybindMap, dir: DIRECTION, lastPhysicsState: PhysicsState){
        super(keybinds, dir, lastPhysicsState);
    }
    onInput(inputData: ClientInputData): PlayerState | null{
        return null;
    }
    getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerState; animationLength: number; } {
        let landingTime = PositionFunctionUtils.calculateTrajectory(this.lastPhysicsState, 0, SERVER.player.floorLevel, SERVER.player.gravity).landingTime;
        // let landingTime = 3; // todo 
        // console.log(this.lastPhysicsState(), PositionFunctionUtils.calculateTrajectory(this.lastPhysicsState().position, {vx: 0, vy: SERVER.player.jumpForce}, landingTime, SERVER.player.floorLevel, SERVER.player.gravity).coords.y);
        landingTime *= 1000;
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.getFinalPosition()),
            animationLength: landingTime
        }
    }

    getPhysicsState(timeElapsed: number): PhysicsState {
        let newPosition = PositionFunctionUtils.calculateTrajectory(this.lastPhysicsState, PositionFunctionUtils.millisToSec(timeElapsed), SERVER.player.floorLevel, SERVER.player.gravity);
        // console.log(initialPosition, newPosition.coords);
        return {
            position: PositionFunctionUtils.clampXPosition(newPosition.coords, this.lastPhysicsState.position, this.dir),
            velocity: {vx: this.lastPhysicsState.velocity.vx, vy: this.lastPhysicsState.velocity.vy + SERVER.player.gravity * PositionFunctionUtils.millisToSec(timeElapsed)}
        }
    }
}

export class SpikingState extends PlayerState{
    playerStateLabel = PlayerStateLabels.Spiking;
    constructor(keybinds: KeybindMap, dir: DIRECTION, lastPhysicsState: PhysicsState){
        super(keybinds, dir, lastPhysicsState);
    }

    // getPhysicsState(timeElapsed: number): PhysicsState {
    //     return {
    //         position: this.lastPhysicsState.position,
    //         velocity: {vx: 0, vy: 0}
    //     }
    // }
    getPhysicsState(timeElapsed: number): PhysicsState {
        let newPosition = PositionFunctionUtils.calculateTrajectory(this.lastPhysicsState, PositionFunctionUtils.millisToSec(timeElapsed), SERVER.player.floorLevel, SERVER.player.gravity);
        // console.log(initialPosition, newPosition.coords);
        return {
            position: PositionFunctionUtils.clampXPosition(newPosition.coords, this.lastPhysicsState.position, this.dir),
            velocity: {vx: this.lastPhysicsState.velocity.vx, vy: this.lastPhysicsState.velocity.vy + SERVER.player.gravity * PositionFunctionUtils.millisToSec(timeElapsed)}
        }
    }

    getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerState; animationLength: number; } {
        return {
            playerStateGetter: () => new FallingState(this.keybinds, this.dir, this.getFinalPosition()),
            animationLength: getAnimationLoopDuration(this.playerStateLabel)
        }
    }
}