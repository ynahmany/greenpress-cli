const cliProgress = require('cli-progress');
const { spawn } = require('child_process');

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

const imagesProgressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const maxImagesBarValue = 20;
let imagesCurrentValue = 0;

const servicesProgressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const maxServicesBarValue = 80;
let servicesCurrentValue = 0;


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

function stopProgressBar(type) {
	let progressFinalValue = 0;

	if (type === 'images') {
		imagesProgressBar.stop();
		progressFinalValue = imagesCurrentValue;
		imagesCurrentValue = 0;

		return imagesCurrentValue === maxImagesBarValue;
	} 
	
	servicesProgressBar.stop();
	progressFinalValue = servicesCurrentValue;
	servicesCurrentValue = 0;

	return progressFinalValue === maxServicesBarValue;
}

function stopProgressBars() {
	stopProgressBar('images');

	return stopProgressBar('services');
}

function checkImagesUp(scale, child) {
	const imagesDetails = scale === 'local' ? localRunComponents.images : localRunComponents.images;
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

function checkServerLog(scale) {
	const servicesDetails = scale === 'local' ? localRunComponents.services : localRunComponents.services;
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

module.exports = {
	initProgressBar,
	stopProgressBars,
	checkImagesUp,
	checkServerLog
}