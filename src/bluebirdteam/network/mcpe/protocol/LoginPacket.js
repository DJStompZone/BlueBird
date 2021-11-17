const DataPacket = require("./DataPacket");
const ProtocolInfo = require("./ProtocolInfo");
const Isset = require("../../../utils/methods/Isset");
const Utils = require("../../../utils/Utils");

class LoginPacket extends DataPacket {
    static get NETWORK_ID(){ return ProtocolInfo.LOGIN_PACKET }

    initVars() {
        this.username = "";
        this.protocol = 0;
        this.clientUUID = "";
        this.clientId = 0;
        this.xuid = "";
        this.identityPublicKey = "";
        this.serverAddress = "";
        this.locale = "";
        this.skipVerification = false;

        this.chainData = [];
        this.clientDataJwt = "";
        this.clientData = [];
    }

    canBeSentBeforeLogin(){
        return true;
    }

    mayHaveUnreadBytes(){
        return this.protocol !== ProtocolInfo.CURRENT_PROTOCOL;
    }

    decodePayload() {
        this.protocol = this.readInt();
        try{
            this.decodeConnectionRequest();
        }catch (e){
            if(this.protocol === ProtocolInfo.CURRENT_PROTOCOL){
                throw e;
            }
            this.logger.debug(this.getName() + " was thrown while decoding connection request in login (protocol version " + this.protocol + ")");
        }
    }

    decodeConnectionRequest(){
        let buffer = new BinaryStream(this.readString());
        //this.chainData = JSON.parse(buffer.append(buffer.readLInt()));
        this.chainData = JSON.parse(buffer.read(buffer.readLInt()).toString());
        console.log("LoginPacket => chain data: " + this.chainData); // only for now
        let hasExtraData = false;
        this.chainData["chain"].forEach(chain => {
            let webtoken = Utils.decodeJWT(chain);
            if(Isset(webtoken["extraData"])){
                if(hasExtraData){
                    throw new Error("Found 'extraData' multiple times in key chain");
                }
                hasExtraData = true;
                if(Isset(webtoken["extraData"]["displayName"])){
                    this.username = webtoken["extraData"]["displayName"];
                }
                if(Isset(webtoken["extraData"]["identity"])){
                    this.clientUUID = webtoken["extraData"]["identity"];
                }
                if(Isset(webtoken["extraData"]["XUID"])){
                    this.xuid = webtoken["extraData"]["XUID"];
                }

                if(Isset(webtoken["identityPublicKey"])){
                    this.identityPublicKey = webtoken["identityPublicKey"];
                }
            }
        });

        this.clientDataJwt = buffer.get(buffer.readLInt());
        this.clientData = Utils.decodeJWT(this.clientDataJwt);

        this.clientId = this.clientData["ClientRandomId"] ?? null;
        this.serverAddress = this.clientData["ServerAddress"] ?? null;

        this.locale = this.clientData["LanguageCode"] ?? null;
    }

    encodePayload() {
        //
    }

    handle(session) {
        session.handleLogin(LoginPacket);
    }
}

module.exports = LoginPacket;