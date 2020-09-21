# <img src="https://www.greenpress.info/logo.png" alt="Greenpress" width="200"/>  CLI

A command-line interface to help you create and manage your Greenpress application / website.

## Installation
> npm install -g @greenpress/cli

## Commands
* help: provides information about all the supported commands.
  usage: greenpress h, greenpress --help

* version: provides information about installed cli's version.
  usage: greenpress -V, greenpress --version

* start: starts app (**Currently doesn't work on Windows**)  
  usage: greenpress start [mode [-l, --local= \<services\>][-x, --exclude = \<services\>][-d, --debug]]  
  options:
    * mode: choose developer (input: dev) or user (no input required) application mode
      * local: if in dev mode and would like to run one of the key services (auth, secretes, assets, content, admin, front) from your local dev folder (my-app/dev), use the local option. E.g.:
	  > greenpress start dev -l assets,front  
      > greenpress start dev --local=assets,front  
    * exclude: choose which services not to start. In production, the default will be to exclude the db service. E.g:  
      	> greenpress start -x none
    * debug: keeps the start process alive and display live application logs

* stop: shuts down app
  usage: greenpress stop

* upgrade: compares local dependencies version with latest Greenpress version, allow user to upgrade local dependencies on will.
  usage: greenpress upgrade

* create: create a new app using greenpress
  usage: greenpress create [name] [type] [altFront] [mode]
  options:
    * name: choose app name
    * type: choose developer (input: pm2) or user (no input required) packages
    * altFront: choose alternative app frontend source (input: alternative frontend source's url)
    * mode: choose developer (input: dev) or user (no input required) mode

* populate: create initial content and admin user for your app
  usage: greenpress populate

* missing: checks if dependencies are install. If not, provides an installation link for them, else, displays their version number.
  usage: greenpress missing
