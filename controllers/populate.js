const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { blue } = require('../utils/colors');
const { populateExec } = require('../services/populate');

// 'populate')
// 'initiates the database with initial categories, a post, the main menu, and your first administrator user'
async function populate () {
	const email = await readCredential("email", 'test@test.com');
	const password = await readCredential("password", 'admin');
	populateExec(email, password)
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

module.exports = populate;

