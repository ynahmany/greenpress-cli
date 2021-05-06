import readline from 'readline';

export const yesNoQuestion = (question: string) => {
	const questionInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve, reject) => {
		questionInterface.question(question + " [y/N] ",
			(input = 'n') => {
				input = input.toLowerCase();
				questionInterface.close();
				resolve(input.toLowerCase() === 'y');
			});
	});
}
