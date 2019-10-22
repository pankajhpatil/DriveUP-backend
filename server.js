var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
    path = require('path'),
    publicDir = path.join(__dirname, 'public');
const router = express.Router();

app.use(express.static(publicDir))


app.listen(port);

// Sample
app.get('/sample', function (req, res) {
    console.log("GET API /Sample called!");
    res.status(200).send({message: "Got result from GET"});
});

module.exports = app;
