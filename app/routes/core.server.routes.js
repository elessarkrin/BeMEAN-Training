/**
 * Created by ealvarado on 11/09/2015.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('../../app/controllers/core.server.controller');
    app.route('/').get(core.index);
};