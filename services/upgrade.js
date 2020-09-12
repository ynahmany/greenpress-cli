const accept = require('../utils/acceptance');
const https = require('https');
const { green, yellow } = require('../utils/colors');

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
	return require(process.env.PWD + '/package.json');
}

function getRemotePackage() {
	return 'https://raw.githubusercontent.com/greenpress/greenpress/master/package.json';
}
module.exports = {
	checkAndUpgradeDependency,
	getJSON,
	getLocalPackage,
	getRemotePackage
}