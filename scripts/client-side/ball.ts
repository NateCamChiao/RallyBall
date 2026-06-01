import { ClientPlayer, CoordConversionFn } from "./clientPlayer";
import { Coordinates, Velocity, PhysicsState } from "./constants";
import { PositionFunctionUtils } from "./positionFunctions";

export class BallController{
    lastPhysicsState: PhysicsState;
    startDate: number;
    ctx: CanvasRenderingContext2D;
    ballImage: any;
    physicsEvents: {
        timestamp: number,
        physicsState: PhysicsState
    }[];
    radius: number;
    serverToClientCoords: CoordConversionFn;
    playerList: ClientPlayer[];

    constructor(ctx: CanvasRenderingContext2D, ballImage: any, initalCoord: Coordinates, intialVelocity: Velocity, startDate: any, serverToClientCoords: CoordConversionFn, scalingUnit: number, players: ClientPlayer[]){
        this.ctx = ctx;
        this.ballImage = ballImage;
        this.lastPhysicsState = {
            position: initalCoord,
            velocity: intialVelocity
        }
        this.startDate = startDate;
        this.radius = scalingUnit * 0.015;
        this.physicsEvents = [];
        this.serverToClientCoords = serverToClientCoords;
        this.playerList = players;
    }

    updatePhysicsEvents(){
        
    }

    addPhysicsEvent(eventTimestamp: number, eventData: PhysicsState){
        let currentTimestamp = Date.now();
        if(currentTimestamp > eventTimestamp){
            return;
        }
        // register physics events which can then be used to make a position fn
        for(let i = 0; i < this.physicsEvents.length; i++){
            if(this.physicsEvents[i].timestamp > eventTimestamp){
                this.physicsEvents.splice(i, 0, {
                    timestamp: eventTimestamp,
                    physicsState: eventData
                });
                console.log("added event", eventTimestamp - currentTimestamp)
                setTimeout(this.triggerPhysicsEvent, eventTimestamp - currentTimestamp)
                return;
            }
        }
        
        this.physicsEvents.push({
            timestamp: eventTimestamp,
            physicsState: eventData
        });
        console.log("added event", eventTimestamp - currentTimestamp)

        setTimeout(this.triggerPhysicsEvent, eventTimestamp - currentTimestamp)
        
        
    }

    /**
     * 1. loop through players and take all ball interacting states into account
     * 2. calculate time until collision given initial condition (-1 if won't collide at current moment)
     * 3. take lowest time and then repeat with new initial condition
     * 4. exit if ball hits ground
     */

    triggerPhysicsEvent(){
        console.log("running event")
        
    }

    calculatePosition(time: number): Coordinates{
        // let trajectoryData = PositionFunctionUtils.calculateTrajectory()
        return {
            x:0,
            y:0
        }
    }

    render(){
        let x = this.lastPhysicsState.position.x;
        let y = this.lastPhysicsState.position.y;
        let position = this.serverToClientCoords(x,y);
        this.ctx.drawImage(
            this.ballImage,
            456,
			130,
			235,
			235,
            position.x - this.radius,
            position.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
    }
}