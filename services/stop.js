const execute = require("../utils/execute");

function stopDB () {
    execute('npx pm2 stop db')
}

function stopAllServices () {
    execute(`npx pm2 stop all`)
}

function killAllServices () {
    execute(`npx pm2 kill`)
}

module.exports = {
    stopDB,
    stopAllServices,
    killAllServices
}