const fs = require('fs');
const https = require('https');
const accept = require('../utils/acceptance');
const remotePackagePath = 'https://raw.githubusercontent.com/greenpress/greenpress/master/package.json';
const { green, blue, yellow } = require('../utils/colors');

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

function getJSON(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (resp) => {
			let data = '';
			resp.on('data', chunk => data += chunk);
			resp.on('end', () => resolve(JSON.parse(data)));
			resp.on('error', (err) => reject(err));
		});
	});
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
