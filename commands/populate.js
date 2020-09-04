const { execSync } = require('child_process');
const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { blue } = require('../utils/colors');

function setPopulateCommand(program) {
	program
		.command('populate')
		.description('initiates the database with initial categories, a post, the main menu, and your first administrator user')
		.action(async function () {


			const email = await readCredential("email", 'test@test.com');
			const password = await readCredential("password", 'admin');
			const populateCommand = `npm run populate-db -- --credentials ${email}:${password}`;

			execSync(populateCommand, { stdio: 'inherit' }, (error, stdout, stderr) => {
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
		});
}

async function readCredential(credentialType, defaultValue) {
	let result = await accept(`Would you like to select ${credentialType}?`)
		.then(answer => {
			if (answer) {
				return askQuestion(`Select new ${credentialType}: `, defaultValue)
					.then(input => {
						console.log(`Setting ${credentialType} to ${input}`)
						return input;
					})
			} else {
				console.log(blue(`Using default ${credentialType} (${defaultValue})`));
				return defaultValue;
			}
		});

	return result;
}

module.exports = setPopulateCommand

