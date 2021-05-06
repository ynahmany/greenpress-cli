#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();
// const { version } = require('./package.json')
import { setCreateCommand } from './commands/create';

// program.version(version)
program.version('0.6.2');

setCreateCommand(program)
// require('./commands/upgrade')(program)
// require('./commands/populate')(program)
// require('./commands/start')(program)
// require('./commands/stop')(program)
// require('./commands/missing')(program)
// require('./commands/service')(program)
// require('./commands/theme')(program)
// require('./commands/deployment')(program)
// require('./commands/deploy')(program)
// require('./commands/logs')(program)

program.parse(process.argv)
