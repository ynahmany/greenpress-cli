const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { clone, setServiceVersion, renameOrigin, installDependencies } = require('../services/create');
const { green, blue } = require('../utils/colors');

async function askAlternativeFront(defaultValue) {
	return accept(`Would you like to set alternative blog-front?`).then(answer => {
		if (answer) {
			return askQuestion(`Select alternative blog-front: `, defaultValue);
		}
		console.log(`Using default blog-front`);
	});
}

module.exports = async function createController(name = 'greenpress', type = 'default', altFront = null, mode = 'user') {
	clone(name, type);

	const altFrontUrl = altFront || await askAlternativeFront();

	if (altFrontUrl) {
		setServiceVersion(`${process.env.PWD}/${name}/package.json`, 'blog-front', altFrontUrl);
	}

	if (mode === 'user') {
		renameOrigin(name);
	}

	console.log('\n', blue('Application is now installing..'), '\n');

	installDependencies(name);

	console.log(green('Done!'),
		`\nEnter ${blue(name)} directory, You can run the application using: greenpress start dev`);
	process.exit(0);
}
