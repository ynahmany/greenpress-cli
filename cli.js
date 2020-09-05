#!/usr/bin/env node

const program = require('commander')
const { version } = require('./package.json')
const create = require('./commands/create');

require('yargs')
    .command(
        'create [name] [type] [altFront] [mode]', 
        'create a new website using greenpress',
        ({ positional }) => {
            positional('name', { default: 'greenpress' })
            positional('type', { default: 'default' })
            positional('altFront', { default: null })
            positional('mode', { default: 'user' })
        },
        (argv) => {
            create(argv.name, argv.type, argv.altFront, argv.mode);
        }
    )
