const { chooseLocal, getAppArgs } = require('../services/start');
const { green, blue, red } = require('../utils/colors');
const { appendToDockerConfig, cleanDockerConfig } = require('../utils/dockerConfig');
const { execSync } = require('child_process');
const { join } = require('path');
const exec = require('util').promisify(require('child_process').exec);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
	console.log(appArgs)
	console.log(blue('Initializing Greenpress..'));
	
	execSync( ['npm', ...appArgs].join(' '), childArgs);

	const serverStatus = await checkServerUp(0);
	if (serverStatus) {
		console.log(green('Server is running!'));
		console.log(`\n\rTo stop it, use: ${blue('greenpress stop')}`);
		console.log(`\rTo populate it, use: ${blue('greenpress populate')}`);
		process.exit(0);
	} 

	console.log('Server took to long to run');
	process.exit(1);
}

async function checkServerUp(idx) {
	const sleepTime = 5000;
	if (idx == 25) {
		return false;
	}

	try {
		const { stdout } = await exec('docker logs greenpress_greenpress_1');
	
		const serverOutput = await checkServerLog(stdout);
		if ('READY  Server listening' === serverOutput) {
			return true;
		} 
		
		if ('PM2 successfully stopped' === serverOutput) {
			console.log(red('An error occurred, check server logs to see what happened'));
			process.exit(1);
		}
	} catch (e) {
		await sleep(sleepTime);
		return checkServerUp(idx + 1);
	}
	
	await sleep(sleepTime);
	return checkServerUp(idx + 1);
}

async function checkServerLog(stdout) {
	if (stdout.toString().includes('READY  Server listening')) {
		return 'READY  Server listening';
	}
	
	if (stdout.toString().includes('PM2 successfully stopped')) {
		return 'PM2 successfully stopped';
	}

	return '';
}

module.exports = {
	startCommand
}