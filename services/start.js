const fs = require('fs');
const { join } = require('path');
const { spawn } = require('child_process');
const { appendToDockerConfig } = require('./docker-service');
const { green, blue, red, yellow } = require('../utils/colors');
const { initProgressBar, stopProgressBars, 
		checkImagesUp, checkServerLog} = require('../utils/start-progress-bar')

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

async function handleStartupProgress(scale, child) {
	let currentType = 'images';

	try {
		initProgressBar(currentType);
		await checkImagesUp(scale, child);
		console.log(green('\nAll images are running!\n'));

		currentType = 'services';
		
		initProgressBar(currentType)
		await checkServerLog(scale);
		console.log(green('\nAll services are running!'));
	} catch (err) {
		console.log(red(`\n${err}`));
		stopProgressBars();

		throw err;
	}
	
	return stopProgressBars();
}

function initializeGreenpress(appArgs, childArgs) {
	console.log(blue('Initializing Greenpress..\n'));
	console.log(blue('Doing our magic, might take a few minutes. Please wait.\n'));

	const child = spawn('npm', appArgs, childArgs);

	child.on('error', (err) => {
		console.log(red(`\nAn error occured while starting greenpress! Error:\n`), err);
		process.exit(1);
	});

	return child;
}

async function waitForServerStartup(scale, child) {
	try {
		await handleStartupProgress(scale, child);
		console.log(green('\nServer is running!'));
		console.log(`\n\rTo stop it, use: ${blue('greenpress stop')}`);
		console.log(`\rTo populate it, use: ${blue('greenpress populate')}`);
		console.log(`\rTo enter your app: http://localhost:3000`);
		process.exit(0);
	} catch (err) {
		console.log('An error occured during server startup');
		process.exit(1);
	}
}

module.exports = {
	chooseLocal,
	getAppArgs,
	initializeGreenpress,
	waitForServerStartup
}