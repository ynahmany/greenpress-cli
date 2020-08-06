const { execSync } = require('child_process');
const { exit } = require('process');

function setStopCommand(program) {
	program
	.command('stop')
	.description('stop greenpress application')
	.action(async function () {
		let stopCommand = `npx pm2 stop all`;

		execSync(stopCommand, (error, stdout, stderr) => {
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

		console.log("Greenpress stopped");
		exit(0);
	});
}

module.exports = setStopCommand;