var express = require('express');
var port = process.env.PORT || 3001;
var app = express(),
    path = require('path'),
    publicDir = path.join(__dirname, 'public');
const router = express.Router();
var upload = require('./routes/upload')
var download = require('./routes/fetch')
var index = require('./routes/index')
var instructor = require('./routes/instructor')
var student = require('./routes/Student')
var payment = require('./routes/payment')

var cookieParser = require('cookie-parser');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session')
const mongoose=require('mongoose');

app.use(express.static(publicDir))


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

//DB config
const db=require('./routes/models/keys').MongoURI;

//connect to Mongo
mongoose.connect(db,{ useNewUrlParser: true})
.then(()=>console.log('MongoDb connected!!'))
.catch(err=>console.log(err));

app.use(cors(
    {
        origin: ['http://dropboxapp-ui.cmibwegni2.us-east-2.elasticbeanstalk.com','https://dropboxapp-ui.cmibwegni2.us-east-2.elasticbeanstalk.com','https://localhost:3000','http://localhost:3000', 'http://10.0.0.137:3000', 'http://10.0.0.188:3000', 'https://10.0.0.137:3000', 'https://10.0.0.188:3000','http://driveup.pankajhpatil.com','https://driveup.pankajhpatil.com','http://3.134.178.11:3000','https://13.134.178.11:3000','http://18.217.10.228:3000','https://18.217.10.228:3000','http://driveup.pankajhpatil.com:3000','https://driveup.pankajhpatil.com:3000'],
        credentials: true,
    }
));


app.use(session({
    secret: 'my_secret_key_dropBox',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,    //setting the time for active session 10 min
    activeDuration: 5 * 60 * 1000,
}))

app.use('/upload', upload);
app.use('/download', download);
app.use('/', index);
app.use('/', student);
app.use('/instructor', instructor);
app.use('/', student);
app.use('/payment', payment);

app.listen(port);


module.exports = app;
