import { green, blue, red } from '../utils/colors';
import { execute } from '../utils/execute';
import { join } from 'path';

export const stopCommand = () => {

	console.log(blue('Stopping greenpress...'));
	let errN = execute('npm run stop', 'stop greenpress container', { cwd: join(process.cwd(), 'compose')}) ? 0 : 1;

	if (errN) {
		console.log(red(`Greenpress failed to stop, failed on ${errN} steps.`));
		process.exit(1);
	}

	console.log(green("Greenpress stopped"));
	process.exit(0);
}
