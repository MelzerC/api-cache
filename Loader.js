/**
 * Loader
 * @author Christoph Melzer <christoph.melzer1@gmail.com>
 */

'use strict';

var fs       = require('fs'),
    http     = require('http'),
    https    = require('https'),
    path     = require('path');

/**
 * uses config object (enriched with current working directory) and option object,
 * which contains the options from cli command
 *
 * @param Config
 * @param option
 * @returns {string}
 */
function Loader(Config, option) {
    this.Config = Config;
    this.option = option;
}

/**
 * fetch routes from options or config an loop over the array to download content from every single route
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
 *
 * @param route
 */
Loader.prototype.load = function (route) {
    var api      = this.Config.get('api'),
        fileName,
        file,
        options,
        request;

    fileName = this._buildFileName(route);
    file     = fs.createWriteStream(fileName);
    options  = {
        method: 'GET',
        host: api.host,
        path: route,
        headers: api.headers
    };

    if (api.hasOwnProperty('protocol') && api.protocol === 'https') {
        request = https.request(options);
    } else {
        request = http.request(options);
    }

    request.on('response', function (response) {
        response.pipe(file);
        console.log('downloading: '+ fileName);
    }.bind(this));

    request.end();
};

/**
 *
 * @param fileName
 * @returns {*}
 */
Loader.prototype.defineFileExtension = function (fileName) {
    var api = this.Config.get('api');
    switch (api.contentType) {
        case 'json':
            fileName += '.json';
            break;
        default:
            throw new Error('this content type is unknown');
    }

    return fileName;
};

/**
 *
 * @param route
 * @returns {string}
 * @private
 */
Loader.prototype._buildFileName = function (route) {
    var fileName = route.substr(1).replace(/\//g, '-');
    fileName = this.defineFileExtension(fileName);

    return this.Config.get('workingDirectory') + '/' +
        this.Config.get('filesDirectory') + '/' +
        fileName;
};

module.exports = Loader;