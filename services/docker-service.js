const fs = require('fs');
const { join } = require('path');
const { red } = require('../utils/colors');

const composeConfigFile = join(process.cwd(), 'compose', 'greenpress.local.env');

async function appendToDockerConfig(data) {
	try {
		if (!fs.existsSync(composeConfigFile)) {
			fs.writeFile(composeConfigFile, '', { flag: 'w' }, function (e) {
				if (e) {
					return false;
				}
			});
		}

		fs.appendFileSync(composeConfigFile, `${data}\n`);
	} catch (e) {
		console.log(red(`Failed to append data to greenpress.local.env. Error: ${e.message}`));
		return false;
	}

	return true;
}

async function cleanDockerConfig() {
	try {
		if (fs.existsSync(composeConfigFile)) {
			fs.truncateSync(composeConfigFile, 0);
		}
	} catch (e) {
		console.log(red(`Failed to clean greenpress.local.env. Error: ${e.message}`));
		return false;
	}

	return true;
}

module.exports = {
	appendToDockerConfig,
	cleanDockerConfig
}