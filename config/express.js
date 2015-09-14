/**
 * Created by ealvarado on 11/09/2015.
 */
var http = require('http'),
    express = require('express'),
    session = require('express-session'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')({
        session: session
    }),
    consolidate = require('consolidate'),
    chalk = require('chalk'),
    path = require('path');

module.exports = function (db) {

    var app = express();

    config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        next();
    });

    // Showing stack errors
    app.set('showStackError', true);

    // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set('view engine', 'server.view.html');
    app.set('views', './app/views');

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));

        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // CookieParser should be above session
    app.use(cookieParser());

    db.connection.on("connect", function (err) {
        // Express MongoDB session storage
        app.use(session({
            saveUninitialized: true,
            resave: true,
            secret: config.sessionSecret,
            store: new mongoStore({
                db: db.connection.db,
                collection: config.sessionCollection
            })
        }));
    });

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./public')));

    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not Found'
        });
    });

    // Return Express server instance
    return app;
};