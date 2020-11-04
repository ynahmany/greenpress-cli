const { serviceCommand } = require('../controllers/service');
const servicesList = require('../services/service').getServicesList();
const serviceDescription = `Handles operations related to individual services. 
Possible services values: ${servicesList}`;

function setServiceCommand(program) {
	program
	.command('service [action] [services]')
	.option('-b, --branch <name>', 'if action is create, will clone the required services in the requested branch')
	.description(serviceDescription)
	.action(serviceCommand);
}

module.exports = setServiceCommand;