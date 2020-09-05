#!/usr/bin/env node
const { version } = require("./package.json");
const create = require("./commands/create");

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command(
    "<create> [name] [type] [altFront] [mode]",
    "create a new website using greenpress",
  ).argv._;

switch (argv._[0]) {
    case 'create': create(argv);
}
