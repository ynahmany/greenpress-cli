import { Command } from 'commander';
import { startCommand } from '../controllers/start';

export const setStartCommand = (program: Command) =>
	program
		.command('start [mode]')
		.option('-l, --local <services>', 'running selected services in dev mode')
		.option('-x, --exclude <services>', 'exclude selected services (default db in prod or none in dev)')
		.description('start Greenpress application')
		.action(startCommand);

