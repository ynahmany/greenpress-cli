import { execute } from '../utils/execute';

export const populate = (email: string, password: string) =>
	execute(`docker exec greenpress_greenpress_1 npm run populate-db -- --credentials ${email}:${password}`, 
		'populate initial data', { stdio: 'inherit' });
