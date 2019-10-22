var express = require('express');
var router = express.Router();


// Sample
router.get('/', function (req, res) {
    console.log("GET API /upload called!");
    res.status(200).send({message: "Got result from GET"});
});

module.exports = router;