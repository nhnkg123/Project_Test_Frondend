let express = require('express');
let app = express();
const axios = require('axios');

const indexRoute = require('./routes/index');

//Set public static folder
app.use(express.static(__dirname + '/public'));

//Use view engine
let expressHbs = require('express-handlebars');

let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    runtimeOptions: {allowProtoPropertiesByDefault: true}, 
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Use Body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false}));

let session = require('express-session');
app.use(session({
    cookie: {httpOnly: true, maxAge: null},
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    const API_URL_users = 'https://jsonplaceholder.typicode.com/users';

    axios.get(API_URL_users)
        .then(users => {
            req.session.cookie.maxAge =  30 * 24 * 60 * 60 * 1000;
            req.session.user = users.data[0];
            res.locals.user = users.data[0];
            next();
        })
        .catch(err => console.log(err));
    
});

app.use('/', indexRoute);

//Set server port and start sever
app.listen(8000);