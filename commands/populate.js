const { execSync } = require('child_process');
const questionInterface = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

function setPopulateCommand(program) {
	program
	.command('populate')
	.description('initiates the database with initial categories, a post, the main menu, and your first administrator user')
	.action(async function () {
		try {
			const email = (await readCredential("email")) || 'test@test.com';
			const password = (await readCredential("password")) || 'admin';
			const populateCommand = `npm run populate-db -- --credentials ${email + ":" + password}`;
			console.log(populateCommand);
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

		}
		catch(error) {
			console.log(error);
		}
		questionInterface.close();
	});
}

function readCredential(credentialType) {
	return new Promise((resolve) => {
		questionInterface.question(`Select new ${credentialType} [write "none" for default]: `,
			(input = 'none') => {
				console.log("Hello")
				if (input.toLowerCase() !== 'none') {
					console.log("in input block");
					resolve(input);
				}
				else {
					console.log("in none block");
					resolve(undefined);
				}
			});
	});
}

module.exports = setPopulateCommand
