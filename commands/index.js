// in this file we add autocomplete configurations

const createCmd = {
  command: "create [name] [type] [altFront] [mode]",
  desc: "Create a new website using greenpress",
};

const missingCmd = {
  command: "missing",
  desc: "Checks if Greenpress dependencies are installed",
};

const populateCmd = {
  command: "populate",
  desc:
    "Initiates the database with initial categories, a post, the main menu, and your first administrator user",
};

const startCmd = {
  command: "start [mode]",
  desc: "start command",
  builder: (yargs) =>
    yargs
      .option("l", {
        desc: "the services to run locally",
        type: "string",
      }),
};
// output: { l: ?, local: ?, mode: ? ...}

const stopCmd = {
  command: "stop",
  desc: "Stop Greenpress application",
};

const upgradeCmd = {
  command: "upgrade",
  desc: "Upgrade modules to their latest version",
};

module.exports = {
  createCmd,
  missingCmd,
  populateCmd,
  startCmd,
  stopCmd,
  upgradeCmd,
};
