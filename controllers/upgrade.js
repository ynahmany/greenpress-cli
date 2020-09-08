const fs = require('fs');
const accept = require('../utils/acceptance');
const remotePackagePath = 'https://raw.githubusercontent.com/greenpress/greenpress/master/package.json';
const { green, yellow } = require('../utils/colors');
const { checkAlldeps, getJSON } = require('../services/upgrade');

// 'upgrade'
// 'upgrade modules to their latest version'
async function update () {
	const localPackagePath = process.env.PWD + '/package.json';

	// create local json objects for package.json from local and remote repos
	const localPackage = require(localPackagePath);
	const { dependencies = {} } = await getJSON(remotePackagePath);
	const localDependencies = localPackage.dependencies || {};

	console.log('checking for outdated dependencies...');

	// update needed dependencies
	checkAlldeps(dependencies, localDependencies, checkAndUpgradeDependency);

	// // save updated json
	fs.writeFileSync(localPackagePath, JSON.stringify(localPackage, null, 2));
	console.log('Upgrade ended successfully!');
}

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
module.exports = update;
