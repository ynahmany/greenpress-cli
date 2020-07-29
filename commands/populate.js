const { execSync } = require('child_process');
const askQuestion = require('../utils/question');

function setPopulateCommand(program) {
	program
		.command('populate')
		.description('initiates the database with initial categories, a post, the main menu, and your first administrator user')
		.action(async function () {


			const email = await readCredential("email", 'test@test.com');
			const password = await readCredential("password", 'admin');
			const populateCommand = `npm run populate-db -- --credentials ${email}:${password}`;

			execSync(populateCommand, (error, stdout, stderr) => {
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

function readCredential(credentialType, defaultValue) {
	return askQuestion(`Select new ${credentialType} [write "none" for default]: `, 'none')
		.then(input => {
			return input === 'none' ? defaultValue : input;
		})
}

module.exports = setPopulateCommand

