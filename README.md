# <img src="https://www.greenpress.info/logo.png" alt="Greenpress" width="200"/>  CLI

A command-line interface to help you create and manage your Greenpress application / website.

## Installation
> npm install -g @greenpress/cli

## Commands
* help: provides information about all the supported commands.
  usage: greenpress h, greenpress --help

* version: provides information about installed cli's version.
  usage: greenpress -V, greenpress --version

* start: starts app
  usage: greenpress start [mode [--local=\<services\>]]
  options:
    * mode: choose developer (input: dev) or user (no input required) application mode
      * local: if in dev mode and would like to run one of the key services (authentication, secretes, assets, content, admin-panel, blog-front) from your local           dev folder (my-app/dev), use the local option. E.g.:
      > greenpress start dev --local=assets,secrets,blog-front

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
