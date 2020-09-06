const { red } = require('./colors');
const { execSync } = require('child_process');

module.exports = function execute(cmd, actionDescription, execProps = null) {
	execSync(cmd, execProps, (error, stdout, stderr) => {
		if (error) {
			console.log(red(actionDescription ? `Failed to ${actionDescription}` : error.message));
			return;
		}

		if (stderr) {
			console.log(red(actionDescription ? `Error occurred while trying to ${actionDescription}` : stderr));
			return;
		}

		console.log(stdout);
	});
}
