
export interface Coordinates{
	x: number,
    y: number
}
export interface Velocity{
	vx: number,
	vy: number	
}
export enum PlayerStates {
	Idle = "Idle",
	Running = "Running",
	Passing = "Passing", 
	Jumping = "Jumping",
	Setting = "Setting",
	Spiking = "Spiking",
	Blocking = "Blocking",
	Stepback = "Stepback",
	Falling = "Falling",
	Diving = "Diving",
	JumpServeTossing = "JumpServeTossing",
}
/*
todo delete this
ball positioning for later
Ball: function(coords: Coordinates, velocity: {vx: number, vy: number}, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
*/

export const calculateGravity = (yInitial: number, gravity: number, time: number): Coordinates => {
	return {
		x: 0,
		y: 0
	}
}

export type AnimationDetails = {
	[key: string]: {
		maxFrame: number,
		mapRow: number,
		fps: number,
		freezeFrame?: number
	}
}


export const ANIMATION_DETAILS: AnimationDetails = {
	Idle: {
		maxFrame: 4,
		mapRow: 1,
        fps:10
	},
	Running: {
		maxFrame: 8,
		mapRow: 0,
        fps:16
	},
	Passing: {
		maxFrame: 7,
		mapRow: 2,
        fps:50
	},
	Jumping: {
		maxFrame: 8,
		mapRow: 3,
        fps:12
	},
	Setting: {
		maxFrame: 6,
		mapRow: 7,
        fps:14
	},
	Spiking: {
		maxFrame: 8,
		mapRow: 4,
        fps:20
	},
	Blocking: {
		maxFrame: 5,
		mapRow: 8,
        fps:14
	},
	Stepback: {
		maxFrame: 3,
		mapRow: 0,
        fps:0
	},
	Falling: {
		freezeFrame: 7,
		maxFrame: 1,
		mapRow: 4,
        fps:0
	},
	Diving: {
		maxFrame: 8,
		mapRow: 6,
        fps:10
	},
	JumpServeTossing: {
		maxFrame: 7,
		mapRow: 9,
        fps:0
	},
}
export type ClientRenderData = {
	[key: string]: {
		animation: AnimationDetails[typeof key],
		position: any
	}
}

export const PERFECT_SCALING_RATIO = 1.8;
export const SCALING_UNIT_TO_PLAYER_SIZE = 0.17;//multiply by scaling unit to get player size

export const PLAYER_FRAME_WIDTH = 100;// width on sprite map
export const PLAYER_ANIMATION = {
	FRAME_WIDTH: 100, //width of player in assets
    WIDTH: 0,
    HEIGHT: 0,
	NAME_CONST: {
		NAME_RATIO_TO_SCALING_UNIT: 25/1638,
		LEFT_AMOUNT_BY_PLAYER_SIZE: -0.05,
		DOWN_AMOUNT_BY_PLAYER_SIZE: 0.15
	}
}

export enum DIRECTION {
	LEFT = 0,
    RIGHT = 1
}

export enum GAMESTATES {
	QUEING,
	SERVING,
	PLAYING,
	PAUSED,
	ENDED,
	SANDBOX
}

export enum PLAYERTYPE {
	REAL,
	ONLINE,
	AI,
	DUMMY
}

export type BallStateData = {
	initialPosition: Coordinates,
	initialVelocity: Velocity,
	startDate: Date
}

export type PlayerStateData = {
	dir: DIRECTION,
	initalPosition: Coordinates,
	startData: Date,
	playerState: PlayerStates
}

export type GameStateData = {
	players: PlayerStateData[],
	gameState: GAMESTATES,
	ball: BallStateData
}
export type ClientInputData = {
	keysDown: any[],
	keysUp: any[],
	keysHeld: Set<string>
}