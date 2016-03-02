/**
 * Config
 * @author Christoph Melzer <christoph.melzer1@gmail.com>
 */

'use strict';

/**
 * Config class which contains all needed configuration options
 * and provide easy access to all entries
 *
 * @constructor
 */
function Config() {}

/**
 * set config from an object
 *
 * @param {Object} config - an object containing the config
 */
Config.prototype.setConfig = function (config) {
    if (typeof config !== 'object') {
        throw new Error('given config is not an object');
    }

    this.config = config;
};

/**
 * check if a given key (property) exists within config object
 *
 * @param   {string} key - key to check for a given property within config
 * @returns {boolean}
 */
Config.prototype.has = function (key) {
    return this.config.hasOwnProperty(key);
};

/**
 * fetch a value for a given key. if this property does not
 * exist within config object, this method will return null
 *
 * @param   {string} key - key to get value
 *
 * @returns {Object|string|number|null}
 */
Config.prototype.get = function (key) {
    return this.has(key) ? this.config[key] : null;
};

/**
 * add a new value to config.
 *
 * @param   {string}               key     - key to store value in
 * @param   {Object|string|number} value   - value to store
 * @param   {boolean}              [force] - defaults to true. in case there is a property with
 *                                           the name of key, force has to be set to true
 *                                           to overwrite the given value
 *
 * @returns {Config}
 */
Config.prototype.set = function (key, value, force) {
    force = force === 'undefined' ? true : force;

    if (force || !this.has(key)) {
        this.config[key] = value;
        return this;
    }

    throw new Error('key already exists. To overwrite it, please set force parameter to true');
};

module.exports = new Config();