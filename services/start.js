const { spawn } = require('child_process');
const { green, blue, red } = require('../utils/colors');

const servicesEnvsAndRepos = {
	'auth': ['AUTH_SERVICE_CWD', 'authentication-service'],
	'secrets': ['SECRETS_SERVICE_CWD', 'secrets-service'],
	'assets': ['ASSETS_SERVICE_CWD', 'assets-service'],
	'content': ['CONTENT_SERVICE_CWD', 'content-service'],
	'admin': ['ADMIN_SERVICE_CWD', 'admin-panel'],
	'front': ['FRONT_SERVICE_CWD', 'blog-front']
};

function setDevRepo(service) {
	if (servicesEnvsAndRepos[service] !== undefined) {
		process.env[servicesEnvsAndRepos[service][0]] = process.cwd() + '/dev/' + servicesEnvsAndRepos[service][1];
		return true;
	} 
	
	return false;
}

async function waitForServerReady(spawnArgs) {
	const child = spawn('npm', spawnArgs, { detached: true });
	child.stdout.on('data', (data) => {
		if(data && data.toString().includes('READY  Server listening')) {
			return true;
		}
	});

	child.on('error', (error) => {
		console.log(`error: ${error}`);
		return false;
	});

	return true;
}


async function chooseLocal(mode, localServices) {
	if (mode === 'dev' && localServices) {
		console.log(blue(`Chose to locally run ${localServices} services`));
		for (const service of localServices.split(',')) {
			if (setDevRepo(service) === true) {
				console.log(green(`Set ${service} to dev path!`));
			} else {
				console.log(red(`${service} is not a valid option!`));
				return false;
			}
		}
	}

	return true;
}

async function getAppArgs(mode, excludedServices) {
	const appArgs = mode === 'user' ? [ 'start' ] : [ 'run', 'dev' ];
	if (typeof excludedServices === 'string') {
		appArgs.push(`--x=${excludedServices}`);
	}

	return appArgs
}

module.exports = {
	chooseLocal,
	getAppArgs
}