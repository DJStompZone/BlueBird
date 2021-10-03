'use strict'

const Path = require("path")

global.use = function (path){
    return require(Path.normalize(`./src/bluebirdteam/${path}`))
}