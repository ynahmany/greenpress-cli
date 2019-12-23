

function setCreateCommand(program) {
    program
    .command('create [name] [type]')
    .description('create a new website using greenpress')
    .action(function(name = 'greenpress', type = 'pm2') {
        console.log(`will clone greenpress-${type} inside /${name} directory`)
    })
}

module.exports = setCreateCommand;