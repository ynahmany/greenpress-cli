const fs = require('fs');
const execute = require('../utils/execute');
const { blue } = require('../utils/colors');

function clone(name, type = 'default') {
	const repoPath = type === 'pm2' ?
		'https://github.com/greenpress/greenpress-pm2' :
		'https://github.com/greenpress/greenpress';

	execute(`git clone ${repoPath} ${name}`, 'clone greenpress')
}

function setServiceVersion(packagePath, service, version) {
	console.log(blue(`setting ${service} to ${version}`));
	const projectPackage = require(packagePath);
	projectPackage.dependencies[`@greenpress/${service}`] = version;
	fs.writeFileSync(packagePath, JSON.stringify(projectPackage, null, 2))
}

function renameOrigin(name) {
	execute(`cd ${name} && git remote rename origin gp`, 'rename greenpress origin to gp');
}

function installDependencies(name) {
	execute(`cd ${name} && npm install`, 'install application', { stdio: 'inherit' });
}


module.exports = {
	clone,
	setServiceVersion,
	renameOrigin,
	installDependencies
}