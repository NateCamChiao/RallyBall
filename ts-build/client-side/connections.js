//this lives on client-size
export class FakeServerHandler {
    onClientData(inputData) {
    }
    onServerData(gamestateData) {
    }
}
export class RealServerHandler {
    //socket io stuff
    onClientData(inputData) {
        //send data to real server
    }
    onServerData(gamestateData) {
        // send back to client
    }
}
