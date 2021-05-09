import { Command } from 'commander';
import { createController } from '../controllers/create';

export const setCreateCommand = (program: Command) =>
	program
		.command('create [name] [type] [altFront] [mode]')
		.description('create a new website using greenpress')
		.action(createController);
