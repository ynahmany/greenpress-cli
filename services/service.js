const execute  = require('../utils/execute');
const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const devDir = join(process.cwd(), 'dev');
const repos = {
	'auth': 'https://github.com/greenpress/authentication-service',
	'admin': 'https://github.com/greenpress/admin-panel',
	'secrets': 'https://github.com/greenpress/secrets-service',
	'assets': 'https://github.com/greenpress/assets-service',
	'content': 'https://github.com/greenpress/content-service',
	'front': 'https://github.com/greenpress/blog-front',
	'drafts': 'https://github.com/greenpress/drafts-service'
};

function createDevDir() {
	if (!existsSync(devDir)) {
		mkdirSync(devDir);
	}
}

async function createServices(services, branchName = undefined) {
	for (let service of services) {
		let cloneCommand = `cd ${devDir} && 
							git clone ${branchName !== undefined ? `-b ${branchName}` : ''} ${repos[service]} &&
							cd ${repos[service].substring(repos[service].lastIndexOf('/') + 1)} &&
							npm install`
		console.log(cloneCommand);
		if (!(await execute(cloneCommand, `create ${service} service`))) {
			errN += 1;
		}
	}
}

module.exports = {
	createServices,
	createDevDir
}