const { green, blue } = require('../utils/colors');
const { 
	attachLocalDevServices,
	runWithNPM
} = require('../services/start');

const servicesEnvsAndRepos = {
	'auth': ['AUTH_SERVICE_CWD', 'authentication-service'],
	'secrets': ['SECRETS_SERVICE_CWD', 'secrets-service'],
	'assets': ['ASSETS_SERVICE_CWD', 'assets-service'],
	'content': ['CONTENT_SERVICE_CWD', 'content-service'],
	'admin': ['ADMIN_SERVICE_CWD', 'admin-panel'],
	'front': ['FRONT_SERVICE_CWD', 'blog-front']
};

// 'start [mode]'
// '-l, --local <services>', 'running selected services in dev mode'
// 'start Greenpress application'
async function start ({mode = 'user', local}) {

	if (mode === 'dev' && local) {
		attachLocalDevServices({ local }, servicesEnvsAndRepos);
	}

	runWithNPM(mode === 'user' ? [ 'start' ] : [ 'run', 'dev' ], () => {
		console.log(green("Greenpress is running!"));
		console.log(`"\n\rTo stop it, use: ${blue('greenpress stop')}"`);
		console.log(`\rTo populate it, use: ${blue('greenpress populate')}`);
		process.exit(0);
	})
}

module.exports = start;
