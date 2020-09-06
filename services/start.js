const { blue, green, red } = require("../utils/colors");
const { spawn } = require('child_process');

function attachLocalDevServices(options, servicesEnvsAndRepos) {
    console.log(blue(`Chose to locally run ${options.local} services`));
    for (const service of options.local.split(',')) {
        if (servicesEnvsAndRepos[service] !== undefined) {
            process.env[servicesEnvsAndRepos[service][0]] = process.cwd() + '/dev/' + servicesEnvsAndRepos[service][1];
            console.log(green(process.env[servicesEnvsAndRepos[service][0]]));
        } else {
            console.log(red(`${service} is not a valid option, exiting!`));
            process.exit(1);
        }
    }
}

function runWithNPM(spawnArgs, callback = () => {}) {
    const child = spawn('npm', spawnArgs, { detached: true });

	console.log(blue('Initializing Greenpress..'));

	child.stdout.on('data', (data) => {
		if(data && data.toString().includes('READY  Server listening')) {
			callback();
		}
	});
}

module.exports = {
    attachLocalDevServices,
    runWithNPM
}