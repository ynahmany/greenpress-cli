const { chooseLocal, getAppArgs, checkServerUp } = require('../services/start');
const { green, blue, red } = require('../utils/colors');
const { appendToDockerConfig, cleanDockerConfig } = require('../services/docker-service');
const { execSync } = require('child_process');
const { askQuestion } = require('../utils/question');
const { join } = require('path');
const addOns = {
    redis: 'heroku-redis',
    papertrail: 'papertrail'
}
async function deployCommand (type) {
    switch (type) {  
        case 'heroku': 
           console.log(green('deploying to heroku...'));
           await deployHeroku();
           break;
        default:
            console.log(red(`${type} is not supported it`));
            process.exit(1);
    }
}
async function deployHeroku() {
    if (!execute('heroku login', 'login to heroku')) {
        console.log(red(`login failed`));
        process.exit(1);       
    }
    console.log(green(`login successfully to heroku`));
    const appName = await askQuestion('what is your application name:',`greenpress_${Date.now()}`)
    //TODO add try to askQuestion function 
    console.log(green(`heroku creating app ${appName}`));
    if (!execute(`heroku create ${appName}`, 'create heroku app')) {
        console.log(red(`create app ${app} failed`));
        process.exit(1);       
    }
    Object.entries(addOns).forEach(([key,value]) => {
        if (!execute(`heroku addons:create ${value} -a ${appName} `, `add ${key} addons to heroku app`)) {
            console.log(red(`failed to install ${key} to ${appName}`));
            process.exit(1);       
        }
    })
    const mongoUri = await askQuestion('what is your mongo uri:','');
    if (mongoUri === '') {
        console.log(red(`mongo uri must be provided`));
        process.exit(1);         
    }
    if (!execute(`heroku config:set MONGOURI=${mongoUri} -a ${AppName}`, 'set mongo uri enviroment')) {
        console.log(red(`failed to set mongo uri`));
        process.exit(1);       
    }
}

module.exports = {
	deployCommand
}