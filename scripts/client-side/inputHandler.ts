import { ClientInputData } from "./constants";
type InputCallbackFn = (eventData: ClientInputData) => void;
class InputHandler{
    keysDown: any[];
    keysUp: any[];
    keysHeld: Set<string>;
    callbackFnList: InputCallbackFn[];
    constructor(keyMemoryLimit = 20){
        this.keysDown = new Array(keyMemoryLimit); //keydown history
        this.keysUp = new Array(keyMemoryLimit); //keyup history
        this.keysHeld = new Set(); //current keys pressed
        this.callbackFnList = [];
    }

    onKeyDown(event: KeyboardEvent){
        this.keysDown.push(event.key);
        this.keysDown.shift();
        if(!this.keysHeld.has(event.key))
            this.keysHeld.add(event.key);
        this.callbackFnList.forEach(callback => callback(this.getKeyData()));
    }
    onKeyUp(event: KeyboardEvent){
        this.keysUp.push(event.key);
        this.keysUp.shift();
        this.keysHeld.delete(event.key);
        this.callbackFnList.forEach(callback => callback(this.getKeyData()));
    }
    
    getKeyData(): ClientInputData{
        return {
            keysDown: this.keysDown,
            keysUp: this.keysUp,
            keysHeld: this.keysHeld
        }
    }

    onFocusout(){
        for(let key of this.keysHeld){
            this.onKeyUp(new KeyboardEvent("keyup", { key: key} ));
        }
    }
    addEventCallback(callbackFn: (eventData: ClientInputData) => void){
        this.callbackFnList.push(callbackFn);
    }
}

export {InputHandler}