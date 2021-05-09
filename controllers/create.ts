import { askQuestion } from '../utils/question';
import { accept } from '../utils/acceptance';
import { clone, setServiceVersion, renameOrigin, SetupEnvForWindows } from '../services/create';
import { red, green, blue } from '../utils/colors';
import consts from '../consts';

export const createController = async(name = 'greenpress', type = 'default', altFront = null, mode = 'user') => {
	if (!(await clone(name, type))) {
		console.log(red(`Failed to clone application!`));
		process.exit(1);
	}

	const altFrontUrl = altFront || await askAlternativeFront();

	if (altFrontUrl) {
		setServiceVersion(`${process.env.PWD}/${name}/package.json`, 'blog-front', altFrontUrl);
	}

	if (mode === 'user') {
		renameOrigin(name);
	}

	if (process.platform === 'win32') {
		if (!(await SetupEnvForWindows(name))) {
			console.log(red(`Failed to set env correctly. To do so manually, follow our guide: ${blue(consts.localCompositionGuide)}`));
			process.exit(1);
		}
	}

	console.log(green('Done!'),
		`\nEnter ${blue(name)} directory, You can run the application using: ${blue('greenpress start')}`);
	process.exit(0);
}

// TODO: supply example for defaultValue
export const askAlternativeFront = async(defaultValue?: string) => {
	const answer = await accept(`Would you like to set alternative blog-front?`);
	if (answer) {
		return askQuestion(`Select alternative blog-front: `, defaultValue);
	}
	console.log(`Using default blog-front`);
}
