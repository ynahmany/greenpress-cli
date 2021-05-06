import { exec as callbackExec } from "child_process";
import { promisify } from 'util';
import { red } from './colors';

const exec = promisify(callbackExec);

export const execute = async (cmd, actionDescription, execProps = null) => {
  try {
    const { stdout, stderr }  = await exec(cmd, execProps);
      if (stderr) {
        console.log(
          red(
            actionDescription
              ? `Error occurred while trying to ${actionDescription}: ${stderr.toString()}`
              : stderr
          )
        );

        return false;
      }

      console.log(stdout);
    }
  catch (error) {
    console.log(
      red(
        actionDescription
          ? `Error occurred while trying to ${actionDescription}: ${error.message}`
          : error.message
      )
    );

    return false;
  }

  return true;
};
