const https = require('https');

function getJSON (url) {
    return new Promise((resolve, reject) => {
		https.get(url, (resp) => {
			let data = '';
			resp.on('data', chunk => data += chunk);
			resp.on('end', () => resolve(JSON.parse(data)));
			resp.on('error', (err) => reject(err));
		});
	});
}

async function checkAlldeps (deps, localDeps, callback) {
    for (const name in deps) {
		const remoteValue = deps[name];
		const currentValue = localDeps[name];
		console.log(`Checking ${blue(name)} version`);
		if (remoteValue !== currentValue) {
			console.log(`Found a difference in ${blue(name)}:
                    \nlocal: ${currentValue} <--> ${remoteValue} :remote\n`);
			await callback(name, currentValue, remoteValue);
			console.log(`Updated ${blue(name)}'s version to: ${localDependencies[name]}`);
		} else {
			console.log(`${blue(name)}'s version is the latest! Proceeding.`)
		}
	}
}

module.exports = {
    getJSON,
    checkAlldeps
}