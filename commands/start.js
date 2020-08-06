const { spawn } = require('child_process');

function setStartCommand(program) {
	program
		.command('start [mode]')
		.description('start Greenpress application')
		.action(async function (mode = 'user') {

			const spawnArgs = mode === 'user' ? [ 'start' ] : [ 'run', 'dev' ]

			const child = spawn('npm', spawnArgs, { detached: true });

			console.log('Initializing Greenpress..')

			child.stdout.on('data', (data) => {
				if(data && data.toString().includes('READY  Server listening')) {
					console.log("Greenpress is running!\n\rTo stop it, use: greenpress stop");
					console.log("\rTo populate it, use: greenpress populate");
					process.exit(0);
				}
			});
		});
}

module.exports = setStartCommand;
