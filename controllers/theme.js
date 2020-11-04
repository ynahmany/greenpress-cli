const fs = require('fs');
const { join } = require('path');
const { copyBaseTheme, createConfigFile } = require('../services/theme');
const { blue, green, red } = require('../utils/colors');

const configeGuide = 'https://docs.greenpress.info/guide/greenpress-configuration.html';
const themeConfigurationDescription = `To set up your own theme, follow our guide at ${configeGuide}`;

async function themeCommand(name, options) {
	
	const fromTheme = options.from || 'classic';
	console.log(options.from)
	if (! (await copyBaseTheme(name, fromTheme))) {
		console.log(red(`Failed to create ${name} theme! Exiting.`));
		process.exit(1);
	}

	green(`Successfully created ${name} theme!`);

	if (!fs.existsSync(join(process.cwd(), 'greenpress.config.js'))) {
		if (! (await createConfigFile(name))) {
			console.log(`${red('Failed to create configuration file!')}.
			To set it by yourself, follow our guide at ${blue(configeGuide)}`);
			process.exit(1);
		} 
	} else {
		console.log(blue(themeConfigurationDescription));
		process.exit(0);
	}

	console.log(green('Successfully created configuration file!'));
	process.exit(0);
}

module.exports = themeCommand;