import { GameStateData, ClientInputData } from "constants.js";
import { Game } from "./game";
export interface ConnectionHandler{
    onClientData:(inputData: ClientInputData) => void;
    onServerData:(gamestateData: GameStateData) => void;
}
//this lives on client-size
export class FakeServerHandler implements ConnectionHandler{
    onClientData(inputData: ClientInputData){

    }
    onServerData(gamestateData: GameStateData) {

    }
}

export class RealServerHandler implements ConnectionHandler{
    //socket io stuff
    onClientData(inputData: ClientInputData){
        //send data to real server
    }
    onServerData(gamestateData: GameStateData) {
        // send back to client
    }
}