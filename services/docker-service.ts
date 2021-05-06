import fs from 'fs';
import { join } from 'path';
import { red } from '../utils/colors';
import consts from '../consts';

const composeConfigFile = join(process.cwd(), 'compose', consts.greenpressEnv);

export const appendToDockerConfig = (data: any) => {
	try {
		if (!fs.existsSync(composeConfigFile)) {
			fs.writeFileSync(composeConfigFile, '', { flag: 'w' });
		}

		fs.appendFileSync(composeConfigFile, `${data}\n`);
	} catch (e) {
		return new Error(red(`Failed to append data to ${consts.greenpressEnv}. Error: ${e.message}`));
	}
};

export const cleanDockerConfig = () => {
	try {
		if (fs.existsSync(composeConfigFile)) {
			fs.truncateSync(composeConfigFile, 0);
		}
	} catch (e) {
		throw new Error(red(`Failed to clean {consts.greenpressEnv}. Error: ${e.message}`))
	}
};
