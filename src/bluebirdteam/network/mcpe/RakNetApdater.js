const RakNetServer = (require("bluebirdmc-raknet") ?? require("raknet"))
const Logger = use("log/Logger")
const Fs = use("utils/SimpleFileSystem")
const ProtocolInfo = use("network/mcpe/protocol/ProtocolInfo")
const Config = use("utils/Config")

'use strict'

class RakNetApdater{
    constructor(server) {
        this.server = server
        this.bluebirdcfg = new Config("BlueBird.json", Config.JSON)
        this.playersCount = 0
        this.raknetserver = new RakNetServer(this.bluebirdcfg.get("port"), new Logger())
        this.raknetserver.getServerName()
            .setServerId(1)
            .setMotd(this.bluebirdcfg.get("motd"))
            .setName(this.bluebirdcfg.get("motd"))
            .setOnlinePlayers(this.playersCount)
            .setMaxPlayers(this.bluebirdcfg.get("maxplayers"))
            .setProtocol(ProtocolInfo.CURRENT_PROTOCOL)
            .setVersion(ProtocolInfo.MINECRAFT_VERSION)
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
        this.raknetserver.getSessionManager().removeSession(this.raknetserver.getSessionManager().getSession(player._ip, player._port), reason);
    }

    shutdown(){
        this.raknetserver.shutdown()
    }

    _handleIncomingMessage(purpose, data){
        switch(purpose){
            case "openSession":
                this.playersCount += 1
                break;
            case "closeSession":
                this.playersCount -= 1
                break;
        }
    }
}
module.exports = RakNetApdater