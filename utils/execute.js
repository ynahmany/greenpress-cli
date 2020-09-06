const { execSync } = require("child_process");

function execute(command, options = {}) {
  execSync(command, options, (error, stdout, stderr) => {
    if (error) throw error;
    if (stderr) throw new Error(stderr);
    return stdout;
  });
}

module.exports = execute;
