import { Command } from 'commander';
import { logsController } from '../controllers/logs';

export const setLogsCommand = (program: Command) =>
	program
		.command('logs')
		.description('display greenpress logs')
		.action(logsController);
