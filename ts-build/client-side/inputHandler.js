"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputHandler = void 0;
class InputHandler {
    keysDown;
    keysUp;
    keysHeld;
    constructor(keyMemoryLimit = 20) {
        this.keysDown = new Array(keyMemoryLimit); //keydown history
        this.keysUp = new Array(keyMemoryLimit); //keyup history
        this.keysHeld = new Set(); //current keys pressed
    }
    onKeyDown(event) {
        this.keysDown.push(event.key);
        this.keysDown.shift();
        if (!this.keysHeld.has(event.key))
            this.keysHeld.add(event.key);
    }
    onKeyUp(event) {
        this.keysUp.push(event.key);
        this.keysUp.shift();
        this.keysHeld.delete(event.key);
    }
    getKeyData() {
        return {
            keysDown: this.keysDown,
            keysUp: this.keysUp,
            heysHeld: this.keysHeld
        };
    }
}
exports.InputHandler = InputHandler;
