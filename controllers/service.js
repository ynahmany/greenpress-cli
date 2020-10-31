const { createServices, createDevDir } = require('../services/service');
const { red, green } = require('../utils/colors');

async function serviceCommand(action, services, options) {
	if (action === 'create') {
		createController(services.split(','), options.branch);
	}
}

async function createController(services, branch = undefined) {
	// create dev folder if not existing
	createDevDir();

	// clone services to dev repo
	const errN = await createServices(services, branch);
	if (errN) {
		console.log(red(`Failed to create ${errN} services`));
		process.exit(1);
	}

	console.log(green('Successfully created all required services!'));
	process.exit(0);
}

module.exports = {
	serviceCommand
}