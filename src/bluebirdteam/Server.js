const Config = use("utils/Config");
const RakNetApdater = use("network/mcpe/RakNetApdater")
const Fs = use("utils/SimpleFileSystem")
const Logger = use("log/Logger")
const ConsoleCommandReader = use("command/ConsoleCommandReader")

class Server{
    constructor(path) {
        let start_time = Date.now()
        this.path = path
        if(!Fs.fileExists("BlueBird.json")){
            Fs.copy(this.path.file + "bluebirdteam/resources/BlueBird.json", this.path.data + "BlueBird.json")
        }
        this.raknet = new RakNetApdater(this)
        this.raknet.tick()
        this.logger = new Logger()
        this.getLogger().info("Starting Server...")
        this.getLogger().info("Loading BlueBird.json")
        this.getLogger().info("This Server Is Running BlueBird Version 1.0!")
        this.getLogger().info("BlueBird Is distributed under MIT License")
        this.getLogger().info("Opening server on " + new Config("BlueBird.json", Config.JSON).get("interface") + ":" + new Config("BlueBird.json", Config.JSON).get("port"));
        this.getLogger().info("Done in (" + (Date.now() - start_time) + "ms).")
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
}

module.exports = Server