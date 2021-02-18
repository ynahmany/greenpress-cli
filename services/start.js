const fs = require('fs');
const cliProgress = require('cli-progress');
const { join } = require('path');
const { appendToDockerConfig } = require('../services/docker-service');
const { green, blue, red, yellow } = require('../utils/colors');
const exec = require('util').promisify(require('child_process').exec);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const servicesEnvsAndRepos = {
	'auth': ['AUTH_SERVICE_CWD', 'authentication-service'],
	'secrets': ['SECRETS_SERVICE_CWD', 'secrets-service'],
	'assets': ['ASSETS_SERVICE_CWD', 'assets-service'],
	'content': ['CONTENT_SERVICE_CWD', 'content-service'],
	'admin': ['ADMIN_SERVICE_CWD', 'admin-panel'],
	'front': ['FRONT_SERVICE_CWD', 'blog-front'],
	'drafts': ['DRAFTS_SERVICE_CWD', 'drafts-service']
};

function getDevPath(service) {
	return servicesEnvsAndRepos[service] !== undefined ?
	       `${servicesEnvsAndRepos[service][0]}=${join('dev', servicesEnvsAndRepos[service][1])}\n` :
	       '';
}

async function setLocalServicesDevPath(localServices) {
	let servicesPaths = '';
	for (const service of localServices) {
		const servicePath = getDevPath(service);
		if (servicePath !== '') {
			if (!fs.existsSync(servicePath.slice(0,-1).split('=')[1])) {
				console.log(yellow(`${service} wasn't created as local service. Skipping it!`));
				continue;
			}
			console.log(green(`Set ${service} to dev path!`));
			servicesPaths += `${servicePath}\n`;
		} else {
			console.log(red(`${service} is not a valid option!`));
			return [ false, '' ];
		}
	}

	return [ true, servicesPaths ];
}

async function chooseLocal(mode, localServices) {
	let servicesPaths = '';
	if (mode === 'dev') {
		if (localServices === 'all') {
			console.log(blue(`Chose to locally run all local services`));
			localServices = Object.keys(servicesEnvsAndRepos);
		}
		else {
			console.log(blue(`Chose to locally run ${localServices} services`));
			localServices = localServices.split(',');
		}

		const [ retVal, servicesPaths ] = await setLocalServicesDevPath(localServices);
		if (!retVal) {
			console.log(red('Failed to set local services dev path!'));

			return false;
		}
	}

	return appendToDockerConfig(servicesPaths);
}

async function getAppArgs(mode) {
	return mode === 'user' ? [ 'run', 'local' ] : [ 'run', 'local:dev' ];
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
			updateProgressBar('100');
			return true;
		} 
		
		if ('PM2 successfully stopped' === serverOutput) {
			console.log(red('An error occurred, check server logs to see what happened'));
			process.exit(1);
		}

		updateProgressBar(serverOutput);
	} catch (e) {
		await sleep(sleepTime);
		return checkServerUp(idx + 1);
	}
	
	await sleep(sleepTime);
	return checkServerUp(idx + 1);
}

async function checkServerLog(stdout) {
	const output = stdout.toString();
	if (output.includes('READY  Server listening')) {
		return 'READY  Server listening';
	}
	
	if (output.includes('PM2 successfully stopped')) {
		return 'PM2 successfully stopped';
	}

	if (output.includes('Content Service is running on port')) {
		return '90';
	}

	if (output.includes('Assets Service is running on port')) {
		return '75';
	}
	
	if (output.includes('Authentication Service is running on port')) {
		return '60';
	}
	
	if (output.includes('Secrets Service is running on port')) {
		return '45';
	}

	if (output.includes('Drafts Service is running on port')) {
		return '30';
	}

	if (output.includes('Admin front-server is up on port')) {
		return '15';
	}

	return '0';
}

function initProgressBar() {
	progressBar.start(100, 0);
}

function updateProgressBar(serverOutput) {
	progressBar.getTotal()
	progressBar.update(parseInt(serverOutput, 10));
}

function stopProgressBar() {
	progressBar.stop();
}

async function handleStartupProgress() {
	initProgressBar();

	const serverStatus = await checkServerUp(0);
	
	stopProgressBar();

	return serverStatus;
}

module.exports = {
	chooseLocal,
	getAppArgs,
	handleStartupProgress
}