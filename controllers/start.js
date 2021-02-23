const { chooseLocal, getAppArgs, 
	    initializeGreenpress, waitForServerStartup } = require('../services/start');
const { green, blue, red } = require('../utils/colors');
const { appendToDockerConfig, cleanDockerConfig } = require('../services/docker-service');
const { join } = require('path');

const scale = 'local';

async function startCommand (mode = 'user', options) {
	if (!(await cleanDockerConfig())) {
		console.log(red('Failed to clear env contents, exiting!'));
		process.exit(1);
	}

	console.log(green('Cleared previous env contents!'));

	if (options.local) {
		console.log(blue(`${options.local} passed as local services, checking their validity.`));
		if (!(await chooseLocal(mode, options.local))) {
			console.log(red('Chose invalid local options, exiting!'));
			
			process.exit(1);
		}

		console.log(green('Set local services successfully!'));
	}


	if (options.exclude) {
		console.log(blue(`${options.exclude} were chosen to be excluded.`))
		if (! (await appendToDockerConfig(`npm_config_x=${options.exclude}`))) {
			console.log(red('Failed to set excluded services!'));
			
			process.exit(1);
		}
		
		console.log(green('Excluded required services successfully!'));
	}


	const appArgs = await getAppArgs(mode);
	const childArgs = { 
		cwd: join(process.cwd(), 'compose')
	};
	
	const child = initializeGreenpress(appArgs, childArgs);
	await waitForServerStartup(scale, child);
}

module.exports = {
	startCommand
}