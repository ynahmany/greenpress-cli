const { execSync } = require('child_process');
const fs = require('fs');
const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { green, blue, red } = require('../utils/colors');
const execute = require('../services/execute');

// 'create [name] [type] [altFront] [mode]'
// 'create a new website using greenpress'
async function create ({ name = 'greenpress', type = 'default', altFront = null, mode = 'user' }) {
	// clone the greenpress base repo
	const repoPath = type === 'pm2' ?
		'https://github.com/greenpress/greenpress-pm2' :
		'https://github.com/greenpress/greenpress';
	const createCommand = `git clone ${repoPath} ${name}`;
	try {
		const stdout = execute(createCommand);
		console.log(stdout);
	} catch (err) {
		console.log(red(err.message));
		return;
	}

	// check if user wants to change the alt front url-
	if (altFront !== null) {
		console.log(blue(`setting blog front to ${altFront}`));
		await changeAltFront(name, altFront);
	} else {
		let changeAltFront = await accept(
		  `Would you like to set alternative blog-front?`,
		);
		if (changeAltFront) {
		    altFront = await askQuestion(
		        `Select alternative blog-front: `,
		        null
			);
			if (altFront !== null) {
				console.log(blue(`setting blog front to ${altFront}`));
				await changeAltFront(name, altFront);
			}
		}
	}

	if (mode === 'user') {
		try {
			const output = execute(`cd ${name} && git remote rename origin gp`);
			console.log(output);
		} catch (err) {
			console.log(err);
			return;
		}
	}

	console.log('\n', blue('Application is now installing..'), '\n')

	try {	
		execute(`cd ${name} && npm install`, { stdio: 'inherit' });
	} catch (err) {
		console.log(red('Failed to install Application'));
		return;
	}

	console.log(green('Done!'),
		`\nEnter ${blue(name)} directory, You can run the application using: npm start`);
	process.exit(0);
}

module.exports = create;
