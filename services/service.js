const { execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const devDir = process.cwd() + '/dev';
const repos = {
	'auth': 'https://github.com/greenpress/authentication-service',
	'admin': 'https://github.com/greenpress/admin-panel',
	'secrets': 'https://github.com/greenpress/secrets-service',
	'assets': 'https://github.com/greenpress/assets-service',
	'content': 'https://github.com/greenpress/content-service',
	'front': 'https://github.com/greenpress/blog-front'
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
		try {
			execSync(cloneCommand, (error, stdout, stderr) => {
				if (error) {
					console.log(error.message);
					return;
				}
	
				if (stderr) {
					console.log(stderr);
					return;
				}
				console.log(stdout);
			});
		} catch (e) {
			console.log(`An error occured during creation of ${service}: ${e.message}`)
		}

	}
}

module.exports = {
	createServices,
	createDevDir
}