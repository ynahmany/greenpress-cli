import { createServices, createDevDir, getContainersByScale } from '../services/service';
import { red, green } from '../utils/colors';
import { execute } from '../utils/execute';

enum ServiceCommandActions {
	create = 'create',
	restart = 'restart'
}
export const serviceCommand = (action: ServiceCommandActions, services: string, options) => {
	if (action === 'create') {
		createController(services.split(','), options.branch);
	} else if (action === 'restart') {
		restartController(services.split(','), options.scaled);
	}
}

export const createController = async(services: string[], branch = undefined) => {
	// create dev folder if not existing
	createDevDir();

	// clone services to dev repo
	const errN = await createServices(services, branch);
	if (errN) {
		console.log(red(`Failed to create ${errN} services`));
		process.exit(1);
	}

	console.log(green('Successfully created all required services!'));
	process.exit(0);
}

export const restartController = async (services: string[], scaled = false) => {
	// get containers names according to scale
	let containersImagesByName = getContainersByScale(scaled);
	let errN = 0;

	for (const service of services) {
		const [ command, pm2Suffix ] = [ scaled ? 'restart' : 'exec',
		                                 !scaled ? `pm2 restart ${service}` : '' ];
		const restartCommand = `docker ${command} ${containersImagesByName[service]} ${pm2Suffix}`;
		if (!(await execute(restartCommand, `restart ${service}`, { stdio:'inherit'}))) {
			console.log(red(`Failed to restart ${service}`));
			errN += 1;
			continue;
		}

		console.log(green(`Restarted ${service}`));
	}

	if (errN) {
		console.log(red('Failed to restart all the requested services'));
		process.exit(1);
	}

	console.log(green('Restarted all the requested services'));
	process.exit(0);
}