const { green, blue } = require('../utils/colors');
const { spawn, execSync } = require('child_process');
const { resolve } = require('path');
const { rejects } = require('assert');

function setStartCommand(program) {
	program
		.command('start [mode]')
		.option('-l, --local <services>', 'running selected services in dev mode')
		.description('start Greenpress application')
		.action(async function (mode = 'user', options) {

			if (mode === 'dev' && options.local) {
				console.log(`Chose to locally run ${options.local} services`)
				await LocalizeRequestedServices(options.local.split(','));
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

async function LocalizeRequestedServices(services) {
	for (const service of services) {
		switch(service)
		{
		case 'authentication':
			process.env.AUTH_SERVICE_CWD = process.cwd() + '/dev/' + service;
			console.log(`Set ${service} cwd to: ${process.env.AUTH_SERVICE_CWD}`);
			break;
		case 'secrets':
			process.env.SECRETS_SERVICE_CWD = process.cwd() + '/dev/' + service;
			console.log(`Set ${service} cwd to: ${process.env.SECRETS_SERVICE_CWD}`);
			break;
		case 'assets':
			process.env.ASSETS_SERVICE_CWD = process.cwd() + '/dev/' + service;
			console.log(`Set ${service} cwd to: ${process.env.ASSETS_SERVICE_CWD}`);
			break;
		case 'content':
			process.env.CONTENT_SERVICE_CWD = process.cwd() + '/dev/' + service;
			console.log(`Set ${service} cwd to: ${process.env.CONTENT_SERVICE_CWD}`);
			break;
		case 'admin-panel':
			process.env.ADMIN_SERVICE_CWD = process.cwd() + '/dev/' + service;
			console.log(`Set ${service} cwd to: ${process.env.ADMIN_SERVICE_CWD}`);
			break;
		case 'blog-front':
			process.env.FRONT_SERVICE_CWD = process.cwd() + '/dev/' + service;
			console.log(`Set ${service} cwd to: ${process.env.FRONT_SERVICE_CWD}`);
				break;
		}
	}
}

module.exports = setStartCommand;
