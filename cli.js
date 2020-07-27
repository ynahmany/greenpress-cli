#!/usr/bin/env node

const program = require('commander')
const { version } = require('./package.json')

program.version(version)

const commands = require('./commands/commands');

for (let command in commands) {
	commands[command](program)
}

program.parse(process.argv)