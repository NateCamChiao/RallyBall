import { ClientInputData, DIRECTION, getCycleTime, KeybindMap, PlayerStates } from "./constants.js";

interface PlayerStateInputLogic{
    playerState: PlayerStates;
    onInput: (inputData: ClientInputData) => PlayerStateInput | null;
    getDefaultTimeoutBehavior: () => {playerState: PlayerStateInput | null, animationLength: number}
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
    getDefaultTimeoutBehavior(): {playerState: PlayerStateInput | null, animationLength: number} {
        return {
            playerState: new IdleState(this.keybinds, this.dir),
            animationLength: Infinity
        };
    }
    
}
export class IdleState extends PlayerStateInput{
    playerState = PlayerStates.Idle;
    onInput(inputData: ClientInputData): PlayerStateInput | null{
        let {keysDown, keysUp, keysHeld} = inputData;
        console.log(keysHeld);
        if(keysHeld.has(this.keybinds.left)){
            return new RunningState(this.keybinds, DIRECTION.LEFT);
        }
        else if(keysHeld.has(this.keybinds.right)){
            return new RunningState(this.keybinds, DIRECTION.RIGHT);
        }
        if(keysHeld.has(this.keybinds.down)){
            return new PassingState(this.keybinds, this.dir);
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
        console.log(keysHeld);
        if(!keysHeld.has(this.keybinds.left) && !keysHeld.has(this.keybinds.right)){
            return new IdleState(this.keybinds, this.dir);
        }
        return null;
    }
}

export class PassingState extends PlayerStateInput{
    playerState = PlayerStates.Passing;

    onInput(inputData: ClientInputData): PlayerStateInput | null {
        let {keysDown, keysUp, keysHeld} = inputData;
        
        return null;
    }
    override getDefaultTimeoutBehavior(){
        console.log(getCycleTime(this.playerState));
        return {
            playerState: new IdleState(this.keybinds, this.dir),
            animationLength: getCycleTime(this.playerState)
        }
    }
}