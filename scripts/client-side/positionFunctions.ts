import {DIRECTION, Coordinates, PlayerStates, SERVER} from "./constants.js";

interface PositionData{
    coords: Coordinates;
    endBehavior: {
        time: number, //sec
        newState: PlayerStates | null
    }
}
export class PositionFunctionUtils{
    static calculateGravity(initialPosition: Coordinates, initialVelocity: {vx: number, vy: number}, time: number, groundLevel = SERVER.player.floorLevel, gravity = SERVER.player.gravity): {coords: Coordinates, landingTime: number}{
        //y = -(g/2) * t^2 + v_yi * t + y_i
        //x = v_xi * t
        //offset so that floor level is zero
        //find coordinates, then offset y
        //find time till landing w/ modified quadratic (gets second result)
        //check if distance is greater than net coords
        //if collides then find timeTillCollision = timeFromDist(difference, speed)
            //y doesnt change but x is bound to net limit
        //undo floor level offset to get back to original position

        return {
            coords: {
                x:0,
                y:0
            },
            landingTime: 0
        }
    }
}
export class PositionFunctions{
    static timeFromDist(distance: number, distPerSec: number): number{
        if(distPerSec == 0){
            return 0;
        }
        return 1 / distPerSec * Math.abs(distance);
    }
    static Idle(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Running(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        let secondsPassed = t / 1000;
        let newPosition: Coordinates = {x:0, y: initialPosition.y};
        let maxPositionX = dir == DIRECTION.LEFT ? SERVER.netPos.bottom.x + SERVER.netPos.bottom.w : SERVER.netPos.bottom.x - SERVER.player.size;
        newPosition.x = secondsPassed * SERVER.player.runningSpeed;
        if(dir == DIRECTION.LEFT){
            newPosition.x = -newPosition.x;
        }
        maxPositionX *= 200;
        newPosition.x += initialPosition.x;
        if(dir == DIRECTION.LEFT && initialPosition.x > maxPositionX && t > this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        else if(dir == DIRECTION.RIGHT && initialPosition.x < maxPositionX && t > this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        return {
            coords: newPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Jumping(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Spiking(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Passing(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Setting(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Blocking(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Stepback(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Falling(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Diving(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static JumpServeTossing(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }

}