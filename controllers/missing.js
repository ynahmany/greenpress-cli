const { checkDependencyVersion } = require('../services/missing');
const dependencies = [['git', 'https://git-scm.com/downloads'], 
					  ['docker', 'https://docs.docker.com/get-docker/'],
					  ['node', 'https://nodejs.org/en/download/']];

// 'missing'
// 'checks if Greenpress dependencies are installed'
function missing () {
	dependencies.forEach(([app, installLink]) => checkDependencyVersion(app, installLink));
}

module.exports = missing;