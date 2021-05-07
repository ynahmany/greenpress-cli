import { CommanderStatic } from 'commander';
import { logsController } from '../controllers/logs';

export const setLogsCommand = (program: CommanderStatic) =>
	program
		.command('logs')
		.description('display greenpress logs')
		.action(logsController);
		