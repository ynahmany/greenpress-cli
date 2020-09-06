const { execSync } = require("child_process");

function cloneRepo(createCommand) {
  execSync(createCommand, (error, stdout, stderr) => {
    if (error) throw error;
    if (stderr) throw new Error(stderr);
    return stdout;
  });
}

module.exports = cloneRepo;
