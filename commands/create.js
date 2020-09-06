const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { green, blue, red } = require('../utils/colors');
const { 
	clone, 
	setServiceVersion, 
	renameOrigin, 
	installDependencies 
} = require('../services/create');

async function askAlternativeFront(defaultValue = null) {
	return accept(`Would you like to set alternative blog-front?`).then(answer => {
		if (answer) {
			return askQuestion(`Select alternative blog-front: `, defaultValue);
		}
		console.log(`Using default blog-front`);
	});
}

// 'create [name] [type] [altFront] [mode]'
// 'create a new website using greenpress'
async function create ({ name = 'greenpress', type = 'default', altFront = null, mode = 'user' }) {
	try {
		// clone the greenpress base repo
		clone(name, type);

		// check if user wants to change the alt front url-
		const altFrontUrl = altFront || await askAlternativeFront();
		if (altFrontUrl) {
			setServiceVersion(`${process.env.PWD}/${name}/package.json`, 'blog-front', altFrontUrl);
		}

		// remane remote repo if needed
		if (mode === 'user') {
			renameOrigin(name);
		}

		// install all deps
		console.log('\n', blue('Application is now installing..'), '\n')
		installDependencies(name);

		// done!
		console.log(green('Done!'),
			`\nEnter ${blue(name)} directory, You can run the application using: npm start`);
		process.exit(0);

	} catch (err) {
		console.log(red(err.message))
	}
}

module.exports = create;
