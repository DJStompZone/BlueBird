const LoginPacket = require("./LoginPacket");

class PacketPool{

    constructor() {
        this.pool = new Map();
    }

    init(){
        this.registerPacket(LoginPacket);
    }

    registerPacket(packet){
        this.pool.set(packet, packet);
    }

    getPacket(packet){
        return this.pool.has(packet) ? new (self.pool.get(packet))() : null;
    }

    isRegistered(packet){
        return this.pool.has(packet);
    }
}

module.exports = PacketPool;