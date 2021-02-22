const fs = require('fs');
const cliProgress = require('cli-progress');
const { join } = require('path');
const { appendToDockerConfig } = require('../services/docker-service');
const { green, blue, red, yellow } = require('../utils/colors');
const { spawn } = require('child_process');

const imagesProgressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const maxImagesBarValue = 20;
let imagesCurrentValue = 0;

const servicesProgressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const maxServicesBarValue = 80;
let servicesCurrentValue = 0;

const servicesEnvsAndRepos = {
	'auth': ['AUTH_SERVICE_CWD', 'authentication-service'],
	'secrets': ['SECRETS_SERVICE_CWD', 'secrets-service'],
	'assets': ['ASSETS_SERVICE_CWD', 'assets-service'],
	'content': ['CONTENT_SERVICE_CWD', 'content-service'],
	'admin': ['ADMIN_SERVICE_CWD', 'admin-panel'],
	'front': ['FRONT_SERVICE_CWD', 'blog-front'],
	'drafts': ['DRAFTS_SERVICE_CWD', 'drafts-service']
};

const localRunComponents = { images: {
								 step1: ["Step 1/8", 2.5],
								 step2: ["Step 2/8", 2.5],
								 step3: ["Step 3/8", 2.5],
								 step4: ["Step 4/8", 2.5],
								 step5: ["Step 5/8", 2.5],
								 step6: ["Step 6/8", 2.5],
								 step7: ["Step 7/8", 2.5] 
								},
							 services: {
								 admin: ["Admin front-server is up on port", 10],
								 assets: ["Assets Service is running on port", 10],
								 auth: ["Authentication Service is running on port", 10],
								 content: ["Content Service is running on port", 10],
								 drafts: ["Drafts Service is running on port", 10],
								 secrets: ["Secrets Service is running on port", 10],
								 front: ["READY  Server listening", 20]
								}
						   };

let incrementedComponents = { step1: false,
							  step2: false,
							  step3: false,
							  step4: false,
							  step5: false,
							  step6: false,
							  step7: false,
						      greenpress: false,
						      admin: false,
						      assets: false,
						      auth: false,
						      content: false,
						      drafts: false,
						      secrets: false,
							  front: false
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

async function checkServerStartUpProgress(scale, child) {
	const componentByScale = scale === 'local' ? localRunComponents : localRunComponents;
	let currentType = 'images';
	try {
		initProgressBar(currentType);
		await checkImagesUp(componentByScale.images, child);
		// let errN = stopProgressBar(currentType) ? 0 : 1;
		console.log(green('\nAll images are running!'));
		currentType = 'services';
		await checkServerLog(componentByScale.services);
		// errN += stopProgressBar(currentType) ? 0 : 1;
		console.log(green('\nAll services are running!'));
	} catch (err) {
		console.log(red(err));
		stopProgressBar(currentType);

		throw err;
	}
	
	return stopProgressBar(currentType);
}

function checkImagesUp(imagesDetails, child) {
	return new Promise((resolve, reject) => {
		child.on('error', (err) => {
			console.log(red(`An error occured while checking images startup. Error: ${err}`));
	
			reject('Failed to run all images!');
		});
	
		child.stdout.on('data', (data) => {
			const output = data.toString();
			updateComponentState(imagesDetails, 'images', output);
		});

		child.on('exit', () => {
			imagesProgressBar.increment(2.5);
			imagesCurrentValue += 2.5;
			if (imagesCurrentValue === maxImagesBarValue) {
				resolve();
			}
		});
	});
}

function checkServerLog(servicesDetails) {
	return new Promise((resolve, reject) => {
		const logs = spawn('docker', ['logs', 'greenpress_greenpress_1', '--follow']);
		logs.on('error', (err) => {
			reject(`Failed to run all services! error: ${err}`);
		});
	
		logs.on('exit', (data) => {
			console.log(data);
			reject('premature exit');
		});

		logs.stdout.on('data', (data) => {
			const output = data.toString();
			if (output.includes('PM2 successfully stopped')) {
				reject(`PM2 stopped. Latest output before error:\n ${output}`);
			} else {
				updateComponentState(servicesDetails, 'services', output);
			}
			
			if (servicesCurrentValue === maxServicesBarValue) {
				resolve();
			}
		});					
	});
}

function updateComponentState(componentsDetails, type, output) {
	const components = Object.keys(componentsDetails);
	components.forEach((component) => {
		if (!incrementedComponents[component] && 
			output.includes(componentsDetails[component][0])) {
			updateProgressBar(componentsDetails[component][1], type);
			incrementedComponents[component] = true;
		}
	});
}

function initProgressBar(type) {
	if (type === 'images') {
		imagesProgressBar.start(maxImagesBarValue, 0);
	} else {
		servicesProgressBar.start(maxServicesBarValue, 0);
	}
}

function updateProgressBar(serviceContribution, type) {
	if (type === 'images') {
		imagesProgressBar.increment(serviceContribution);
		imagesCurrentValue += serviceContribution;
	} else {
		servicesProgressBar.increment(serviceContribution);
		servicesCurrentValue += serviceContribution;
	}
}

function stopProgressBar(type) {
	let progressFinalValue = 0;

	if (type === 'images') {
		imagesrogressBar.stop();
		progressFinalValue = imagesCurrentValue;
		imagesCurrentValue = 0;

		return imagesCurrentValue === maxImagesBarValue;
	} 
	
	servicesProgressBar.stop();
	progressFinalValue = servicesCurrentValue;
	servicesCurrentValue = 0;

	return progressFinalValue === maxServicesBarValue;
}

function handleStartupProgress(scale, child) {
	initProgressBar();

	return checkServerStartUpProgress(scale, child);
}

module.exports = {
	chooseLocal,
	getAppArgs,
	handleStartupProgress
}