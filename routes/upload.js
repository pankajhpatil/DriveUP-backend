var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
const multer = require("multer");
const config = require("../config");
var mysql = require('./db/sql');

var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}});


// GET to upload
router.get('/', function (req, res) {
    console.log("GET API /upload called!");
    res.status(200).send({message: "Got result from GET"});
});


// POST to upload
router.post("/", upload.single("file"), function (req, res) {
    const file = req.file;

    const s3FileURL = config.AWS_Uploaded_File_URL_LINK;

    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        region: config.AWS_REGION
    });

    //Location of store for file upload

    var params = {
        Bucket: config.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };

    

    s3bucket.upload(params, function (err, data) {
        if (err) {
            res.status(500).json({error: true, Message: err});
        } else {
            //success
            res.send({data});

            //insert in database
            var newFileUploaded = {
                description: req.body.description,
                fileLink: s3FileURL + file.originalname,
                s3_key: params.Key
            };

            console.log(newFileUploaded);

        }
    });
});

router.get('/test', function (req, res) {

    console.log("INside /test");

    var sqlQuery = "SELECT * from user_data";


    
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("Fetch Project Details Successful!");
                res.statusMessage = "Data fetched";
                res.status(200).send({result: results});

            }
        }, sqlQuery);
    
  

});

router.post('/insert', function (req, res, next) {
    var user_id = req.file;
    console.log(user_id);
    //console.log("INside /insert" +  "withoutbody" +req.body);


    // var sqlQuery = "INSERT INTO `user_data` (`user_id`, `username`, `password`, `firstname`, `lastname`) VALUES ('" + req.body.user_id + "','" + req.body.username + "', '" + req.body.password + "', '" + req.body.firstname + "', '" + req.body.lastname + "')";

    
    //     mysql.fetchData(function (err, results) {
    //         if (err) {
    //             throw err;
    //         }
    //         else {

    //             console.log("Insert Complete");
    //             res.statusMessage = "Insert Complete";
    //             res.status(200).send({result: results});

    //         }
    //     }, sqlQuery);
    
  

});

router.get('/getuser', function (req, res) {

    console.log("INside /getuser" +  "withoutbody" +req.body+res.body+req.user_id);

    var sqlQuery = "select * from user_data where user_id=req.body.user_id or username=req.body.username";

    
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("Insert Complete");
                res.statusMessage = "Insert Complete";
                res.status(200).send({result: results});

            }
        }, sqlQuery);
    
  

});

module.exports = router;