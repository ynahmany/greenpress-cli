const { chooseLocal, getAppArgs, handleStartupProgress } = require('../services/start');
const { green, blue, red } = require('../utils/colors');
const { appendToDockerConfig, cleanDockerConfig } = require('../services/docker-service');
const { exec, spawn } = require('child_process');
const { join } = require('path');

const scale = 'local';

async function startCommand (mode = 'user', options) {
	if (!(await cleanDockerConfig())) {
		console.log(red('Failed to clear env contents, exiting!'));
		process.exit(1);
	}

	if (options.local) {
		if (!(await chooseLocal(mode, options.local))) {
			console.log(red('Chose invalid local options, exiting!'));
			process.exit(1);
		}
	}

	if (options.exclude) {
		if (! (await appendToDockerConfig(`npm_config_x=${options.exclude}`))) {
			console.log(red('Failed to set excluded services!'));
			process.exit(1);
		}
	}

	const appArgs = await getAppArgs(mode);
	const childArgs = { 
		cwd: join(process.cwd(), 'compose')
	};
	
	console.log(blue('Initializing Greenpress..'));
	console.log(blue('Doing our magic, might take a few minutes. Please wait.'));

	const child = spawn('npm', appArgs, childArgs);

	child.on('error', (err) => {
		console.log(red(`\nAn error occured while starting greenpress! Error:\n`), err);
		process.exit(1);
	});

	try {
		await handleStartupProgress(scale, child);
		console.log(green('Server is running!'));
		console.log(`\n\rTo stop it, use: ${blue('greenpress stop')}`);
		console.log(`\rTo populate it, use: ${blue('greenpress populate')}`);
		process.exit(0);
	} catch (err) {
		console.log('An error occured during server startup');
		process.exit(1);
	}
}

module.exports = {
	startCommand
}