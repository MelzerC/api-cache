#!/usr/bin/env node

/**
 * api-cache-cli
 * @author Christoph Melzer <christoph.melzer1@gmail.com>
 */

'use strict';

var program = require('commander'),
    fs      = require('fs');

var Config = require('./lib/Config'),
    Loader = require('./lib/Loader'),
    Server = require('./lib/Server');

program.version('0.0.1');

/**
 * refresh command
 * refresh all routes, or just the given ones in --paths option
 */
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

/**
 * start a server which delivers all saved files through the same routes as
 * the given ones in config
 */
program
    .command('start <config-file>')
    .description('start small server to deliver loaded files')
    .option('-p, --port <port>', 'port to use')
    .action(function (configFile, option) {
        if (!fs.existsSync(configFile)) {
            throw new Error('config file does not exist');
        }

        Config.setConfig(JSON.parse(fs.readFileSync(configFile, 'utf-8')));
        Config.set('workingDirectory', process.env.PWD);

        var server = new Server(Config, option);
        server.start();
    });

/**
 * parse cli command arguments
 */
program
    .parse(process.argv);

/**
 * print help in case there are no arguments
 */
if (!program.args.length) {
    program.help();
}