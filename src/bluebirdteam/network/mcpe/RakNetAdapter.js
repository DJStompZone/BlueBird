const BatchPacket = require("./protocol/BatchPacket");
const PlayerList = require("../../player/PlayerList");
const Player = require("../../player/Player");
const RakNetServer = (require("bluebirdmc-raknet") ?? require("raknet"));
const Logger = use("log/Logger");
const ProtocolInfo = use("network/mcpe/protocol/ProtocolInfo");
const Config = use("utils/Config");

class RakNetAdapter {
    constructor(server) {
        this.server = server;
        this.bluebirdcfg = new Config("BlueBird.json", Config.JSON);
        this.playersCount = 0;
        this.raknetserver = new RakNetServer(this.bluebirdcfg.get("port"), this.logger = new Logger("RakNet"));
        this.raknetserver.getServerName()
            .setServerId(1)
            .setMotd(this.bluebirdcfg.get("motd"))
            .setName(this.bluebirdcfg.get("motd"))
            .setOnlinePlayers(this.playersCount)
            .setMaxPlayers(this.bluebirdcfg.get("maxplayers"))
            .setProtocol(ProtocolInfo.CURRENT_PROTOCOL)
            .setVersion(ProtocolInfo.MINECRAFT_VERSION)
            .setGamemode("Creative");
        this.players = new PlayerList();
    }

    sendPacket(player, packet, needACK, immediate){
        if(this.players.hasPlayer(player)){
            let identifier = this.players.getPlayerIdentifier(player);

            if(packet instanceof BatchPacket){
                let session;
                if((session = this.raknetserver.getSessionManager().getSessionByIdentifier(identifier))){
                    session.queueConnectedPacketFromServer(packet, needACK, immediate);
                }
                return null;
            }else{
                this.server.batchPackets([player], [packet], true, immediate);
            }
        }
    }

    tick(){
        this.raknetserver.getSessionManager().readOutgoingMessages().forEach(message => this._handleIncomingMessage(message.purpose, message.data));

        this.raknetserver.getSessionManager().getSessions().forEach(session => {
            let player = this.players.getPlayer(session.toString());

            session.packetBatches.getAllAndClear().forEach(packet => {
                let pk = new BatchPacket();
                pk.setBuffer(packet.getStream().getBuffer(), 1);
                pk.decode();
                pk.handle(player.getSessionAdapter());
            });
        });
    }

    close(player, reason = "unknown reason"){
        if(this.players.hasPlayer(player.ip + ":" + player.port)){
            this.raknetserver.getSessionManager().removeSession(this.raknetserver.getSessionManager().getSession(player.ip, player.port), reason);
            this.players.removePlayer(player.ip + ":" + player.port);
        }
    }

    shutdown(){
        this.raknetserver.shutdown();
    }

    _handleIncomingMessage(purpose, data){
        switch(purpose){
            case "openSession":
                let player = new Player(this.server, data.clientId, data.ip, data.port);
                this.players.addPlayer(data.identifier, player);
                this.playersCount += 1;
                this.logger.info("get new connection " + player.ip + ":" + player.port);
                break;
            case "closeSession":
                if(this.players.has(data.identifier)){
                    let player = this.players.get(data.identifier);
                    //player.close("Left The Server", data.reason);
                    this.close(this.players.getPlayer(data.identifier), data.reason);
                    this.playersCount -= 1;
                    this.logger.info("removed connection for " + player.ip + ":" + player.port);
                }
                break;
        }
    }
}
module.exports = RakNetAdapter
