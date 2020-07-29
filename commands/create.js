const { execSync } = require('child_process');
const questionInterface = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

function setCreateCommand(program) {
    program
    .command('create [name] [type] [altFront]')
    .description('create a new website using greenpress')
    .action(function(name = 'greenpress', type = 'pm2', altFront = null) {
		const repoPath = type === 'pm2' ?
							'https://github.com/greenpress/greenpress-pm2' :
							'https://github.com/greenpress/greenpress';
		const createCommand = `git clone ${repoPath} ${name}`;

		execSync(createCommand, (error, stdout, stderr) => {
			if (error) {
				console.log(error.message);
				return;
			}

			if (stderr) {
				console.log(stderr);
				return;
			}

			console.log(stdout);
		});

		let altFrontUrl;
		if (altFront !== null) {
			altFrontUrl = altFront;
		}
		else {
			altFront = await checkAltFront();
		}

		if (altFrontUrl) {
			console.log(`setting blog front to ${altFrontUrl}`);
			const packagePath = name + "/package.json";
			let package = require(packagePath);
			package.dependencies["@greenpress/blog-front"] = altFrontUrl;
			fs.writeFileSync(packagePath, JSON.stringify(package, null, 4));
		}

		questionInterface.close();
    })
}

function checkAltFront() {
	return new Promise((resolve) => {
		questionInterface.question("If you would like to select alternative blog front URL, enter it now, else, write no",
		(input = 'no') => {
			if (input.toLowerCase() === 'no') {
				resolve(input);
			} else {
				resolve(undefined);
			}
		});
	})
}

module.exports = setCreateCommand;