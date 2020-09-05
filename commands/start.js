const { green, blue, red } = require('../utils/colors');
const { spawn } = require('child_process');

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
async function start (mode = 'user', options) {

	if (mode === 'dev' && options.local) {
		console.log(blue(`Chose to locally run ${options.local} services`));
		for (const service of options.local.split(',')) {
			if (servicesEnvsAndRepos[service] !== undefined) {
				process.env[servicesEnvsAndRepos[service][0]] = process.cwd() + '/dev/' + servicesEnvsAndRepos[service][1];
				console.log(green(process.env[servicesEnvsAndRepos[service][0]]));
			} else {
				console.log(red(`${service} is not a valid option, exiting!`));
				process.exit(1);
			}

		}
	}

	const spawnArgs = mode === 'user' ? [ 'start' ] : [ 'run', 'dev' ];
	const child = spawn('npm', spawnArgs, { detached: true });

	console.log(blue('Initializing Greenpress..'));

	child.stdout.on('data', (data) => {
		if(data && data.toString().includes('READY  Server listening')) {
			console.log(green("Greenpress is running!"));
			console.log(`"\n\rTo stop it, use: ${blue('greenpress stop')}"`);
			console.log(`\rTo populate it, use: ${blue('greenpress populate')}`);
			process.exit(0);
		}
	});
}

module.exports = start;
