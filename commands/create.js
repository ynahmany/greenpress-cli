const { execSync } = require('child_process');
const fs = require('fs');
const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');

function setCreateCommand(program) {
	program
		.command('create [name] [type] [altFront] [mode]')
		.description('create a new website using greenpress')
		.action(async function (name = 'greenpress', type = 'default', altFront = null, mode = 'user') {
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
				fs.writeFileSync(projectPackagePath, JSON.stringify(projectPackage, null, 2));
			}

			if (mode === 'user')
			{
				execSync("git remote rename origin gp", (error, stdout, stderr) => {
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

			console.log(`Done! now enter "${name}" directory and run: npm install`);
			process.exit(0);
		})
}

async function checkAltFront(defaultValue = undefined) {
	let result = await accept(`Would you like to set alternative blog front?`)
	.then(answer =>  {
		if (answer) {
			return askQuestion(`Select alternative blog front: `, defaultValue)
				.then(input => {
					return input;
					})
		} else {
			console.log(`Using default blog front)`);
			return undefined;
		}
	});

	return result;
}

module.exports = setCreateCommand;
