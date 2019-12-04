var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
const multer = require("multer");
const config = require("../config");
var mysql = require('./db/sql');
var moment = require('moment');
const instructorschedule= require('./models/instructorSchedule');



var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}});


router.get('/getISchedule', function (req, res) {
//instructorschedules
var name=req.session.username;
  
instructorschedule.find({ iusername : name },(err, data) => {
    res.statusMessage = "Fetch Complete";
    res.status(200).send({result: data});
});

});


// GET to upload
router.post('/createinstructorSchedule', function (req, res) {
    console.log("insert instructor schedules!",req.session.username);
    var username=req.session.username;
    //username="test22";
    var now = moment(req.body.fromdate);
    var later = moment(req.body.todate);
//console.log(req.body.fromdate);
//console.log(now);
//console.log(req.body.slot0810);
//console.log(later);
var cnt=(later.diff(now,"days")+1);

    for(var i=0; i<=cnt; i++){
        //console.log(now.format("DD-MM-YYYY"));
          //mongo
     const ISchedule = new instructorschedule({
        iusername : username,
        sdate : now.format("DD-MMM-YYYY"),
        slot0810:req.body.slot0810,
        slot1012:req.body.slot1012,
        slot1214:req.body.slot1214,
        slot1416:req.body.slot1416,
        slot1618:req.body.slot1618,
        slot1820:req.body.slot1820,
        slot2022:req.body.slot2022
      });
      //console.log('%%%%%%%');
      //console.log(ISchedule);
      //check if already exisits
      ISchedule.save()
      .then(user => {
          console.log('Schedule registered in Mongo');
      })
      .catch(err=>console.log(err));
     //console.log(now.format("DD-MMM-YYYY"));
    now = moment(now, "DD-MM-YYYY").add(1, 'days');
    }
   

      //{"_id":{"$oid":"5ddf7d6e1c9d440000467c4e"},"instructorID":"1","sdate":{"$date":{"$numberLong":"1573459200000"}},"slot0810":"Y","slot1012":"Y","slot1214":"Y","slot1416":"Y","slot1618":"Y","slot1820":"Y","slot2022":"Y"}
      res.statusMessage = "Schedule Created";      
        res.status(200).send({message: "Got result from GET"});
});

router.post('/updateIdetails', function (req, res, next) {
    // var user_id = req.file;
    // console.log(user_id);
    // console.log("INside /insert" +  "withoutbody" +req.body);

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

router.post('/deleteISdetails', function (req, res, next) {

//instructorschedules
var name=req.session.username;
var deletiondate=req.body.sdate;  

instructorschedule.deleteOne({ iusername : name ,sdate:deletiondate },(err, data) => {
    console.log(data);
    res.statusMessage = "delete Complete";
    res.status(200).send({result: data});
});

});


module.exports = router;