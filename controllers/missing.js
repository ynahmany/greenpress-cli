const { checkDependencyVersion } = require('../services/missing');

const dependencies = [
	[ 'git', 'https://git-scm.com/downloads' ],
	[ 'docker', 'https://docs.docker.com/get-docker/' ],
	[ 'node', 'https://nodejs.org/en/download/' ] ];

module.exports = function missingController() {
	dependencies.forEach(([ app, installLink ]) => checkDependencyVersion(app, installLink));
}
