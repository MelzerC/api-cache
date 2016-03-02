/**
 * File
 * @author Christoph Melzer <christoph.melzer@aboutyou.de>
 */

'use strict';

/**
 * create new File object
 *
 * @param {Object} Config - config object
 * @constructor
 */
function File(Config) {
    this.Config = Config;
}

/**
 * build a filename (including directory) to save request response to
 *
 * @param {string} route - the route to fetch
 * @returns {string}
 */
File.prototype.buildFileName = function (route) {
    var fileName = route.substr(1).replace(/\//g, '-');
    fileName = this.defineFileExtension(fileName);

    return this.Config.get('workingDirectory') + '/' +
        this.Config.get('filesDirectory') + '/' +
        fileName;
};

/**
 * define the file extension on base of config entry
 *
 * @param {string} fileName - filename of the file to write, without extension
 * @returns {string}
 */
File.prototype.defineFileExtension = function (fileName) {
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

module.exports = File;