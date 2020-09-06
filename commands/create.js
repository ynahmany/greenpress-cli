const createController = require('../controllers/create');

function setCreateCommand(program) {
	program
		.command('create [name] [type] [altFront] [mode]')
		.description('create a new website using greenpress')
		.action(createController)
}


module.exports = setCreateCommand;
