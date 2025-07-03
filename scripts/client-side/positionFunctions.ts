import {DIRECTION, Coordinates, PlayerStates, SERVER} from "./constants.js";

interface PositionData{
    coords: Coordinates;
    endBehavior: {
        time: number, //sec
        newState: PlayerStates | null
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
        let newPosition: Coordinates = initialPosition;
        let maxPositionX = dir == DIRECTION.LEFT ? SERVER.netPos.x + SERVER.netPos.w + SERVER.player.size :SERVER.netPos.x - SERVER.player.size;
        newPosition.x = secondsPassed * SERVER.player.runningSpeed + initialPosition.x;
        if(dir == DIRECTION.LEFT && initialPosition.x > maxPositionX && t > this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed)){

        }
        else if(dir == DIRECTION.RIGHT && initialPosition.x < maxPositionX && t < this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed)){

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