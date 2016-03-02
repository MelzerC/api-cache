/**
 * Server
 * @author Christoph Melzer <christoph.melzer@aboutyou.de>
 */

'use strict';

var fs    = require('fs'),
    http  = require('http'),
    https = require('https');

var File = require('./File');

/**
 * create a new Server Object
 *
 * @param {object} Config  - config object
 * @param {object} options - object containing options from cli command
 * @constructor
 */
function Server(Config, options) {
    this.Config = Config;
    this.options = options;
}

/**
 *
 */
Server.prototype.start = function () {
    var serverConfig = this.Config.get('server'),
        server;

    if (
        serverConfig &&
            serverConfig.hasOwnProperty('protocol') &&
            serverConfig.protocol.toLowerCase() === 'https'
    ) {
        server = https.createServer(this.handleRequest.bind(this));
    } else {
        server = http.createServer(this.handleRequest.bind(this));
    }

    server.listen(this.definePort(serverConfig));
};


Server.prototype.definePort = function (serverConfig) {
    var port = null;

    if (serverConfig && serverConfig.hasOwnProperty('port')) {
        port = serverConfig.port;
    } else {
        port = 3000;
    }

    return this.options.hasOwnProperty('port') ? this.options.port : port;
};

Server.prototype.handleRequest = function (request, response) {
    var routes = this.Config.get('routes'),
        server = this.Config.get('server'),
        file,
        fileName;

    console.log('requested: ' + request.url);

    if (routes.indexOf(request.url) >= 0) {
        file = new File(this.Config);
        fileName = file.buildFileName(request.url);

        response.writeHeader(200, server.headers);
        response.write(fs.readFileSync(fileName));

        console.log('response:  ' + fileName);
    } else {
        response.writeHead(404);
        response.write('Page not found');

        console.log('response:  404 - Page not found');
    }

    response.end();
};


module.exports = Server;