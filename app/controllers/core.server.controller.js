/**
 * Created by ealvarado on 11/09/2015.
 */
'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        request: req
    });
};