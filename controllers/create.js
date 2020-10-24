const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { clone, setServiceVersion, renameOrigin, installDependencies } = require('../services/create');
const { red, green, blue } = require('../utils/colors');
const { join } = require('path');
const fs = require('fs');
const execute = require('../utils/execute');
const { execSync } = require('child_process');
const { env } = require('process');
const localCompositionGuide = 'https://docs.greenpress.info/guide/local-docker-composition.html'

async function askAlternativeFront(defaultValue) {
	return accept(`Would you like to set alternative blog-front?`).then(answer => {
		if (answer) {
			return askQuestion(`Select alternative blog-front: `, defaultValue);
		}
		console.log(`Using default blog-front`);
	});
}

module.exports = async function createController(name = 'greenpress', type = 'default', altFront = null, mode = 'user') {
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
		try {
			const composePath = join(process.cwd(), name, 'compose');
			execSync('npm run envs', { cwd:  composePath });
			
			let envContent = '';
			const envFilePath = join(composePath, '.env');
			const envFile = fs.readFileSync(envFilePath).toString();
			
			const envParams = envFile.split('\n');
			envParams.forEach(element => {
				if (element.includes('MONGODB_VOLUME')) {
					const volumeSpecs = element.split('=');
					envContent += `${volumeSpecs[0]}=${volumeSpecs[1].replace('/', '\\')}\n`
				} else {
					envContent += `${element}\n`;
				}
			})
	
			fs.truncateSync(envFilePath, 0);
			fs.writeFileSync(envFilePath, envContent);
		} catch (e) {
			console.log(red(`An unexpected error occured while setting env correctly. Error: ${e.message}`));
			process.exit(1);	
		}
	}

	console.log(green('Done!'),
		`\nEnter ${blue(name)} directory, You can run the application using: ${blue('greenpress start')}`);
	process.exit(0);
}
