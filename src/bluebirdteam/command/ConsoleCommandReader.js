const readline = require('readline')

class ConsoleCommandReader {

    constructor(server) {
        this.server = server
    }

    tick(){
        let rl = readline.createInterface(
            {
                input: process.stdin
            }
        )
        rl.on("line", (input) => {
            if(input === "stop" || input === "help" || input === ""){}else{
                this.server.getLogger().info("Unknown Command! Please type help to see all commands")
            }
            switch (input){
                case "help":
                    this.server.getLogger().info("Commands List:")
                    this.server.getLogger().info("stop: shutdown the server")
                    break;
                case "stop":
                    this.server.getLogger().info("Stopping Server...")
                    try{
                        this.server.raknet.shutdown()
                        this.server.getLogger().info("Server Stopped!")
                    }catch (e){
                        this.server.getLogger().error("Cannot Stop the server reason: " + e.errorDetail)
                        this.server.getLogger().alert("Closing Server...");
                    }
                    process.exit(1)
                    break;
            }
        })
    }
}

module.exports = ConsoleCommandReader
