const { execSync } = require('child_process');
const dependencies = [['git', 'https://git-scm.com/downloads'], 
					  ['docker', 'https://docs.docker.com/get-docker/'],
					  ['node', 'https://nodejs.org/en/download/']];

function setMissingCommand(program) {
	program
	.command('missing')
	.description('checks if Greenpress dependencies are installed')
	.action(function() {
		dependencies.forEach(checkDependencyVersion);
	});
}

function checkDependencyVersion(dep) {	
	try {
		const versionCommand = dep[0] + " --version";
		const version = execSync(versionCommand).toString();
		if(version.includes('not')) {
			console.log(`${dep[0]} is not installed! To download:\n${dep[1]}`);
		}
		else {
			console.log(`${dep[0]} is installed! Installed version: ${version}`);
		}
	} catch (ex) {
		console.log(`An exception was thrown: ${ex.stdout}`);
	};
}

module.exports = setMissingCommand;