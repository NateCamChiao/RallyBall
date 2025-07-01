import {DIRECTION, Coordinates, PlayerStates} from "./constants";

interface PositionData{
    coords: Coordinates;
    endBehavior: {
        time: number, //sec
        newState: PlayerStates | null
    }
}

export class PositionFunctions{
    static Idle(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Running(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Jumping(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Spiking(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Passing(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Setting(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Blocking(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Stepback(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Falling(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Diving(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static JumpServeTossing(coords: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    
}