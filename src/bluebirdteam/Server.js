const RakNetApdater = use("network/mcpe/RakNetApdater")

class Server{
    constructor() {
        this.raknet = new RakNetApdater(this)
    }
}

module.exports = Server