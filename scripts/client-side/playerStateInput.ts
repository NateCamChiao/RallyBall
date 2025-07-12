import { ANIMATION_DETAILS, ClientInputData, DIRECTION, getAnimationLoopDuration, KeybindMap, MotionSupplier, PlayerStates, SERVER } from "./constants.js";
import { PositionFunctionUtils } from "./positionFunctions.js";

interface PlayerStateInputLogic{
    playerState: PlayerStates;
    onInput: (inputData: ClientInputData) => PlayerStateInput | null;
    getDefaultTimeoutBehavior: () => {playerStateGetter: () => PlayerStateInput, animationLength: number}
}
export abstract class PlayerStateInput implements PlayerStateInputLogic{
    abstract playerState: PlayerStates;
    keybinds: KeybindMap;
    dir: DIRECTION;
    motionSupplier: MotionSupplier;
    constructor(keybinds: KeybindMap, direction: DIRECTION, motionSupplier: MotionSupplier){
        this.keybinds = keybinds;
        this.dir = direction;
        this.motionSupplier = motionSupplier;
    }

    onInput(inputData: ClientInputData): PlayerStateInput | null {

        return null;
    }
    getDefaultTimeoutBehavior(): {playerStateGetter: () => PlayerStateInput, animationLength: number} {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: Infinity
        };
    }
    
}
export class IdleState extends PlayerStateInput{
    playerState = PlayerStates.Idle;
    lastKey: string;
    constructor(keybinds: KeybindMap, direction: DIRECTION, motionSupplier: MotionSupplier, lastkey = ""){
        super(keybinds, direction, motionSupplier);
        this.lastKey = lastkey;
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        if(keysHeld.has(this.keybinds.left)){
            return new RunningState(this.keybinds, DIRECTION.LEFT, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.right)){
            return new RunningState(this.keybinds, DIRECTION.RIGHT, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.down)){
            return new PassingState(this.keybinds, this.dir, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.up)){
            return new JumpingState(this.keybinds, this.dir, this.motionSupplier);
        }
        return null;
    }
}

export class RunningState extends PlayerStateInput{
    playerState = PlayerStates.Running;
    lastState: PlayerStates;
    constructor(keybinds: KeybindMap, direction:DIRECTION, motionSupplier: MotionSupplier, lastPlayerState = PlayerStates.Idle){
        super(keybinds, direction, motionSupplier);
        this.lastState = lastPlayerState;
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        if(!keysHeld.has(this.keybinds.left) && !keysHeld.has(this.keybinds.right)){
            return new IdleState(this.keybinds, this.dir, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.left) && this.dir == DIRECTION.RIGHT){
            return new RunningState(this.keybinds, DIRECTION.LEFT, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.right) && this.dir == DIRECTION.LEFT){
            return new RunningState(this.keybinds, DIRECTION.RIGHT, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.up)){
            return new JumpingState(this.keybinds, this.dir, this.motionSupplier, true);
        }
        return null;
    }
}

export class PassingState extends PlayerStateInput{
    playerState = PlayerStates.Passing;

    onInput(inputData: ClientInputData): PlayerStateInput | null {
        let {keysDown, keysUp, keysHeld} = inputData;
        if(keysHeld.has(this.keybinds.down)){
            return new SettingState(this.keybinds, this.dir, this.motionSupplier);
        }
        return null;
    }
    override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: getAnimationLoopDuration(this.playerState)
        }
    }
}

export class SettingState extends PlayerStateInput{
    playerState = PlayerStates.Setting;

    onInput(inputData: ClientInputData): PlayerStateInput | null {
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
    override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: getAnimationLoopDuration(this.playerState)
        }
    }
}

export class JumpingState extends PlayerStateInput{
    playerState = PlayerStates.Jumping;
    hasMomentum: boolean;
    constructor(keybinds: KeybindMap, dir: DIRECTION,  motionSupplier: MotionSupplier, hasMomentum = false){
        super(keybinds, dir, motionSupplier);
        this.hasMomentum = hasMomentum;
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        let isOnGround: boolean;
        if(keysHeld.has(this.keybinds.left)){
            //long spike
            // return new RunningState(this.keybinds, DIRECTION.LEFT, this.motionSupplier);
        }
        else if(keysHeld.has(this.keybinds.right)){
            //block
            // return new RunningState(this.keybinds, DIRECTION.RIGHT, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.down)){
            //sharp spike
            return new SpikingState(this.keybinds, this.dir, this.motionSupplier);
        }
        if(keysHeld.has(this.keybinds.up)){
            //quick jump
        }
        return null;
    }

    override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        let timeBeforeJump = 1 / ANIMATION_DETAILS.Jumping.fps * 7;
        let landingTime = PositionFunctionUtils.calculateTrajectory(this.motionSupplier().position, {vx: 0, vy: SERVER.player.jumpForce}, 0, SERVER.player.floorLevel, SERVER.player.gravity).landingTime + timeBeforeJump;
        console.log(this.motionSupplier(), PositionFunctionUtils.calculateTrajectory(this.motionSupplier().position, {vx: 0, vy: SERVER.player.jumpForce}, landingTime, SERVER.player.floorLevel, SERVER.player.gravity).coords.y);
        landingTime *= 1000; // convert from sec to millis
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: landingTime
        }
    }
}

export class FallingState extends PlayerStateInput{
    playerState = PlayerStates.Falling;
    constructor(keybinds: KeybindMap, dir: DIRECTION, motionSupplier: MotionSupplier){
        super(keybinds, dir, motionSupplier);
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        return null;
    }
    getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        let timeUntilLanding = 1000;//TODO change this later 
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: timeUntilLanding
        }
    }
}

export class SpikingState extends PlayerStateInput{
    playerState = PlayerStates.Spiking;
    constructor(keybinds: KeybindMap, dir: DIRECTION, motionSupplier: MotionSupplier){
        super(keybinds, dir, motionSupplier);
    }
    getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        return {
            playerStateGetter: () => new FallingState(this.keybinds, this.dir, this.motionSupplier),
            animationLength: getAnimationLoopDuration(this.playerState)
        }
    }
}