const { deploymentCommand } = require('../controllers/deployment')

function setDeploymentCommand(program) {
	program
		.command('deployment [type]')
		.description('create a new deploy of Greenpress to one of the supported clouds: heroku')
		.action(deploymentCommand);
}

module.exports = setDeploymentCommand;
