import { ClientInputData, DIRECTION, getAnimationLoopDuration, KeybindMap, PlayerStates } from "./constants.js";

interface PlayerStateInputLogic{
    playerState: PlayerStates;
    onInput: (inputData: ClientInputData) => PlayerStateInput | null;
    getDefaultTimeoutBehavior: () => {playerStateGetter: () => PlayerStateInput, animationLength: number}
}
export abstract class PlayerStateInput implements PlayerStateInputLogic{
    abstract playerState: PlayerStates;
    keybinds: KeybindMap;
    dir: DIRECTION;
    constructor(keybinds: KeybindMap, direction: DIRECTION){
        this.keybinds = keybinds;
        this.dir = direction;
    }

    onInput(inputData: ClientInputData): PlayerStateInput | null {

        return null;
    }
    getDefaultTimeoutBehavior(): {playerStateGetter: () => PlayerStateInput, animationLength: number} {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
            animationLength: Infinity
        };
    }
    
}
export class IdleState extends PlayerStateInput{
    playerState = PlayerStates.Idle;
    lastKey: string;
    constructor(keybinds: KeybindMap, direction: DIRECTION, lastkey = ""){
        super(keybinds, direction);
        this.lastKey = lastkey;
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        if(keysHeld.has(this.keybinds.left)){
            return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        if(keysHeld.has(this.keybinds.right)){
            return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if(keysHeld.has(this.keybinds.down)){
            return new PassingState(this.keybinds, this.dir);
        }
        if(keysHeld.has(this.keybinds.up)){
            return new JumpingState(this.keybinds, this.dir);
        }
        return null;
    }
}

export class RunningState extends PlayerStateInput{
    playerState = PlayerStates.Running;
    lastState: PlayerStates;
    constructor(keybinds: KeybindMap, direction:DIRECTION, lastPlayerState = PlayerStates.Idle){
        super(keybinds, direction);
        this.lastState = lastPlayerState;
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        if(!keysHeld.has(this.keybinds.left) && !keysHeld.has(this.keybinds.right)){
            return new IdleState(this.keybinds, this.dir);
        }
        if(keysHeld.has(this.keybinds.left) && this.dir == DIRECTION.RIGHT){
            return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        if(keysHeld.has(this.keybinds.right) && this.dir == DIRECTION.LEFT){
            return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if(keysHeld.has(this.keybinds.up)){
            return new JumpingState(this.keybinds, this.dir, true);
        }
        return null;
    }
}

export class PassingState extends PlayerStateInput{
    playerState = PlayerStates.Passing;

    onInput(inputData: ClientInputData): PlayerStateInput | null {
        let {keysDown, keysUp, keysHeld} = inputData;
        if(keysHeld.has(this.keybinds.down)){
            return new SettingState(this.keybinds, this.dir);
        }
        return null;
    }
    override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
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
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
            animationLength: getAnimationLoopDuration(this.playerState)
        }
    }
}

export class JumpingState extends PlayerStateInput{
    playerState = PlayerStates.Jumping;
    hasMomentum: boolean;
    constructor(keybinds: KeybindMap, dir: DIRECTION, hasMomentum = false){
        super(keybinds, dir);
        this.hasMomentum = hasMomentum;
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        let isOnGround: boolean;
        if(keysHeld.has(this.keybinds.left)){
            //long spike
            // return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        else if(keysHeld.has(this.keybinds.right)){
            //block
            // return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if(keysHeld.has(this.keybinds.down)){
            //sharp spike
            return new SpikingState(this.keybinds, this.dir);
        }
        if(keysHeld.has(this.keybinds.up)){
            //quick jump
        }
        return null;
    }

    // override getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
    //     return {
    //         playerStateGetter: () => new FallingState(this.keybinds, this.dir),
    //         animationLength: getAnimationLoopDuration(this.playerState)
    //     }
    // }
}

export class FallingState extends PlayerStateInput{
    playerState = PlayerStates.Falling;
    constructor(keybinds: KeybindMap, dir: DIRECTION){
        super(keybinds, dir);
    }
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        return null;
    }
    getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        let timeUntilLanding = 1000;//TODO change this later 
        return {
            playerStateGetter: () => new IdleState(this.keybinds, this.dir),
            animationLength: timeUntilLanding
        }
    }
}

export class SpikingState extends PlayerStateInput{
    playerState = PlayerStates.Spiking;
    constructor(keybinds: KeybindMap, dir: DIRECTION){
        super(keybinds, dir);
    }
    getDefaultTimeoutBehavior(): { playerStateGetter: () => PlayerStateInput; animationLength: number; } {
        return {
            playerStateGetter: () => new FallingState(this.keybinds, this.dir),
            animationLength: getAnimationLoopDuration(this.playerState)
        }
    }
}