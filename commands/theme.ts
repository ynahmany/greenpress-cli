import { CommanderStatic } from 'commander';
import { themeCommand } from '../controllers/theme';

export const setThemeCommand = (program: CommanderStatic) => 
	program
		.command('theme [name]')
		.option('--from <theme>', 'set base theme to be used')
		.description('create custom themes')
		.action(themeCommand);
