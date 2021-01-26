const execute = require('../utils/execute');
const { getRandomHash } = require('../services/hashing');
const { createAddOn, addVariable } = require('../services/heroku');
const { green, red } = require('../utils/colors');
const askQuestion = require('../utils/question');
const addOns = {
	redis: 'heroku-redis',
	papertrail: 'papertrail'
}
const secrets = [ "JWT_SECRET",
	"REFRESH_TOKEN_SECRET",
	"SECRETS_SERVICE_SECRET",
	"ASSETS_SECRETS_TOKEN",
	"INTERNAL_SECRET"
]

async function deployCommand(type, { app }) {
	switch (type) {
		case 'heroku':
			console.log(green('deploying to heroku...'));
			await deployHeroku(app);
			break;
		default:
			console.log(red(`${type} is not supported it`));
			process.exit(1);
	}
}

async function deployHeroku(appName = process.env.HEROKU_APP) {
	if (!await execute(`heroku git:remote -a ${appName}`, 'create heroku app')) {
		console.log(red(`create app ${appName} remote repository failed`));
		process.exit(1);
	}

	await execute(`git push heroku master -f`, 'deploy to heroku', { stdio: 'inherit' });
}

module.exports = {
	deployCommand
}


