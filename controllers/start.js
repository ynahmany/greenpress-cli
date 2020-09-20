const { green, blue, red } = require('../utils/colors');
const { chooseLocal, getAppArgs } = require('../services/start');
const { spawn } = require('child_process');

async function startCommand (mode = 'user', options) {
	if (!(await chooseLocal(mode, options.local))) {
		console.log(red('Chose invalid local options, exiting!'));
		process.exit(1);
	}

	const appArgs = await getAppArgs(mode, options.exclude);
	const childArgs = { detached: true };
	if (options.debug) {
		childArgs.stdio = 'inherit';
	}

	console.log(blue('Initializing Greenpress..'));
	
	const child = spawn('npm', appArgs, childArgs);
	if (!options.debug) {
		child.stdout.on('data', (data) => {
			if(data && data.toString().includes('READY  Server listening')) {
				console.log(green("Greenpress is running!"));
				console.log(`\n\rTo stop it, use: ${blue('greenpress stop')}`);
				console.log(`\rTo populate it, use: ${blue('greenpress populate')}`);
				process.exit(0);
			}
		});
	}

	child.on('error', (error) => {
		console.log(`error: ${error}`);
		process.exit(1);
	});
}

module.exports = {
	startCommand
}