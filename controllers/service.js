const { createServices, createDevDir } = require('../services/service')

async function serviceCommand(action, services, options) {
	if (action === 'create') {
		createController(services.split(','), options.branch);
	}
}

async function createController(services, branch = undefined) {
	// create dev folder if not existing
	createDevDir();

	// clone services to dev repo
	createServices(services, branch);
}

module.exports = {
	serviceCommand
}