const { appendToDockerConfig } = require('../utils/dockerConfig');
const { join } = require('path');
const { green, blue, red } = require('../utils/colors');

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

module.exports = {
	chooseLocal,
	getAppArgs
}