const { execSync } = require('child_process');

function setStopCommand(program) {
	program
		.command('stop')
		.description('stop greenpress application')
		.action(async function () {

			console.log('Stopping greenpress...');
			execSync(`npx pm2 stop db`, (error, stdout, stderr) => {
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
			execSync(`npx pm2 kill`, (error, stdout, stderr) => {
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
			process.exit(0);
		});
}

module.exports = setStopCommand;
