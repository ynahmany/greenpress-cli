import { CommanderStatic } from 'commander';
const createController = require('../controllers/create');

export const setCreateCommand = (program: CommanderStatic) =>
	program
		.command('create [name] [type] [altFront] [mode]')
		.description('create a new website using greenpress')
		.action(createController);
