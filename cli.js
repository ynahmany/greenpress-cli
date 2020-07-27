#!/usr/bin/env node

const program = require('commander')
const { version } = require('./package.json')

program.version(version)

require('./commands/create')(program)
require('./commands/upgrade')(program)

program.parse(process.argv)
