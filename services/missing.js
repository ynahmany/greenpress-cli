const { execSync } = require('child_process');
const { green, red } = require('../utils/colors');

function checkDependencyVersion(app, installLink) {
	try {
		const versionCommand = app + " --version";
		const version = execSync(versionCommand).toString();
		if (version.includes('not')) {
			console.log(`${red(`${app} is not installed!`)} To download:\n${installLink}`);
		} else {
			console.log(`${green(`${app} is installed!`)} Installed version: ${version}`);
		}
	} catch (err) {
		console.log(`An exception was thrown: ${err.stdout}`);
	}
}

module.exports = { checkDependencyVersion };
