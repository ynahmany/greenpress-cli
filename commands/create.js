const { execSync } = require('child_process');
const fs = require('fs');
const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { green, blue, red } = require('../utils/colors');

// 'create [name] [type] [altFront] [mode]'
// 'create a new website using greenpress'
async function create (name = 'greenpress', type = 'default', altFront = null, mode = 'user') {
	const repoPath = type === 'pm2' ?
		'https://github.com/greenpress/greenpress-pm2' :
		'https://github.com/greenpress/greenpress';
	const createCommand = `git clone ${repoPath} ${name}`;

	execSync(createCommand, (error, stdout, stderr) => {
		if (error) {
			console.log(error.message);
			return;
		}

		if (stderr) {
			console.log(stderr);
			return;
		}

		console.log(stdout);
	});

	let altFrontUrl;
	if (altFront !== null) {
		altFrontUrl = altFront;
	} else {
		altFrontUrl = await checkAltFront();
	}

	if (altFrontUrl) {
		console.log(blue(`setting blog front to ${altFrontUrl}`));
		const projectPackagePath = `${process.env.PWD}/${name}/package.json`;
		const projectPackage = require(projectPackagePath);
		projectPackage.dependencies["@greenpress/blog-front"] = altFrontUrl;
		fs.writeFileSync(projectPackagePath, JSON.stringify(projectPackage, null, 2));
	}

	if (mode === 'user') {
		execSync(`cd ${name} && git remote rename origin gp`, (error, stdout, stderr) => {
			if (error) {
				console.log(error.message);
				return;
			}

			if (stderr) {
				console.log(stderr);
				return;
			}

			console.log(stdout);
		});
	}

	console.log('\n', blue('Application is now installing..'), '\n')

	execSync(`cd ${name} && npm install`, { stdio: 'inherit' }, (error, stdout, stderr) => {
		if (error) {
			console.log(red('Failed to install Application'));
			return;
		}

		if (stderr) {
			console.log(red('Error occurred while trying to install the application'));
			return;
		}
	});

	console.log(green('Done!'),
		`\nEnter ${blue(name)} directory, You can run the application using: npm start`);
	process.exit(0);
}


async function checkAltFront(defaultValue = undefined) {
	let result = await accept(`Would you like to set alternative blog-front?`)
		.then(answer => {
			if (answer) {
				return askQuestion(`Select alternative blog-front: `, defaultValue)
					.then(input => {
						return input;
					})
			} else {
				console.log(`Using default blog-front`);
				return undefined;
			}
		});

	return result;
}

module.exports = create;
