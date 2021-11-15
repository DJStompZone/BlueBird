const DataPacket = require("./DataPacket");
const assert = require("assert");
const Zlib = require("zlib");
const PacketPool = require("./PacketPool");

class BatchPacket extends DataPacket{

    static get NETWORK_ID(){ return 0xfe; }

    initVars() {
        this.payload = "";
        this.compressionLevel = 7;
    }

    canBeBatched(){
        return false;
    }

    canBeSentBeforeLogin(){
        return true;
    }

    decodeHeader() {
        let pid = this.readByte();
        assert(pid === self.NETWORK_ID);
    }

    decodePayload() {
        let data = this.readRemaining();
        try{
            this.payload = new BinaryStream(Zlib.unzipSync(data/*, 1024 * 1024 * 2*/));
        }catch(e){ //zlib decode error
            this.payload = "";
            console.log("Decode Zlib BatchPacket = error");
        }
    }

    encodeHeader() {
        this.writeByte(self.NETWORK_ID);
    }

    encodePayload() {
        let encoded = Zlib.deflateRawSync(this.payload.Buffer, {level: this.compressionLevel});
        this.append(encoded);
    }

    addPacket(packet) {
        if(!packet.canBeBatched()){
            throw new Error(packet.getName() + " cant be batched");
        }
        if(!packet.isEncoded){
            packet.encode();
        }

        this.payload = this.writeUnsignedVarInt(packet.length);
        this.payload.append(packet.getBuffer());
    }

    getPackets(){
        let pks = [];
        while(!this.payload.feof()){
            pks.push(this.payload.read(this.payload.readUnsignedVarInt()));
        }
        return pks;
    }

    getCompressionLevel(){
        return this.compressionLevel;
    }

    setCompressionLevel(level){
        this.compressionLevel = level;
    }

    handle(session){
        if(this.payload === ""){
            return false;
        }
        this.getPackets().forEach(buf => {
            let pk = PacketPool.getPacket(buf);

            if(!pk.canBeBatched()){
                throw new Error("Received invalid " + pk.getName() + " inside BatchPacket");
            }

            session.handleBatchPacket(this);
        });
    }
}

module.exports = BatchPacket;