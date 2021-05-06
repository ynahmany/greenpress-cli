import fs from 'fs';
import { execute } from '../utils/execute';
import { join } from 'path';
import { red, green } from '../utils/colors';

export const createThemeFolder = (name: string) => {
	const themesFolderPath = join(process.cwd(), 'themes');
	const customThemePath = join(themesFolderPath, name);

	if (!fs.existsSync(themesFolderPath)) {
		fs.mkdirSync(themesFolderPath);
	}

	if (!fs.existsSync(customThemePath)) {
		fs.mkdirSync(customThemePath);
	}
	console.log(green(`Create ${customThemePath}`));
	return { customThemePath, themesFolderPath };
}

export const cloneFromGit = async(name: string, gitRepository: string) => {
	const { customThemePath, themesFolderPath } = createThemeFolder(name);

	try {
		fs.rmdirSync(customThemePath);
		if (!(await execute(`git clone ${gitRepository} ${name}`, 'clone theme from git repository', {cwd: themesFolderPath}))) {
			console.log(red(`Failed to clone ${gitRepository} content to ${name} folder`));
			return false;
		}
	} catch (e) {
		console.log(red(`An error has occurred. Error: ${e.message}`));
		return false;
	}

	return true;
}

export const copyBaseTheme = async (name: string, fromTheme: string) => {
	const { customThemePath } = createThemeFolder(name);

	try {
		const baseThemePath = join(process.cwd(), 'node_modules', '@greenpress', 'blog-front', 'themes', fromTheme);
		const copyCommand = `cp -r * ${customThemePath}`;
		if (!(await execute(copyCommand, 'Copy base theme content to new them folder', { cwd: baseThemePath }))) {
			console.log(red(`Failed to copy ${fromTheme} content to ${name} folder`));
			return false;
		}

	} catch (e) {
		console.log(red(`An error has occurred. Error: ${e.message}`));
		return false;
	}

	return true;
}

export const createConfigFile = async(name: string) => {
	const configContent = `//This file was generated using Greenpress CLI. For more information about the config file, go to https://docs.greenpress.info/guide/greenpress-configuration.html.
const { join } = require('path');

module.exports = {
  services: {
    front: {
      theme: 'global:' + join(process.cwd(), 'themes', '${name}')
    }
  }
}`;

	try {
		fs.writeFileSync(join(process.cwd(), 'greenpress.config.js'),
			configContent, { flag: 'w' });
	} catch (e) {
		console.log(red(`An error has occurred. Error: ${e.message}`));
		return false;
	}

	return true;
}
