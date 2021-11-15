const PacketPool = require("./network/mcpe/protocol/PacketPool");
const Config = use("utils/Config");
const RakNetAdapter = use("network/mcpe/RakNetAdapter")
const Fs = use("utils/SimpleFileSystem")
const Logger = use("log/Logger")
const ConsoleCommandReader = use("command/ConsoleCommandReader")

class Server{

    constructor(path) {
        let start_time = Date.now()
        
        PacketPool.init();
        
        this.path = path
        if(!Fs.fileExists("BlueBird.json")){
            Fs.copy(this.path.file + "bluebirdteam/resources/BlueBird.json", this.path.data + "BlueBird.json")
        }
        this.logger = new Logger()
        this.getLogger().info("Starting Server...")
        this.getLogger().info("Loading BlueBird.json")
        this.getLogger().info("This Server Is Running BlueBird Version 1.0!")
        this.getLogger().info("BlueBird Is distributed under MIT License")
        this.getLogger().info("Opening server on " + new Config("BlueBird.json", Config.JSON).get("interface") + ":" + new Config("BlueBird.json", Config.JSON).get("port"));
        this.getLogger().info("Done in (" + (Date.now() - start_time) + "ms).")
        this.tick();
    }

    tick(){
        this.raknet = new RakNetAdapter(this)
        this.raknet.tick()
        let reader = new ConsoleCommandReader(this)
        reader.tick()
    }

    /**
     * @return {string}
     */
    getDataPath(){
        return this.path.data;
    }

    getLogger(){
        return this.logger;
    }

    shutdown(){
        this.raknet.shutdown();
        process.exit(1);
    }
}

module.exports = Server
