const askQuestion = require('../utils/question');
const accept = require('../utils/acceptance');
const { populate } = require('../services/populate');
const { blue } = require('../utils/colors');

function read(credentialType, defaultValue) {
	return accept(`Enter you user ${credentialType}?`)
		.then(answer => {
			if (answer) {
				return askQuestion(`Select new ${credentialType}: `, defaultValue).then(input => {
					console.log(`Setting ${credentialType} to ${input}`)
					return input;
				})
			}
			console.log(blue(`Using default ${credentialType} (${defaultValue})`));
			return defaultValue;
		});
}

module.exports = async function populateController() {
	const email = await readCredential("email", 'test@test.com');
	const password = await readCredential("password", 'admin');

	populate(email, password);
}
