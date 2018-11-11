#! /usr/bin/env node
const utils = require('./android-utils');

const commands = {
  "downloadDependencies" : {
    run: utils.downloadDependencies,
    help: "Download an android SDK and dependencies"
  },
  "exec" : {
    run: utils.exec,
    help: "Execute a command line with the android environment set",
    example: "cordova build android"
  }
};

function main() {
  const [,, ...args] = process.argv;
  
  if (!args || args.length == 0) {
    printUsage();
    return;
  }

  let command = commands[args[0]];
  let commandArgs = args.slice(1, args.length);
  command.run(commandArgs);
}

function printUsage() {
  console.log('Utilities to use android through npm. List of available commands: ');

  for (let command of Object.keys(commands)) {
    printCommandUsage(command);
  }
}

function printCommandUsage(cmd) {
  let command = commands[cmd];
  console.log(`${cmd}: ${command.help || ''} - ${command.example ? '-> Example:': ''} ${command.example || ''}`);
}

main();

