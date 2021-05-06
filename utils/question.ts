import readline from 'readline';

export const askQuestion = (question: string, defaultValue: string) => {
	const questionInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve) => {
		questionInterface.question(question,
			(input) => {
				questionInterface.close();
				resolve(input || defaultValue);
			});
	});
}
