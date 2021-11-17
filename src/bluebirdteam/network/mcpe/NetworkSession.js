class NetworkSession{

    constructor(player) {
        this.player = player;
    }

    handleBatchPacket(BatchPacket){
        return true;
    }

    handleLogin(LoginPacket){
        return this.player.handleLogin(LoginPacket);
    }
}

module.exports = NetworkSession;