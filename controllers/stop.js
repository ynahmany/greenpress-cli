const { execSync } = require('child_process');
const { green, blue, red } = require('../utils/colors');

function stopCommand() {

	console.log(blue('Stopping greenpress...'));
	try {
		execSync('npx pm2 stop db', () => {});
	} catch (e) {
		console.log(red(`An error occured: ${e.message}`));
		process.exit(1);
	}

	try {
		execSync(`npx pm2 stop all`, (error, stdout, stderr) => {
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
	} catch (e) {
		console.log(red(`An error occured: ${e.message}`));
		process.exit(1);
	}
	
	try {
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
	} catch (e) {
		console.log(red(`An error occured: ${e.message}`));
		process.exit(1);
	}

	console.log(green("Greenpress stopped"));
	process.exit(0);
}

module.exports = {
	stopCommand
}