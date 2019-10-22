var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
    path = require('path'),
    publicDir = path.join(__dirname, 'public');
const router = express.Router();
var upload = require('./routes/upload')


app.use(express.static(publicDir))


app.use('/upload', upload);

app.listen(port);


module.exports = app;
