const { checkAndUpgradeDependency, saveUpdatedPackage,
		getLocalPackage, getRemotePackage } = require('../services/upgrade')
const { blue, green, red } = require('../utils/colors');

async function upgradeController() {
	// create local json objects for package.json from local and remote repos
	const localPackage = getLocalPackage();
	const { dependencies = {} } = await getRemotePackage();
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

	// save updated json
	if (!(await saveUpdatedPackage(localPackage))) {
		console.log(red('Upgrade failed!'));
	}
	
	console.log(green('Upgrade ended successfully!'));
}

module.exports = upgradeController