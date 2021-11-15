class PacketPool{

    constructor() {
        self.pool = new Map();
    }

    static init(){
        //No Packets
    }

    static registerPacket(packet){
        self.pool.set(packet, packet);
    }

    static getPacket(packet){
        return self.pool.has(packet) ? new (self.pool.get(packet))() : null;
    }

    static isRegistered(packet){
        return self.pool.has(packet);
    }
}

module.exports = PacketPool;