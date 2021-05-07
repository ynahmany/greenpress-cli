import { CommanderStatic } from 'commander';
import { stopCommand } from '../controllers/stop';

export const setStopCommand = (program: CommanderStatic) =>
	program
		.command('stop')
		.description('stop greenpress application')
		.action(stopCommand);
