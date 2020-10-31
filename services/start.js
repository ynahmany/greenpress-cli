const { appendToDockerConfig } = require('../services/docker-service');
const { join } = require('path');
const { green, blue, red } = require('../utils/colors');
const exec = require('util').promisify(require('child_process').exec);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

async function chooseLocal(mode, localServices) {
	let servicesPaths = '';
	if (mode === 'dev' && localServices) {
		console.log(blue(`Chose to locally run ${localServices} services`));
		for (const service of localServices.split(',')) {
			const servicePath = getDevPath(service);
			if (servicePath !== '') {
				console.log(green(`Set ${service} to dev path!`));
				servicesPaths += `${servicePath}\n`;
			} else {
				console.log(red(`${service} is not a valid option!`));
				return false;
			}
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
	chooseLocal,
	getAppArgs,
	checkServerUp,
	checkServerLog
}