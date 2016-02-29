/**
 * Config
 * @author Christoph Melzer <christoph.melzer1@gmail.com>
 */

'use strict';

function Config() {}

Config.prototype.setConfig = function (config) {
    if (typeof config !== 'object') {
        throw new Error('given config is not an object');
    }

    this.config = config;
};

Config.prototype.has = function (key) {
    return this.config.hasOwnProperty(key);
};

Config.prototype.get = function (key) {
    return this.has(key) ? this.config[key] : null;
};

Config.prototype.set = function (key, value, force) {
    force = force === 'undefined' ? true : force;

    if (force || !this.has(key)) {
        this.config[key] = value;
        return this;
    }

    throw new Error('key already exists. To overwrite it, please set force parameter to true');
};

module.exports = new Config();