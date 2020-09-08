const { execSync } = require('child_process');
const { green, blue } = require('../utils/colors');
const { stopDB, stopAllServices, killAllServices } = require('../services/stop');

// 'stop'
// 'stop greenpress application'
function stop () {

	console.log(blue('Stopping greenpress...'));
	stopDB()
	stopAllServices()
	killAllServices()
	console.log(green("Greenpress stopped"));
	process.exit(0);
}

module.exports = stop;
