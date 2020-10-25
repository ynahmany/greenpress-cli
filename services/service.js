const execute  = require('../utils/execute');
const { red, green } = require('../utils/colors');
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
	let errN = 0;
	for (let service of services) {
		let cloneCommand = `git clone ${branchName !== undefined ? `-b ${branchName}` : ''} ${repos[service]}`;
		if (!(await execute(cloneCommand, `create ${service} service`, { cwd: devDir }))) {
			console.log(red(`Failed to clone ${service}`));
			errN += 1;
			continue;
		}
		
		console.log(join(devDir, repos[service].substring(repos[service].lastIndexOf('/') + 1)));
		if (!(await execute('npm install', `install local ${service}`, 
			{ cwd: join(devDir, repos[service].substring(repos[service].lastIndexOf('/') + 1)) }))) {
			console.log(red(`Failed to install ${service}`));
			errN += 1;
			continue;
		}

		console.log(green(`Successfully created local ${service}`));
	}

	return errN;
}

module.exports = {
	createServices,
	createDevDir
}