var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
    path = require('path'),
    publicDir = path.join(__dirname, 'public');
const router = express.Router();
var upload = require('./routes/upload')
var download = require('./routes/fetch')
var cookieParser = require('cookie-parser');
var cors = require('cors');
var bodyParser = require('body-parser');


app.use(express.static(publicDir))


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.use(cors(
    {
        origin: ['http://localhost:3001', 'http://10.0.0.137:3000','http://10.0.0.188:3000'],
        credentials: true,
    }
));

app.use('/upload', upload);
app.use('/download', download);

app.listen(port);



module.exports = app;
