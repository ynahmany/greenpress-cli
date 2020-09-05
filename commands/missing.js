const { execSync } = require('child_process');
const { green, red } = require('../utils/colors');
const dependencies = [['git', 'https://git-scm.com/downloads'], 
					  ['docker', 'https://docs.docker.com/get-docker/'],
					  ['node', 'https://nodejs.org/en/download/']];

// 'missing'
// 'checks if Greenpress dependencies are installed'
function missing () {
	dependencies.forEach(checkDependencyVersion);
}

function checkDependencyVersion(dep) {	
	try {
		const versionCommand = dep[0] + " --version";
		const version = execSync(versionCommand).toString();
		if(version.includes('not')) {
			console.log(`${red(`${dep[0]} is not installed!`)} To download:\n${dep[1]}`);
		}
		else {
			console.log(`${green(`${dep[0]} is installed!`)} Installed version: ${version}`);
		}
	} catch (ex) {
		console.log(`An exception was thrown: ${ex.stdout}`);
	};
}

module.exports = missing;