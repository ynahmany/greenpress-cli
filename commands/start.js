const { green, blue } = require('../utils/colors');
const { spawn, execSync } = require('child_process');
const { resolve } = require('path');
const { rejects } = require('assert');

const servicesEnvs = {
	'authentication-service': process.env.AUTH_SERVICE_CWD,
	'secrets-service': process.env.SECRETS_SERVICE_CWD,
	'assets-service': process.env.ASSETS_SERVICE_CWD,
	'content-service': process.env.CONTENT_SERVICE_CWD,
	'admin-panel': process.env.ADMIN_SERVICE_CWD,
	'blog-front': process.env.FRONT_SERVICE_CWD
};

function setStartCommand(program) {
	program
		.command('start [mode]')
		.option('-l, --local <services>', 'running selected services in dev mode')
		.description('start Greenpress application')
		.action(async function (mode = 'user', options) {

			if (mode === 'dev' && options.local) {
				console.log(`Chose to locally run ${options.local} services`)
				for (const service of options.local.split(',')) {
					servicesEnvs[service] = process.cwd() + '/dev/' + service;
					console.log(servicesEnvs[service])
				}
			}

			const spawnArgs = mode === 'user' ? [ 'start' ] : [ 'run', 'dev' ]

			const child = spawn('npm', spawnArgs, { detached: true });

			console.log(blue('Initializing Greenpress..'))

			child.stdout.on('data', (data) => {
				if(data && data.toString().includes('READY  Server listening')) {
					console.log(green("Greenpress is running!"));
					console.log(`"\n\rTo stop it, use: ${blue('greenpress stop')}"`)
					console.log(`\rTo populate it, use: ${blue('greenpress populate')}`);
					process.exit(0);
				}
			});
		});
}

module.exports = setStartCommand;
