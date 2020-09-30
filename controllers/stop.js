const { green, blue, red } = require('../utils/colors');
const execute = require('../utils/execute');

function stopCommand() {

	console.log(blue('Stopping greenpress...'));
	let errN = execute('npx pm2 stop db', 'stop db process') ? 0 : 1;
	errN += execute('npx pm2 stop all', 'stop all services') ? 0 : 1;
	errN += execute('npx pm2 kill', 'kill all services') ? 0 : 1;

	if (errN) {
		console.log(red(`Greenpress failed to stop, failed on ${errN} steps.`));
		process.exit(1);
	}

	console.log(green("Greenpress stopped"));
	process.exit(0);
}

module.exports = {
	stopCommand
}