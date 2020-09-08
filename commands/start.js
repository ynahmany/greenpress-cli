module.exports = {
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
