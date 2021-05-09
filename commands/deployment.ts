import { Command } from 'commander';
import { deploymentTypes } from '../controllers/deployment/types';
import { deploymentCommand } from '../controllers/deployment';

export const setDeploymentCommand = (program: Command) =>
	program
		.command('deployment [type]')
		.option('-mg, --mongo <mongo>', 'MongoDB URI')
		.description(`create a new deploy of Greenpress to one of the supported clouds: ${deploymentTypes.join(',')}`)
		.action(deploymentCommand);
