import { CommanderStatic } from 'commander';
import { populateController } from '../controllers/populate';

export const setPopulateCommand = (program: CommanderStatic) =>
	program
		.command('populate')
		.description('initiates the database with initial categories, a post, the main menu, and your first administrator user')
		.action(populateController);
