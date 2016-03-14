/**
 * Loader
 * @author Christoph Melzer <christoph.melzer1@gmail.com>
 */

'use strict';

var File  = require('./File'),
    fs    = require('fs'),
    http  = require('http'),
    https = require('https');

/**
 * create new Loader object
 *
 * @param {Object} Config - config object
 * @param {Object} option - object containing options from cli command
 * @constructor
 */
function Loader(Config, option) {
    this.Config = Config;
    this.option = option;
    this.File = new File(this.Config);
}

/**
 * fetch routes from options or config and loop over the array to download
 * content from every single route
 */
Loader.prototype.download = function () {
    var routes  = (this.option.hasOwnProperty('paths') && typeof this.option.paths === 'string')
            ? this.option.paths.split(',')
            : this.Config.get('routes');

    routes.forEach(function (route) {
        this.load(route);
    }.bind(this));
};

/**
 * setup request and pipe response to a file
 *
 * @param {string} route - route from where to fetch content
 */
Loader.prototype.load = function (route) {
    var api      = this.Config.get('api'),
        fileName,
        file,
        request;

    fileName = this.File.buildFileName(route);
    file     = fs.createWriteStream(fileName);

    request = this.setupRequest(route, api);
    request.on('response', function (response) {
        response.pipe(file);
        console.log('downloading: ' + fileName);
    }.bind(this));

    request.end();
};

/**
 * setup request and return the prepared object
 *
 * @param {string} route
 * @param {Object} config
 */
Loader.prototype.setupRequest = function (route, config) {
    var request,
        options  = {
            method: 'GET',
            host: config.host,
            path: route,
            headers: config.headers
        };

    if (config.hasOwnProperty('protocol') && config.protocol === 'https') {
        options.port = config.hasOwnProperty('port') ? config.port : 443;
        request = https.request(options);
    } else {
        options.port = config.hasOwnProperty('port') ? config.port : 80;
        request = http.request(options);
    }

    return request;
};

module.exports = Loader;