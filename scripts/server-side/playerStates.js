class PlayerState{
    constructor(player){
        this.player;
    }
    onInput(){

    }
    onUpdate(){}
    onStart(){}
    onEnd(){}
}

class IdleState extends PlayerState{
    constructor(player, diveDirection = false){
        super(player);
    }
    onInput(keys){
        let { keysDown, keysUp, keysPressed } = keys;
        
    }
}

class RunningState extends PlayerState{
    constructor(player){}
}

class JumpingState extends PlayerState{
    constructor(player){}
}

class PassingState extends PlayerState{
    constructor(player){}
}

class SettingState extends PlayerState{
    constructor(player){}
}

class SpikingState extends PlayerState{
    constructor(player){}
}

class BlockingState extends PlayerState{
    constructor(player){}
}

class DivingState extends PlayerState{
    constructor(player){}
}

/*
* Future work
class TippingState extends PlayerState{
    
}
*/