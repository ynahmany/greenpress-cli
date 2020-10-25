const accept = require('../utils/acceptance');
const fs = require('fs');
const https = require('https');
const { green, yellow } = require('../utils/colors');
const execute = require('../utils/execute');
const { join } = require('path');

const localPackagePath = join(process.cwd(), 'package.json');

function checkAndUpgradeDependency(name, currentValue, remoteValue) {
	return accept(`Would you like to upgrade to remote's version?`)
	       .then(answer => upgradeFunc(answer, name, remoteValue, currentValue));
}

function upgradeFunc(answer, name, remoteValue, currentValue) {
	if (answer) {
		console.log(green(`Upgrading ${name}`));
		return remoteValue;
	} else {
		console.log(yellow(`Not upgrading ${name}`));
		return currentValue;
	}
}

async function getJSON(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (resp) => {
			let data = '';
			resp.on('data', chunk => data += chunk);
			resp.on('end', () => resolve(JSON.parse(data)));
			resp.on('error', (err) => reject(err));
		});
	});
}

function getLocalPackage() {
	return require(localPackagePath);
}

async function getRemotePackage() {
	return await getJSON('https://raw.githubusercontent.com/greenpress/greenpress/master/package.json');
}

async function saveUpdatedPackage(localPackage) {
	try {
		fs.writeFileSync(localPackagePath, JSON.stringify(localPackage, null, 2));
	} catch (e) {
		console.log(`An error occured while saving package.json: ${e.message}`);
	}

	console.log(yellow('Installing upgraded Greenpress'));
	return execute('npm install');
}

module.exports = {
	checkAndUpgradeDependency,
	saveUpdatedPackage,
	getLocalPackage,
	getRemotePackage
}