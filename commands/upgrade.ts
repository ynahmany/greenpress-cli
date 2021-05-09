import { Command } from "commander";

import { upgradeController } from '../controllers/upgrade.js';

export const setUpgradeCommand = (program: Command) => 
	program
		.command('upgrade')
		.description('upgrade modules to their latest version')
		.action(upgradeController);
