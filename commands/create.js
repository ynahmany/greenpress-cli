const create = require('../controllers/create');

function setCreateCommand(program) {
	program
		.command('create [name] [type] [altFront] [mode]')
		.description('create a new website using greenpress')
		.action(create)
}


module.exports = setCreateCommand;
