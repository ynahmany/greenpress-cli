const { serviceCommand } = require('../controllers/service');

function setServiceCommand(program) {
	program
	.command('service [action] [services]')
	.option('-b, --branch <name>', 'if action is create, will clone the required services in the requested branch')
	.description('Handles operations related to individual services')
	.action(serviceCommand);
}

module.exports = setServiceCommand;