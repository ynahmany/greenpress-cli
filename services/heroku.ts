import { execute } from "../utils/execute";

export const createAddOn = async (name: string, addOnName: string, appName: string) =>
  !!(await execute(
    `heroku addons:create ${addOnName} -a ${appName} `,
    `add ${name} addons to heroku app`
  ));

export const addVariable = async (key: string, value: string, appName: string) =>
  await execute(
    `heroku config:set ${key}="${value.trim()}" -a ${appName}`,
    `set ${key} environment variable`
  );
