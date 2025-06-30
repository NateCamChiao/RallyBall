import { GameStateData, ClientInputData } from "constants.js";
import { Game } from "./game";
interface ConnectionHandler{
    onClientData:(inputData: ClientInputData) => void;
    onServerData:(gamestateData: GameStateData) => void;
}
//this lives on client-size
class FakeServerHandler implements ConnectionHandler{
    onClientData(inputData: ClientInputData){

    }
    onServerData(gamestateData: GameStateData) {

    }
}

class RealServerHandler implements ConnectionHandler{
    onClientData(inputData: ClientInputData){

    }
    onServerData(gamestateData: GameStateData) {

    }
}