const fs = require('fs');
const { getJSON, checkAndUpgradeDependency } = require('../services/upgrade')
const remotePackagePath = 'https://raw.githubusercontent.com/greenpress/greenpress/master/package.json';
const { blue } = require('../utils/colors');

async function upgradeController() {
	const localPackagePath = process.env.PWD + '/package.json';

	// create local json objects for package.json from local and remote repos
	const localPackage = require(localPackagePath);
	const { dependencies = {} } = await getJSON(remotePackagePath);
	const localDependencies = localPackage.dependencies || {};

	console.log('checking for outdated dependencies...');

	// update needed dependencies
	for (const name in dependencies) {
		const remoteValue = dependencies[name];
		const currentValue = localDependencies[name];
		console.log(`Checking ${blue(name)} version`);
		if (remoteValue !== currentValue) {
			console.log(`Found a difference in ${blue(name)}:\n
		local: ${currentValue} <--> ${remoteValue} :remote\n`);
			localDependencies[name] = await checkAndUpgradeDependency(name, currentValue, remoteValue);
			console.log(`Updated ${blue(name)}'s version to: ${localDependencies[name]}`);
		} else {
			console.log(`${blue(name)}'s version is the latest! Proceeding.`)
		}
	}

	// // save updated json
	fs.writeFileSync(localPackagePath, JSON.stringify(localPackage, null, 2));
	console.log('Upgrade ended successfully!');
}

module.exports = upgradeController