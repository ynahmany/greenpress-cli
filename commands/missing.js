const { spawn } = require('child_process');
const dependencies = ['git', 'docker', 'node'];

function setMissingCommand(program) {
	program
		.command('missing')
		.description('checks if Greenpress dependencies are installed')
		.action( function() {
			dependencies.forEach(checkDependencyVersion);
		});
}

async function checkDependencyVersion(depName) {
	const spawnArgs = ['--version']
	const child = spawn(depName, spawnArgs, { detached: true });

	child.stdout.on('data', (data) => {
		if(data && data.toString().toLowerCase().includes('not')) {
			console.log(`${depName} is not installed! You should install it so Greenpress can run properly.`);
		}
		else {
			console.log(`${depName} is installed!`);
		}
	});
}

module.exports = setMissingCommand;