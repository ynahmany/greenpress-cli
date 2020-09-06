
function setPopulateCommand(program) {
	program
		.command('populate')
		.description('initiates the database with initial categories, a post, the main menu, and your first administrator user')
		.action();
}


module.exports = setPopulateCommand

