const { deployCommand } = require('../controllers/deploy')

function setDeployCommand(program) {
	program
		.command('deploy [type]')
		.option('-a, --app <app>', 'application name')
		.description('deploy of Greenpress to one of the supported clouds: heroku')
		.action(deployCommand);
}

module.exports = setDeployCommand;
