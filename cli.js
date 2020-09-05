#!/usr/bin/env node
const { version } = require("./package.json");
const create = require("./commands/create");
const missing = require("./commands/missing");
const populate = require("./commands/populate");
const start = require("./commands/start");
const stop = require("./commands/stop");
const upgrade = require("./commands/upgrade");

const argv = require("yargs")
.usage("Usage: $0 <command> [options]")
.help('h')
.alias('h', 'help')
.command('create [name] [type] [altFront] [mode]',
	'Create a new website using greenpress',
)	
.command('missing',
	'Checks if Greenpress dependencies are installed'
)
.command('populate',
	'Initiates the database with initial categories, a post, the main menu, and your first administrator user'
)
.command('start [mode]',
	'Starts Greenpress application'
)
.command('stop',
	'Stop Greenpress application'
)
.command('upgrade',
	'Upgrade modules to their latest version'
	)
.argv;

switch (argv._[0]) {
	case 'create': 
		create(argv);
		break;
	case 'missing':
		missing(argv);
		break;
	case 'populate':
		populate(argv);
		break;
	case 'start':
		start(argv);
		break;
	case 'stop':
		stop(argv);
		break;
	case upgrade:
		upgrade(argv);
		break;
}

