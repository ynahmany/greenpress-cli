const readline = require('readline');

module.exports = function yesNoQuestion(question) {
	const questionInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve, reject) => {
		questionInterface.question(question + " [y/n] ",
			(input = 'n') => {
				questionInterface.close();
				resolve(input === 'y' ? true : false);
			});
	});
}
