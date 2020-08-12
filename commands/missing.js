const { spawn } = require('child_process');
const dependencies = [['git', 'https://git-scm.com/downloads'], 
					  ['docker', 'https://docs.docker.com/get-docker/'],
					  ['node', 'https://nodejs.org/en/download/']];

function setMissingCommand(program) {
	program
		.command('missing')
		.description('checks if Greenpress dependencies are installed')
		.action( function() {
			dependencies.forEach(checkDependencyVersion);
		});
}

async function checkDependencyVersion(dep) {
	const spawnArgs = ['--version']
	const child = spawn(dep[0], spawnArgs, { detached: true });

	child.stdout.on('data', (data) => {
		if(data && data.toString().toLowerCase().includes('not')) {
			console.log(`${dep[0]} is not installed! To download:\n${dep[1]}`);
		}
		else {
			console.log(`${dep[0]} is installed! Installed version: ${data.toString()}`);
		}
	});
}

module.exports = setMissingCommand;