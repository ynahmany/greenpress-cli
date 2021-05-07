import { deployHeroku } from './heroku';
import { green, red } from '../../utils/colors';
import { DeploymentRequest, DeploymentTypes } from './types';

export const deploymentCommand = async (type: DeploymentTypes, cliOptions: DeploymentRequest) => {
	const options = {
		...cliOptions,
		mongo: process.env.MONGODB_URI
	};
	switch (type) {
		case 'heroku':
			console.log(green('deploying to heroku...'));
			await deployHeroku(options);
			break;
		default:
			console.log(red(`${type} is not supported it`));
			process.exit(1);
	}
}
