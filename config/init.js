/**
 * Created by ealvarado on 11/09/2015.
 */

var glob = require('glob'),
    chalk = require('chalk');

/**
 * Module init function.
 */
module.exports = function () {
    /**
     * Before we begin, lets set the environment variable
     * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
     */
    var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');

    if (!environmentFiles.length) {
        console.log(chalk.yellow('Noce_ENV set to development'));
        process.env.NODE_ENV = 'development';
    } else {
        console.log(chalk.yellow('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration'));
    }

};