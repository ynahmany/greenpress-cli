import { deploymentTypes } from '../controllers/deployment/types';
import { deployCommand } from '../controllers/deploy';
import { CommanderStatic } from 'commander';

export const setDeployCommand = (program: CommanderStatic) => 
	program
		.command('deploy [type]')
		.option('-a, --app <app>', 'application name')
		.description(`deploy of Greenpress to one of the supported clouds: ${deploymentTypes.join(',')}`)
		.action(deployCommand);
