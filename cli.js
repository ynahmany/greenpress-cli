#!/usr/bin/env node
const { version } = require("./package.json");
const create = require("./controllers/create");
const createCommand = require('./commands/create');
const missing = require("./controllers/missing");
const missingCommand = require('./commands/missing');
const populate = require("./controllers/populate");
const populateCommand = require('./commands/populate');
const start = require("./controllers/start");
const startCommand = require('./commands/start');
const stop = require("./controllers/stop");
const stopCommand = require('./commands/stop');
const upgrade = require("./controllers/upgrade");
const upgradeCommand = require('./commands/upgrade');

const argv = require("yargs")
.usage("Usage: $0 <command> [options]")
.help('h')
.alias('h', 'help')
.alias('l', 'local')
.command(createCommand)	
.command(missingCommand)
.command(populateCommand)
.command(startCommand)
.command(stopCommand)
.command(upgradeCommand)
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
	case 'upgrade':
		upgrade(argv);
		break;
}

