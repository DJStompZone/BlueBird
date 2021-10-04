const Config = use("utils/Config");
const RakNetApdater = use("network/mcpe/RakNetApdater")
const Fs = use("utils/SimpleFileSystem")
const Logger = use("log/Logger")
const readline = require('readline');

class Server{
    constructor(path) {
        let start_time = Date.now();
        this.raknet = new RakNetApdater(this)
        this.raknet.tick()
        this.path = path
        this.logger = new Logger()
        if(!Fs.fileExists("BlueBird.json")){
            Fs.copy(this.path.file + "bluebirdteam/resources/BlueBird.json", this.path.data + "BlueBird.json")
        }
        this.getLogger().info("Starting Server...")
        this.getLogger().info("Loading BlueBird.json")
        this.getLogger().info("This Server Is Running BlueBird Version 1.0!")
        this.getLogger().info("BlueBird Is distributed under MIT License")
        this.getLogger().info("Opening server on " + new Config("BlueBird.json", Config.JSON).get("interface") + ":" + new Config("BlueBird.json", Config.JSON).get("port"));
        this.getLogger().info("done in (" + (Date.now() - start_time) + "ms).")
        this.createConsoleCommands()
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

    createConsoleCommands() {
        //way to create console commands
        let rl = readline.createInterface(process.stdin, process.stdout)
        rl.prompt()
        rl.on("line", (arg) => {
            if(arg !== "stop" || arg !== "help"){
                rl.prompt()
            }
            if(arg === "stop" || arg === "help" || arg === ""){}else{
                this.getLogger().info("Unknown Command! Please type help to see all commands")
                rl.prompt()
            }
            switch (arg){
                case "help":
                    this.getLogger().info("Commands List:")
                    rl.prompt()
                    this.getLogger().info("stop: shutdown the server")
                    rl.prompt()
                    break;
                case "stop":
                    this.getLogger().info("Stopping Server...")
                    try{
                        this.raknet.shutdown()
                        rl.prompt()
                        this.getLogger().info("Server Stopped!")
                        rl.close()
                    }catch (e){
                        this.getLogger().error("Cannot Stop the server reason: " + e.errorDetail)
                    }
                    process.exit(1)
                    break;
            }
        })
    }
}

module.exports = Server