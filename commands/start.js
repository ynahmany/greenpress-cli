const { startCommand } = require('../controllers/start')

function setStartCommand(program) {
	program
		.command('start [mode]')
		.option('-l, --local <services>', 'running selected services in dev mode')
		.option('-x, --exclude <services>', 'exclude selected services (default db in prod or none in dev)')
		.option('-d, --debug', 'will run in debug mode (will not stop after app is up)')
		.description('start Greenpress application')
		.action(startCommand);
}

module.exports = setStartCommand;
