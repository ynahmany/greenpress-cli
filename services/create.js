const fs = require('fs');
const execute = require('../utils/execute');
const { blue } = require('../utils/colors');
const { join } = require('path');

async function clone(name, type = 'default') {
	const repoPath = type === 'pm2' ?
		'https://github.com/greenpress/greenpress-pm2' :
		'https://github.com/greenpress/greenpress';

	return await execute(`git clone ${repoPath} ${name}`, 'clone greenpress')
}

function setServiceVersion(packagePath, service, version) {
	console.log(blue(`setting ${service} to ${version}`));
	const projectPackage = require(packagePath);
	projectPackage.dependencies[`@greenpress/${service}`] = version;
	fs.writeFileSync(packagePath, JSON.stringify(projectPackage, null, 2))
}

function renameOrigin(name) {
	execute(`git remote rename origin gp`, 'rename greenpress origin to gp', { cwd: join(process.cwd(), name) });
}

function installDependencies(name) {
	execute(`npm install`, 'install application', { stdio: 'inherit', cwd: join(process.cwd(), name) });
}


module.exports = {
	clone,
	setServiceVersion,
	renameOrigin,
	installDependencies
}
