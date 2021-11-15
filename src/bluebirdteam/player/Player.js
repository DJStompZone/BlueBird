const PlayerSessionAdapter = require("../network/mcpe/PlayerSessionAdapter");

class Player{

    constructor(server, clientId, ip, port) {
        this.sessionAdapter = new PlayerSessionAdapter();
        this.server = server;
        this.clientId = clientId;
        this.ip = ip;
        this.port = port;
    }

    /**
     * @return {PlayerSessionAdapter}
     */
    getSessionAdapter(){
        return this.sessionAdapter;
    }

    handleLogin(packet){}

    doFirstSpawn(){}


}

module.exports = Player;
