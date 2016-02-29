#!/usr/bin/env node

/**
 * api-cache-cli
 * @author Christoph Melzer <christoph.melzer1@gmail.com>
 */

'use strict';

var program = require('commander'),
    fs      = require('fs');

var Config = require('./Config'),
    Loader = require('./Loader');

program.version('0.0.1');
program
    .command('refresh <config-file>')
    .description('refresh local files')
    .option('-p, --paths <paths>', 'Comma separated list of paths to fetch')
    .action(function (configFile, option) {
        if (!fs.existsSync(configFile)) {
            throw new Error('config file does not exist');
        }

        Config.setConfig(JSON.parse(fs.readFileSync(configFile, 'utf-8')));
        Config.set('workingDirectory', process.env.PWD);
        var loader = new Loader(Config, option);
        loader.download();
    });

program
    .command('start <config-file>')
    .description('start small server to deliver loaded files')
    .option('-p, --port <port>', 'port to use')
    .action(function (command, option) {
        console.log(option.port)
    });

program
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}