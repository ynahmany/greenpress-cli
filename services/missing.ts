import { execSync } from 'child_process';
import { green, red } from '../utils/colors';

export const checkDependencyVersion = (app: string, installLink: string) => {
	try {
		const versionCommand = `${app} --version`;
		const version = execSync(versionCommand).toString();
		if (version.includes('not')) {
			console.log(`${red(`${app} is not installed!`)} To download:\n${installLink}`);
		} else {
			console.log(`${green(`${app} is installed!`)} Installed version: ${version}`);
		}
	} catch (err) {
		console.log(`An exception was thrown: ${err.stdout}`);
	}
}
