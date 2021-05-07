import { CommanderStatic } from 'commander';
import { isMissingController } from '../controllers/missing';

export const setMissingCommand = (program: CommanderStatic) => {
	program
		.command('missing')
		.description('checks if Greenpress dependencies are installed')
		.action(isMissingController);
}
