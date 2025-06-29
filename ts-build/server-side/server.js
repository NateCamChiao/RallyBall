class Ball {
}
const GAMESTATES = {
    WAITING: 0,
    STARTING: 1,
    SERVING: 2,
    PLAYING: 3,
};
class ServerGame {
    #gameID;
    constructor(firstPlayer, gameID) {
        this.players = [firstPlayer];
        this.ball = new Ball();
        this.VIRTUAL_DIMS = {
            WIDTH: 200,
            HEIGHT: 100
        };
        this.gameState = GAMESTATES.WAITING;
        this.#gameID = gameID;
    }
    connectPlayer(player) {
        //TODO check if player not already there
    }
    sendUpdate() {
        //TODO send data to player
        //serialize? ;)
    }
    onInput(keysDown, keysUp, keysPressed) {
        //TODO
    }
}
class GameHandler {
    static #gameCounter = 0;
    constructor() {
        this.games = [];
    }
    getGameID() {
        return GameHandler.#gameCounter;
    }
    /**
     * @param {ServerPlayer} player
     */
    createGame(player) {
        GameHandler.#gameCounter++;
        this.games.push(new ServerGame(firstPlayer, getGameID()));
    }
    endGame(gameID) {
    }
}
const gameHandler = new GameHandler();
gameHandler.createGame(new ServerPlayer());
export {};
