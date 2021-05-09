import { Command } from 'commander';
import { themeCommand } from '../controllers/theme';

export const setThemeCommand = (program: Command) => 
	program
		.command('theme [name]')
		.option('--from <theme>', 'set base theme to be used')
		.description('create custom themes')
		.action(themeCommand);
