import fs = require("fs");
import { join } from "path";
import { ChildProcess, ChildProcessByStdio, spawn } from "child_process";
import { CompositionType, getStartStore } from "../store/start";
import { appendToDockerConfig } from "./docker-service";
import { green, blue, red, yellow } from "../utils/colors";
import { checkImagesUp, checkServerLog } from "./start-progress-bar";
import { Env } from "../types";

const servicesEnvsAndRepos = {
  auth: ["AUTH_SERVICE_CWD", "authentication-service"],
  secrets: ["SECRETS_SERVICE_CWD", "secrets-service"],
  assets: ["ASSETS_SERVICE_CWD", "assets-service"],
  content: ["CONTENT_SERVICE_CWD", "content-service"],
  admin: ["ADMIN_SERVICE_CWD", "admin-panel"],
  front: ["FRONT_SERVICE_CWD", "blog-front"],
  drafts: ["DRAFTS_SERVICE_CWD", "drafts-service"],
};

export const getDevPath = (service: string) =>
  servicesEnvsAndRepos[service] !== undefined
    ? `${servicesEnvsAndRepos[service][0]}=${join(
        "dev",
        servicesEnvsAndRepos[service][1]
      )}\n`
    : "";

export const setLocalServicesDevPath = (localServices: string[]) => {
  let servicesPaths = "";
  for (const service of localServices) {
    const servicePath = getDevPath(service);
    if (servicePath !== "") {
      if (!fs.existsSync(servicePath.slice(0, -1).split("=")[1])) {
        console.log(
          yellow(`${service} wasn't created as local service. Skipping it!`)
        );
        continue;
      }
      console.log(green(`Set ${service} to dev path!`));
      servicesPaths += `${servicePath}\n`;
    } else {
      console.log(red(`${service} is not a valid option!`));
      throw new Error(red("Chose invalid local options, exiting!"));
    }
  }

  return servicesPaths;
}

export const chooseLocal = (mode: Env, localServices: string) => {
  let servicesPaths = "";
  if (mode === 'dev') {
    if (localServices === "all") {
      console.log(blue(`Chose to locally run all local services`));
      localServices = Object.keys(servicesEnvsAndRepos);
    } else {
      console.log(blue(`Chose to locally run ${localServices} services`));
      localServices = localServices.split(",");
    }
  }

  servicesPaths = setLocalServicesDevPath(localServices);
  appendToDockerConfig(servicesPaths);
}
// TODO: add proper Mode type
export const getAppArgs = (mode: string) => mode === "user" ? ["run", "local"] : ["run", "local:dev"];

export const handleStartupProgress = async(compositionType: CompositionType, child: ChildProcess) => {
  const store = getStartStore();
  try {
    store.init(compositionType);
    store.startImages();
    await checkImagesUp(child);
    console.log(green("\nAll images are running!"));

    store.startServices();
    await checkServerLog();
    console.log(green("\nAll services are running!"));
  } catch (err) {
    console.log(red(`\n${err}`));
    throw err;
  } finally {
    store.stop();
  }
}
// TODO: add type to Mode
export const initializeGreenpress = (mode: string) => {
  const appArgs = getAppArgs(mode);
  const childArgs = {
    cwd: join(process.cwd(), "compose"),
  };

  console.log(blue("Initializing Greenpress..\n"));
  console.log(
    blue("Doing our magic, might take a few minutes. Please wait.\n")
  );

  const child = spawn("npm", appArgs, childArgs);

  child.on("error", (err) => {
    console.log(
      red(`\nAn error occured while starting greenpress! Error:\n`),
      err
    );
    process.exit(1);
  });

  return getProcessHandler(child);
}

export const getProcessHandler = (proc: ChildProcess) => {
  let onExit: () => void;
  let onData: (data: any) => void;
  let onError: (err: any) => void;

  proc.on("error", (err) => {
    onError(err);
  });

  proc.stdout.on("data", (data) => {
    onData(data);
  });

  proc.on("exit", () => {
    onExit();
  });

  return {
    onExit: (func) => (onExit = func),
    onData: (func) => (onData = func),
    onError: (func) => (onError = func),
    process: proc,
  };
}

export const waitForServerStartup = async (compositionType: CompositionType, child: ChildProcess) => {
  try {
    await handleStartupProgress(compositionType, child);
    console.log(green("Server is running!"));
    console.log(`\n\rTo stop it, use: ${blue("greenpress stop")}`);
    console.log(`\rTo populate it, use: ${blue("greenpress populate")}`);
    console.log(`\rTo enter your app: http://localhost:3000`);
    process.exit(0);
  } catch (err) {
    console.log("An error occurred during server startup");
    process.exit(1);
  }
}
