const { execSync } = require('child_process');
const { exit } = require('process');

function setStartCommand(program) {
	program
	.command('start [mode]')
	.description('start greenpress application')
	.action(async function (mode = 'user') {
		let startCommand = `npm ${mode === 'user' ? 'start' : 'run dev'} &`;

		execSync(startCommand, (error, stdout, stderr) => {
			if (error) {
				console.log(error.message);
				return;
			}

			if (stderr) {
				console.log(stderr);
				return;
			}

			console.log(stdout);
		});

		console.log("Greenpress is running! To stop it, use greenpress stop");
		exit(0);
	});
}

module.exports = setStartCommand;