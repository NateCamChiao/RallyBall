import {DIRECTION, Coordinates, PlayerStateLabels, SERVER, getAnimationLoopDuration, ANIMATION_DETAILS, PhysicsState} from "./constants.js";

interface PositionData{
    coords: Coordinates;
    endBehavior: {
        time: number, //sec
        newState: PlayerStateLabels | null
    }
}
export class PositionFunctionUtils{
    static getLandingTime(a: number, b: number, c: number): number{
        let discriminant = b * b - 4 * a * c;
        if(discriminant <= 0 || a == 0) 
            return 0;
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return Math.max(root1, root2);
    }
    static calculateTrajectory(initialPhysicsState: PhysicsState, time: number, groundLevel = SERVER.player.floorLevel, gravity = SERVER.player.gravity): {coords: Coordinates, landingTime: number}{
        let landingTime = this.getLandingTime(1/2 * gravity, initialPhysicsState.velocity.vy, initialPhysicsState.position.y - groundLevel);
        let newPosition = {
            x: initialPhysicsState.velocity.vx * time + initialPhysicsState.position.x,
            y: initialPhysicsState.position.y + initialPhysicsState.velocity.vy * time + 1/2 * gravity * time * time
        }
        if(time > landingTime){
            newPosition.x = initialPhysicsState.position.x + initialPhysicsState.velocity.vx * landingTime;
            newPosition.y = groundLevel;
        }
        return {
            coords: {
                x: newPosition.x,
                y: newPosition.y
            },
            landingTime: landingTime
        }
    }
    static millisToSec(milliseconds: number): number{
        return milliseconds / 1000;
    }

    static timeFromDist(distance: number, distPerSec: number): number{
        if(distPerSec == 0){
            return 0;
        }
        return 1 / distPerSec * Math.abs(distance);
    }

    static clampXPosition(currentPosition: Coordinates, initialPosition: Coordinates, dir: DIRECTION): Coordinates{
        let maxPositionX = dir == DIRECTION.LEFT ? SERVER.netPos.bottom.x + SERVER.netPos.bottom.w - 0.03 : SERVER.netPos.bottom.x - SERVER.player.size + 0.03;
        maxPositionX *= 200;
        let newPosition = currentPosition;
        if(dir == DIRECTION.LEFT && currentPosition.x <= maxPositionX && initialPosition.x > maxPositionX){
            newPosition.x = maxPositionX;
        }
        else if(dir == DIRECTION.RIGHT && currentPosition.x >= maxPositionX && initialPosition.x < maxPositionX){
            newPosition.x = maxPositionX;
        }
        return newPosition;
    }
}
export class PositionFunctions{
    
    static Idle(initialPhysicsState: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPhysicsState,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Running(initialPhysicsState: Coordinates, dir: DIRECTION, t: any): PositionData{
        let newPosition: Coordinates = {x:0, y: initialPhysicsState.y}
        let maxPositionX = dir == DIRECTION.LEFT ? SERVER.netPos.bottom.x + SERVER.netPos.bottom.w - 0.03 : SERVER.netPos.bottom.x - SERVER.player.size + 0.03;
        newPosition.x = PositionFunctionUtils.millisToSec(t) * SERVER.player.runningSpeed;
        if(dir == DIRECTION.LEFT){
            newPosition.x = -newPosition.x;
        }
        maxPositionX *= 200;
        newPosition.x += initialPhysicsState.x;
        if(dir == DIRECTION.LEFT && initialPhysicsState.x >= maxPositionX && t > PositionFunctionUtils.timeFromDist(initialPhysicsState.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        else if(dir == DIRECTION.RIGHT && initialPhysicsState.x <= maxPositionX && t > PositionFunctionUtils.timeFromDist(initialPhysicsState.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        return {
            coords: newPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Jumping(initialPhysicsState: Coordinates, dir: DIRECTION, t: any): PositionData{
        let newPosition: Coordinates = {x:initialPhysicsState.x, y: initialPhysicsState.y};
        const jumpTime = 1 / ANIMATION_DETAILS.Jumping.fps * 7;
        let trajectoryData = PositionFunctionUtils.calculateTrajectory(
            {position: initialPhysicsState, velocity: {vx: 0, vy: SERVER.player.jumpForce}}, 
            PositionFunctionUtils.millisToSec(t) - jumpTime,
            SERVER.player.floorLevel, SERVER.player.gravity
        );
        if(PositionFunctionUtils.millisToSec(t) >= jumpTime){
            newPosition = trajectoryData.coords;
        }
        return {
            coords: newPosition,
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
        let newPosition = PositionFunctionUtils.calculateTrajectory({
                position: initialPosition, 
                velocity: {vx: 0, vy: 0}
            }, PositionFunctionUtils.millisToSec(t), SERVER.player.floorLevel, SERVER.player.gravity);
        // console.log(initialPosition, newPosition.coords);
        return {
            coords: newPosition.coords,
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