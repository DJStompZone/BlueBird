const RakNetServer = (require("bluebirdmc-raknet") ?? require("raknet"))
const Logger = use("log/Logger")

'use strict'

class RakNetApdater{
    constructor(server) {
        this.server = server
        this.playersCount = 0
        this.connected = "null"
        this.raknetserver = new RakNetServer(19132, new Logger())
        this.raknetserver.getServerName()
            .setServerId(1)
            .setMotd("Nothing now")
            .setName("Nothing now")
            .setOnlinePlayers(this.playersCount)
            .setMaxPlayers(10)
            .setProtocol(465)
            .setVersion("1.17.32") // you can join in 1.17.30 cuz its same protocol of 1.17.32
            .setGamemode("Creative")
        this.logger = new Logger()
    }

    sendPacket(player, packet, needACK, immediate){
        //TODO: add send packet
        this.logger.debug("Sending "+packet.getName()+": " + packet.buffer)
    }

    tick(){
        this.raknetserver.getSessionManager().readOutgoingMessages().forEach(message => this._handleIncomingMessage(message.purpose, message.data));

        this.raknetserver.getSessionManager().getSessions().forEach(session => {
            // use batch packet
        });
    }

    close(player, reason = "unknown reason"){
        //hacky method
        if(this.connected !== "null"){
            this.raknetserver.getSessionManager().removeSession(this.raknetserver.getSessionManager().getSession(player.ipv6, player._port), reason);
        }
    }

    shutdown(){
        this.raknetserver.shutdown()
    }

    _handleIncomingMessage(purpose, data){
        switch(purpose){
            case "openSession":
                this.connected = data.ipv6
                this.playerCount += 1
                break;
            case "closeSession":
                this.connected = data.ipv6
                this.playerCount -= 1
                break;
        }
    }
}
module.exports = RakNetApdater