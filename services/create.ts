import fs from 'fs';
import { join } from 'path';
import { execute } from '../utils/execute';
import { blue, red } from '../utils/colors';

export const clone = async(name: string, type = 'default') => {
	const repoPath = type === 'pm2' ?
		'https://github.com/greenpress/greenpress-pm2' :
		'https://github.com/greenpress/greenpress';

	return await execute(`git clone ${repoPath} ${name}`, 'clone greenpress')
}

export const setServiceVersion = (packagePath: string, service: string, version: string) => {
	console.log(blue(`setting ${service} to ${version}`));
	const projectPackage = require(packagePath);
	projectPackage.dependencies[`@greenpress/${service}`] = version;
	fs.writeFileSync(packagePath, JSON.stringify(projectPackage, null, 2))
}

export const renameOrigin = (name: string) => execute(`git remote rename origin gp`, 'rename greenpress origin to gp', { cwd: join(process.cwd(), name) });

export const SetupEnvForWindows = async (name: string) => {
	try {
		const composePath = join(process.cwd(), name, 'compose');
		if (!(await execute('npm run envs', 
		      'create env files needed to run with docker-compose', 
		      { cwd:  composePath }))) {
				return false;
			}
		
		let envContent = '';
		const envFilePath = join(composePath, '.env');
		const envFile = fs.readFileSync(envFilePath).toString();
		
		envFile.split('\n').forEach(element => {
			if (element.includes('MONGODB_VOLUME')) {
				const volumeSpecs = element.split('=');
				envContent += `${volumeSpecs[0]}=${volumeSpecs[1].replace('/', '\\')}\n`
			} else {
				envContent += `${element}\n`;
			}
		});

		fs.truncateSync(envFilePath, 0);
		fs.writeFileSync(envFilePath, envContent);
	} catch (e) {
		console.log(red(`An error occured while setting env correctly. Error: ${e.message}`));
		return false;
	}
	
	return true;
}
