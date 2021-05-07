import fs from "fs";
import https from "https";
import { join } from "path";
import { PackageJsonType } from "../types";
import { yesNoQuestion } from "../utils/acceptance";
import { green, yellow } from "../utils/colors";
import { execute } from "../utils/execute";

const localPackagePath = join(process.cwd(), "package.json");

export const checkAndUpgradeDependency = async (
  name: string,
  currentValue: string,
  remoteValue: string
) => {
  const answer = await yesNoQuestion(
    `Would you like to upgrade to remote's version?`
  );
  return upgradeFunc(answer, name, remoteValue, currentValue);
};

export const upgradeFunc = (
  answer: boolean,
  name: string,
  remoteValue: string,
  currentValue: string
) => {
  if (answer) {
    console.log(green(`Upgrading ${name}`));
    return remoteValue;
  } else {
    console.log(yellow(`Not upgrading ${name}`));
    return currentValue;
  }
};

export const getJSON = async (url: string) => {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = "";
      resp.on("data", (chunk) => (data += chunk));
      resp.on("end", () => resolve(JSON.parse(data)));
      resp.on("error", (err) => reject(err));
    });
  });
};

export const getLocalPackage = () => require(localPackagePath);

export const getRemotePackage = async (): Promise<PackageJsonType> =>
  await getJSON(
    "https://raw.githubusercontent.com/greenpress/greenpress/master/package.json"
  ) as PackageJsonType;

export const saveUpdatedPackage = async(localPackage: string) => {
  try {
    fs.writeFileSync(localPackagePath, JSON.stringify(localPackage, null, 2));
  } catch (e) {
    console.log(`An error occured while saving package.json: ${e.message}`);
  }

  console.log(yellow("Installing upgraded Greenpress"));
  return execute("npm install");
}
