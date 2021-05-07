import { execute } from '../utils/execute';
import { join } from 'path';
import { red } from '../utils/colors';

export const logsController = async() => {
	if (!(await execute('npm run logs', 
				  'show greenpress logs', 
				  { cwd: join(process.cwd(), 'compose'), stdio:'inherit'}))) {
		console.log(red('Failed to run greenpress logs!'));

		process.exit(1);
	}
}
