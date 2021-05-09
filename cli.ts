#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();
const { version } = require('./package.json')
import { setCreateCommand } from './commands/create';
import { setUpgradeCommand } from './commands/upgrade';
import { setPopulateCommand } from './commands/populate';
import { setStartCommand } from './commands/start';
import { setStopCommand } from './commands/stop';
import { setMissingCommand } from './commands/missing';
import { setServiceCommand } from './commands/service';
import { setThemeCommand } from './commands/theme';
import { setDeploymentCommand } from './commands/deployment';
import { setDeployCommand } from './commands/deploy';
import { setLogsCommand } from './commands/logs';

program.version(version)
// program.version('0.6.2')

setCreateCommand(program);
setUpgradeCommand(program);
setPopulateCommand(program);
setStartCommand(program);
setStopCommand(program);
setMissingCommand(program);
setServiceCommand(program);
setThemeCommand(program);
setDeploymentCommand(program);
setDeployCommand(program);
setLogsCommand(program);


program.parse(process.argv)
