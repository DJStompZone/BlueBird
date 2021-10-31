const readline = require('readline')
const Logger = use("log/Logger")

class ConsoleCommandReader {

    constructor(server) {
        this.server = server
        this.logger = new Logger()
    }

    tick(){
        let rl = readline.createInterface(
            {
                input: process.stdin
            }
        )
        rl.on("line", (input) => {
            if(input === "stop" || input === "help" || input === ""){}else{
                this.logger.info("Unknown Command! Please type help to see all commands")
            }
            switch (input){
                case "help":
                    this.logger.info("Commands List:")
                    this.logger.info("stop: shutdown the server")
                    break;
                case "stop":
                    this.logger.info("Stopping Server...")
                    try{
                        this.server.raknet.shutdown()
                        this.logger.info("Server Stopped!")
                    }catch (e){
                        this.logger.error("Cannot Stop the server reason: " + e.errorDetail)
                    }
                    process.exit(1)
                    break;
            }
        })
    }
}

module.exports = ConsoleCommandReader
