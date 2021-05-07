import readline from 'readline';

export const accept = (question: string): Promise<boolean> => {
	const questionInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve) => {
		questionInterface.question(question + " [y/N] ",
			(input = 'n') => {
				input = input.toLowerCase();
				questionInterface.close();
				resolve(input.toLowerCase() === 'y');
			});
	});
}
