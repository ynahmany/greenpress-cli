import { ChildProcess } from 'child_process';
import { isMissingController } from '../controllers/missing';

export const setMissingCommand = (program) => {
	program
		.command('missing')
		.description('checks if Greenpress dependencies are installed')
		.action(isMissingController);
}
