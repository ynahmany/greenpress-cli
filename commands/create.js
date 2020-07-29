const { execSync } = require('child_process');
const fs = require('fs');
const askQuestion = require('../utils/question');

function setCreateCommand(program) {
	program
		.command('create [name] [type] [altFront]')
		.description('create a new website using greenpress')
		.action(async function (name = 'greenpress', type = 'default', altFront = null) {
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
				console.log(`setting blog front to ${altFrontUrl}`);
				const projectPackagePath = name + "/package.json";
				const projectPackage = require(projectPackagePath);
				projectPackage.dependencies["@greenpress/blog-front"] = altFrontUrl;
				fs.writeFileSync(projectPackagePath, JSON.stringify(projectPackage, null, 4));
			}
		})
}

function checkAltFront() {
	return askQuestion('If you would like to select alternative blog front URL, enter it now, else, write no', 'no')
		.then(input => {
			return input === 'no' ? undefined : input
		})
}

module.exports = setCreateCommand;
