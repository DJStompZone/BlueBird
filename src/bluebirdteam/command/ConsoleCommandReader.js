const readline = require('readline')
const Logger = use("log/Logger")

class ConsoleCommandReader {

    constructor(server) {
        this.server = server
        this.logger = new Logger()
    }

    tick(){
        let rl = readline.createInterface(process.stdin, process.stdout)
        rl.prompt()
        rl.on("line", (arg) => {
            if(arg !== "stop" || arg !== "help"){
                rl.prompt()
            }
            if(arg === "stop" || arg === "help" || arg === ""){}else{
                this.logger.info("Unknown Command! Please type help to see all commands")
                rl.prompt()
            }
            switch (arg){
                case "help":
                    rl.prompt()
                    this.logger.info("Commands List:")
                    rl.prompt()
                    this.logger.info("stop: shutdown the server")
                    rl.prompt()
                    break;
                case "stop":
                    rl.prompt()
                    this.logger.info("Stopping Server...")
                    try{
                        this.server.raknet.shutdown()
                        rl.prompt()
                        this.logger.info("Server Stopped!")
                        rl.close()
                    }catch (e){
                        rl.prompt()
                        this.logger.error("Cannot Stop the server reason: " + e.errorDetail)
                    }
                    process.exit(1)
                    break;
            }
        })
    }
}

module.exports = ConsoleCommandReader