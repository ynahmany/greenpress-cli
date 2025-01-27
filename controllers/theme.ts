import fs from 'fs';
import { join } from 'path';
import { copyBaseTheme, createConfigFile, cloneFromGit } from '../services/theme';
import { blue, green, red } from '../utils/colors';

const configGuide = 'https://docs.greenpress.info/services/blog-front/#configuration';
const themeConfigurationDescription = `To set up your own theme, follow our guide at ${configGuide}`;

export const themeCommand = async(name: string, options: { from?: string }) => {

	const fromTheme = options.from || 'classic';

	let copyStatus;
	if (fromTheme.startsWith('git@')) {
		console.log('getting theme from: ' + fromTheme);
		copyStatus = await cloneFromGit(name, fromTheme);
	} else {
		console.log(options.from);
		copyStatus = await copyBaseTheme(name, fromTheme);
	}

	if (!copyStatus) {
		console.log(red(`Failed to create ${name} theme! Exiting.`));
		process.exit(1);
	}

	green(`Successfully created ${name} theme!`);

	if (!fs.existsSync(join(process.cwd(), 'greenpress.config.js'))) {
		if (!(await createConfigFile(name))) {
			console.log(`${red('Failed to create configuration file!')}.
			To set it by yourself, follow our guide at ${blue(configGuide)}`);
			process.exit(1);
		}
	} else {
		console.log(blue(themeConfigurationDescription));
		process.exit(0);
	}

	console.log(green('Successfully created configuration file!'));
	process.exit(0);
}
