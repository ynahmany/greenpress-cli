import crypto from 'crypto';

export const getRandomHash = () => {
	const currentDate = new Date().valueOf().toString()
	const random = Math.random().toString()
	return crypto.createHash('sha1').update(currentDate + random).digest('hex');
};
