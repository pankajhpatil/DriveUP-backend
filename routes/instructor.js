var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
const multer = require("multer");
const config = require("../config");
var mysql = require('./db/sql');
var moment = require('moment');
const instructorSchedule= require('./Models/instructorSchedule');



var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}});


// GET to upload
router.get('/', function (req, res) {
    console.log("Show instructor schedules!");
    var now = moment();
    var later = moment(now, "DD-MM-YYYY").add(30, 'days');

    var sDate=now.format("DD-MM-YYYY");
    var eDate=later.format("DD-MM-YYYY");

    console.log(now.format("DD-MM-YYYY"));
    console.log(later.format("DD-MM-YYYY"));
    console.log(later.diff(now,"days"));
    for(var i=0; i<=later.diff(now,"days"); i++){
        //console.log(now.format("DD-MM-YYYY"));
        now = moment(now, "DD-MM-YYYY").add(1, 'days');

    }
     //mongo
     const ISchedule = new instructorSchedule({
        instructorID : 2,
        sdate : now,
        slot0810:"Y",
        slot1012:"Y",
        slot1214:"Y",
        slot1416:"Y",
        slot1618:"Y",
        slot1820:"Y",
        slot2022:"N"
      });
      console.log('%%%%%%%');
      console.log(ISchedule);
      //check if already exisits
      ISchedule.save()
      .then(user => {
          console.log('Schedule registered in Mongo');
      })
      .catch(err=>console.log(err));

      //{"_id":{"$oid":"5ddf7d6e1c9d440000467c4e"},"instructorID":"1","sdate":{"$date":{"$numberLong":"1573459200000"}},"slot0810":"Y","slot1012":"Y","slot1214":"Y","slot1416":"Y","slot1618":"Y","slot1820":"Y","slot2022":"Y"}
        res.status(200).send({message: "Got result from GET"});
});

router.post('/updateIdetails', function (req, res, next) {
    // var user_id = req.file;
    // console.log(user_id);
    // console.log("INside /insert" +  "withoutbody" +req.body);
    console.log(req.body);
    console.log("full request " + req);
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

router.post('/deleteIdetails', function (req, res, next) {


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


module.exports = router;