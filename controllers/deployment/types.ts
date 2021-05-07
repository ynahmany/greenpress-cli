import { deployHeroku } from './heroku';
export interface DeploymentRequest extends Record<string, string> {
	mongo: string;
}
export enum DeploymentTypes {
	heroku = 'heroku'
}
export const deployments: Record<DeploymentTypes, (req: DeploymentRequest) => Promise<void>> = {
	heroku: deployHeroku
};
export const deploymentTypes = Object.keys(deployments);
