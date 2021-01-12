const { deployCommand } = require('../controllers/deploy')

function setDeployCommand(program) {
	program
		.command('deploy [type]')
		.description('deploy Greenpress to one of the supported clouds')
		.action(deployCommand);
}

module.exports = setDeployCommand;
