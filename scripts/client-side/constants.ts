export const debugMode = true;
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
        fps:13
	},
	Passing: {
		maxFrame: 7,
		mapRow: 2,
        fps:20
	},
	Jumping: {
		maxFrame: 8,
		mapRow: 3,
        fps:12,
		freezeFrame: 7
	},
	Setting: {
		maxFrame: 6,
		mapRow: 7,
        fps:10
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
	}
}

export const getAnimationLoopDuration = (key: string): number => {
	let animationData = ANIMATION_DETAILS[key];
	if(animationData.fps == 0 || animationData.fps == Infinity){
		return Infinity;
	}
	return 1000 / animationData.fps * (animationData.maxFrame - 1);
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
export const SERVER = {
	player: {
		size: 34 / 200,
		runningSpeed: 60,// per milli
		gravity: 80,
		floorLevel: 63,
		jumpForce: -70
	},
	groundY: 80,
	netPos: { // server coords
		bottom: {
			x: 95.5 / 200,
			y: 70 / 100,
			w: 9 / 200,
			h: 20 / 100
		},
		top: {
			x: 98 / 200,
			y: 64 / 100,
			w: 4 / 200,
			h: 3.5 / 100
		}
		
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
	startDate: Date,
	playerState: PlayerStates
}

export type GameStateData = {
	players: PlayerStateData[],
	gameState: GAMESTATES,
	ball: BallStateData
}

export type KeybindMap = {
	"up": string;
	"down": string;
	"right": string;
	"left": string;
}

export const defaultKeybinds: KeybindMap = {
	"up": "w",
	"down": "s",
	"left": "a",
	"right": "d"
}

export const secondaryKeybinds: KeybindMap = {
	"up": "ArrowUp",
	"down": "ArrowDown",
	"left": "ArrowLeft",
	"right": "ArrowRight"
}
export type ClientInputData = {
	keysDown: any[],
	keysUp: any[],
	keysHeld: Set<string>
}