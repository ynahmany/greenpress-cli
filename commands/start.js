const { spawn } = require('child_process');
const { green } = require('../utils/colors');

function setStartCommand(program) {
	program
		.command('start [mode]')
		.description('start Greenpress application')
		.action(async function (mode = 'user') {

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
