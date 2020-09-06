const execute = require('../utils/execute');

function populate(email, password) {
	execute(`npm run populate-db -- --credentials ${email}:${password}`, 'populate initial data', { stdio: 'inherit' })
}

module.exports = { populate }
