class InputHandler {
    keysDown;
    keysUp;
    keysHeld;
    callbackFnList;
    constructor(keyMemoryLimit = 20) {
        this.keysDown = new Array(keyMemoryLimit); //keydown history
        this.keysUp = new Array(keyMemoryLimit); //keyup history
        this.keysHeld = new Set(); //current keys pressed
        this.callbackFnList = [];
    }
    onKeyDown(event) {
        this.keysDown.push(event.key);
        this.keysDown.shift();
        if (!this.keysHeld.has(event.key))
            this.keysHeld.add(event.key);
        this.callbackFnList.forEach(callback => callback(this.getKeyData()));
    }
    onKeyUp(event) {
        this.keysUp.push(event.key);
        this.keysUp.shift();
        this.keysHeld.delete(event.key);
        this.callbackFnList.forEach(callback => callback(this.getKeyData()));
    }
    getKeyData() {
        return {
            keysDown: this.keysDown,
            keysUp: this.keysUp,
            keysHeld: this.keysHeld
        };
    }
    addEventCallback(callbackFn) {
        this.callbackFnList.push(callbackFn);
    }
}
export { InputHandler };
