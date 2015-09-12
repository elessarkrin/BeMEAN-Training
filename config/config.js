/**
 * Created by ealvarado on 11/09/2015.
 */
var glob = require('glob'),
    _ = require('lodash');

module.exports = require('./env/' + process.env.NODE_ENV);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function (globPatterns, removeRoot) {
    // For context switching
    var _this = this;

    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {

            var files = glob.sync(globPatterns);

            if (removeRoot) {
                files = files.map(function (file) {
                    return file.replace(removeRoot, '');
                });
            }

            output = _.union(output, files);
        }
    }

    return output;
};

/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function() {
    return this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function() {
    return  this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
};