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
// upload file to s3 and log file details
router.post("/", upload.single("file"), function (req, res) {
    const moment = require('moment');    
    //File Upload started
    var startDate = new Date();

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
        var cnt = "";

        if (err) {
            res.status(500).json({error: true, Message: err});
        } else {
            //success
            res.send({data});

            //File Upload ended       
            var endDate   = new Date();
            console.log(`Difference in seconds:`+(endDate - startDate) / 1000);
            //insert in database
            var newFileUploaded = {
                description: req.body.description,
                fileLink: s3FileURL + file.originalname,
                s3_key: params.Key
            };
            //check if already exisits

            var sqlfetchQuery = "select count(*) as cnt from `dropboxmysql`.`user_files` where ( file_name = '" + file.originalname + "')";
            console.log(sqlfetchQuery);
    //Number cnt = 0;
        mysql.fetchData(function (err, results) {
            if (err) {
                console.log(err);
                //throw err;
            }
            else {

                console.log("fetch Complete");
                console.log(results);
                console.log(results[0].cnt);
                cnt=results[0].cnt;
                console.log(cnt);
                
                if(Number(cnt) > 0){
                    //update data
                    var sqlupdateQuery = "UPDATE `dropboxmysql`.`user_files` SET `fileuploadtime` = '"+((endDate - startDate) / 1000)+"', `filemodifieddate` = now() ,`filedesc` = 'File Updated' WHERE (`file_name` = '"+ file.originalname + "')";
                    console.log(sqlupdateQuery);
            
                mysql.fetchData(function (err, results) {
                    if (err) {
                        console.log(err);
                        //throw err;
                    }
                    else {
        
                        console.log("update Complete");
                       // res.statusMessage = "Insert Complete";
                       // res.status(200).send({result: results});
        
                    }
                }, sqlupdateQuery);
    
    
            }
            else{
                //insert data
                var sqlinsertQuery = "INSERT INTO `dropboxmysql`.`user_files` (`userid`, `file_name`,`filedesc`, `fileuploadtime`, `filemodifieddate`, `filecreatedate`, `fileurl`) VALUES ('" + "1" + "','" + file.originalname + "','" + file.originalname + "', '" + ((endDate - startDate) / 1000) + "', " + "now()" + ", " + "now()" + ", '" + s3FileURL + file.originalname + "')";
                console.log(sqlinsertQuery);
        
            mysql.fetchData(function (err, results) {
                if (err) {
                    console.log(err);
                    //throw err;
                }
                else {
    
                    console.log("Insert Complete");
                   // res.statusMessage = "Insert Complete";
                   // res.status(200).send({result: results});
    
                }
            }, sqlinsertQuery);
        }

               // res.statusMessage = "Insert Complete";
               // res.status(200).send({result: results});

            }
        }, sqlfetchQuery);




    
         //   INSERT INTO `dropboxmysql`.`user_files` (`userid`, `file_name`, `fileuploadtime`, `filemodifieddate`, `filecreatedate`, `fileurl`) VALUES ('1', '283_01.pdf', 0.023, now(), now(), 'https://cmpe281dropboxfiles.s3.us-west-1.amazonaws.com/283_01.pdf');

          //  console.log(newFileUploaded);

        }
    });

});

// POST to delete
// delete from s3 bucket
router.post("/delete", upload.single("file"), function (req, res) {
console.log("deleting from s3 bucket");
    //File Upload started
    var startDate = new Date();

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
        Key: file.originalname
    };

    s3bucket.deleteObject

    s3bucket.deleteObject(params, function (err, data) {
        var cnt = "";

        if (err) {
            res.status(500).json({error: true, Message: err});
        } else {
            //success
            res.send({data});
            //File Upload ended       
            var endDate   = new Date();
            console.log(`Difference in seconds:`+(endDate - startDate) / 1000);
            //insert in database
            var newFileUploaded = {
                description: req.body.description,
                fileLink: s3FileURL + file.originalname,
                s3_key: params.Key
            };
            //delete from user_files

            var sqldeleteQuery = "    DELETE FROM `dropboxmysql`.`user_files` WHERE (`file_name` = '" + file.originalname + "')";
            console.log(sqldeleteQuery);
    //Number cnt = 0;
        mysql.fetchData(function (err, results) {
            if (err) {
                console.log(err);
                //throw err;
            }
            else {

                console.log("delete Complete");
                console.log(results);
            }
        }, sqldeleteQuery);




    
         //   INSERT INTO `dropboxmysql`.`user_files` (`userid`, `file_name`, `fileuploadtime`, `filemodifieddate`, `filecreatedate`, `fileurl`) VALUES ('1', '283_01.pdf', 0.023, now(), now(), 'https://cmpe281dropboxfiles.s3.us-west-1.amazonaws.com/283_01.pdf');

          //  console.log(newFileUploaded);

        }
    });






});


router.get('/test', function (req, res) {

    console.log("INside /test");
    var a =Number('1');
    console.log(a === 1);
    console.log(Number('1') === 1);
console.log(Number('1') > 0);

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

router.post('/createuser', function (req, res, next) {
    // var user_id = req.file;
    // console.log(user_id);
    // console.log("INside /insert" +  "withoutbody" +req.body);
    //console.log(req.body);
    //console.log("full request "+req);
    //console.log(req);

    var sqlselectQuery = "select count(*) as cnt from `user_data` where ( `username` = '" + req.body.username + "')";

    console.log(sqlselectQuery);
    
        mysql.fetchData(function (err, results) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(results[0].cnt);
                console.log((Number(results[0].cnt) > 0));
                if((Number(results[0].cnt) > 0)){
                    console.log("user present abort");
                    res.statusMessage = "User preset";
                    res.status(200).send({result: results});
                    return;
                }else{
                    console.log("user not present continue to insert");
                    //    var sqlQuery = "INSERT INTO `user_data` (`user_id`, `username`, `password`, `firstname`, `lastname`,`email`,`modifieddate`,`phone`) VALUES ('" + req.body.user_id + "','" + req.body.username + "', '" + req.body.password + "', '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.email + "', " + "now()" + ", '" + req.body.phone + "')";
    var sqlQuery = "INSERT INTO `user_data` ( `username`, `password`, `firstname`, `lastname`,`email`,`modifieddate`,`phone`) VALUES ('" + req.body.username + "', '" + req.body.password + "', '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.email + "', " + "now()" + ", '" + req.body.phone + "')";

    console.log(sqlQuery);
    
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

                }
                
            }
        }, sqlselectQuery);

    
  

});


router.post('/updateuser', function (req, res, next) {
    // var user_id = req.file;
    // console.log(user_id);
    // console.log("INside /insert" +  "withoutbody" +req.body);
    console.log(req.body);
    console.log("full request "+req);
    console.log(req);

    var sqlQuery = "UPDATE `dropboxmysql`.`user_data` SET `password` = '" + req.body.password + "',`firstname` = '" + req.body.firstname + "',`lastname` = '" + req.body.lastname + "',`email` = '" + req.body.email + "',`phone`= '" + req.body.phone + "',`modifieddate`=now()  WHERE (`username` = '" + req.body.username + "')";

    console.log(sqlQuery);
    
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

router.post('/deleteuser', function (req, res, next) {
    

    var sqlQuery = "delete from `dropboxmysql`.`user_data`   WHERE (`username` = '" + req.body.username + "')";

    console.log(sqlQuery);
    
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("Record deleted Complete");
                res.statusMessage = "Delete Complete";
                res.status(200).send({result: results});

            }
        }, sqlQuery);
    
  

});

router.get('/fetchs3data', function (req, res) {

    console.log("INside /getuser" +  "withoutbody" +req.body+res.body+req.user_id);

    var sqlQuery = "select d.username,d.firstname,d.lastname,f.file_name,f.filedesc,f.fileuploadtime,f.filemodifieddate,f.filecreatedate,f.fileurl from dropboxmysql.user_files f join dropboxmysql.user_data d on d.user_id=f.userid";
    console.log(sqlQuery);
    
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("Fetch Complete for UI");
                res.statusMessage = "Fetch Complete";
                res.status(200).send({result: results});

            }
        }, sqlQuery);
    
  

});


router.get('/userlogin', function (req, res) {

    console.log("INside /getuser" +  "withoutbody" +req.body+res.body+req.user_id);
    console.log(req.body);
    //console.log(req);

    var sqlQuery = "select * from dropboxmysql.user_data d WHERE (`username` = '" + req.body.username + "') and (`password` = '" + req.body.password + "')";
    console.log(sqlQuery);
    
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                console.log(results.length);
                if (results.length === 1) {
                    req.session.email = req.body.email;
                   // res.status(200);
                    res.status(200).send({result: results});
                }
                else {
                    res.status(403);
                    res.send({msg: 'Invalid credentials'});
                }
                // console.log("Fetch Complete for UI");
                // res.statusMessage = "Fetch Complete";
                // res.status(200).send({result: results});

            }
        }, sqlQuery);
    
  

});

module.exports = router;