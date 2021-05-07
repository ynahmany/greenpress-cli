import {chooseLocal, initializeGreenpress, waitForServerStartup} from '../services/start';
import {green, blue, red} from '../utils/colors';
import {appendToDockerConfig, cleanDockerConfig} from '../services/docker-service';

const compositionType = 'local';

const useLocalServices = (localServices, mode) => {
    if (!localServices) {
        return;
    }

    console.log(blue(`${localServices} passed as local services, checking their validity.`));
    chooseLocal(mode, localServices);
    console.log(green('Set local services successfully!'));
}

const excludeServices = (servicesToExclude: string[]) => {
    if (!servicesToExclude) {
        return;
    }

    console.log(blue(`${servicesToExclude} were chosen to be excluded.`));

    try {
        appendToDockerConfig(`npm_config_x=${servicesToExclude}`);
    } catch (e) {
        console.log(red('Failed to set excluded services!'));
        throw e;
    }

    console.log(green('Excluded required services successfully!'));
}

export const startCommand = async(mode = 'user', options) => {
    try {
        cleanDockerConfig();
        console.log(green('Cleared previous env contents!'));
        useLocalServices(options.local, mode);
        excludeServices(options.exclude);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }

    const child = initializeGreenpress(mode);
    // TODO: yohay - make sure it is working 
    await waitForServerStartup(compositionType, child.process);
}
