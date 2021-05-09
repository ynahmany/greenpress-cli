import { Command } from 'commander';
import { isMissingController } from '../controllers/missing';

export const setMissingCommand = (program: Command) => {
	program
		.command('missing')
		.description('checks if Greenpress dependencies are installed')
		.action(isMissingController);
}
