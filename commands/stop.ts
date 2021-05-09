import { Command } from 'commander';
import { stopCommand } from '../controllers/stop';

export const setStopCommand = (program: Command) =>
	program
		.command('stop')
		.description('stop greenpress application')
		.action(stopCommand);
