const execute = require('../utils/execute');

function populateExec(email, password) {
	execute(`npm run populate-db -- --credentials ${email}:${password}`, 'populate initial data', { stdio: 'inherit' })
}

module.exports = { populateExec }