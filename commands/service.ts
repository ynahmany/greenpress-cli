import { Command } from 'commander';
import { serviceCommand } from '../controllers/service';
import { getServicesList } from '../services/service';

const servicesList = getServicesList();
const serviceDescription = `Handles operations related to individual services. 
Possible services values: ${servicesList}`;

export const setServiceCommand = (program: Command) =>
	program
	.command('service [action] [services]')
	.option('-b, --branch <name>', 'if action is create, will clone the required services in the requested branch')
	.option('--scaled', 'if action is restart, will restart the relevant independent images')
	.description(serviceDescription)
	.action(serviceCommand);
