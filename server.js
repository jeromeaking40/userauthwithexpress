var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    morgan = require('morgan'),
    MongoStore = require('connect-mongo')(session);

var app = express();

//mongodb connection
mongoose.connect('mongodb://localhost/bookworm');
var db = mongoose.connection;

//mongo error
db.on('error', console.error.bind(console, 'connection error:'));

//use session for tracking logins
app.use(session({
    secret: 'Jerome loves you',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// make user ID available in templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.session.userId;
    next();
});

app.use(morgan('dev'));

//Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Serve static files from public
app.use(express.static(__dirname + '/public'));

//Set template engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');


//Include routes
var routes = require('./routes/index');
app.use('/', routes);

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
});

//Error handler
//Define as the last app.use callback
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//Server
app.listen(3000, function(err) {
    if (err) {
        console.error('There was an error: ', err);
        process.exit(1);
    }
    console.log('The server is running on port 3000');
});
