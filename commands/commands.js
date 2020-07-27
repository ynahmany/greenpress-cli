const fs = require('fs');
const https = require('https');
const remotePackagePath = "https://raw.githubusercontent.com/greenpress/greenpress/master/package.json";
const interface = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

function setCreateCommand(program) {
    program
    .command('create [name] [type]')
    .description('create a new website using greenpress')
    .action(function(name = 'greenpress', type = 'pm2') {
		console.log(`will clone greenpress-${type} inside /${name} directory`);
		interface.close();
    });
}

function setUpgradeCommand(program) {
	program
	.command('upgrade')
	.description('upgrade modules to their latest version')
	.action(async function() {
		// const localPackagePath = __dirname + "/package.json";
		const localPackagePath = "/home/dror/git/open_source/test/package.json";
		

		// create local json objects for package.json from local and remote repos
		let localPackage = require(localPackagePath);
		const remotePackage = await downloadRemotePackageJson(remotePackagePath);

		// update needed dependencies
		for (const name in localPackage.dependencies) {
			const value = localPackage.dependencies[name];
			console.log(`Checking ${name} version`);
			if (remotePackage.dependencies[name] !== value) {
				console.log(`Found a difference in ${name}:\n
				local: ${value} <--> ${remotePackage.dependencies[name]} :remote\n`);
				localPackage.dependencies[name] = await checkAndUpgradeDependency(name, value, remotePackage);
				console.log(`Updated ${name}'s version to: ${localPackage.dependencies[name]}`);
			}
			else {
				console.log(`${name}'s version is the latest! Proceeding.`)
			}
		}

		// // save updated json
		fs.writeFileSync(localPackagePath, JSON.stringify(localPackage, null, 4));
		console.log('Upgrade ended successfully!');
		interface.close();
	});
}

function downloadRemotePackageJson(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (resp) => {
			let data = '';
		
			resp.on('data', chunk => data += chunk);
			resp.on('end', () => resolve(JSON.parse(data)));
			resp.on('error', (err) => reject(err));
		});
	});
};

function checkAndUpgradeDependency(name, value, remotePackage) {
	return new Promise((resolve, reject, name, value, remotePackage) => {
		// console.log(name, value, remotePackage);
		interface.question(`Would you like to upgrade to remote's version? [y/n]`, 
		function(input, name, value, remotePackage) {
								if (input === "y") {
									console.log(`Upgrading ${name}`);
									resolve(remotePackage.dependencies[name]);
								}
								else {
									console.log(`Not upgrading ${name}`);
									resolve(value)
								}
							});
		});
}
module.exports = {
	create: setCreateCommand,
	upgrade: setUpgradeCommand
};