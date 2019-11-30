var express = require('express');
var router = express.Router();
const instructorschedule= require('./models/instructorschedule');

router.post('/home/plans', function (req, res) {
    let startDate=req.body.fromdate;
    let endDate=req.body.todate;

    console.log(req.body);

    let index=0;
    let query = '';
    req.body.slots.forEach(myFunction); 
    function myFunction(item, index) 
    { 
        console.log(item);
        query = query+"{ "+item+": { $eq: 'Y'}} ,";
    }
    // query += " ]}";

    console.log(query);

    let slot1012=req.body.slot1012;
    let slot1214=req.body.slot1214;
    let slot1416=req.body.slot1416;
    let slot1618=req.body.slot1618;
    let slot1820=req.body.slot1820;
    let slot2022=req.body.slot2022;

       // {$and: [{ sdate: { $gte: '15-Dec-2019' } }, { sdate: { $lte: '17-Dec-2019' }}, { $or: [ { slot1214: { $eq: 'Y'}} , ]}]}
        // {$and: [{ sdate: { $gte: '15-Dec-2019' } }, { sdate: { $lte: '17-Dec-2019' }} , { slot1214: { $eq: 'Y'}}]}
        // {$and: [{ sdate: { $gte: '15-Dec-2019' } }, { sdate: { $lte: '17-Dec-2019' }},  { slot1214: { $eq: 'Y'}}]}

        instructorschedule.find({$and: [
            { sdate: { $gte: startDate } }, { sdate: { $lte: endDate}}
        ]},(err, data) => {
        console.log(data);

        if(Array.isArray(data) && data.length==0){
            res.statusMessage = "No Instructors are Available";
        }
        else{
            res.statusMessage = "Instructors are Available";
        }
        res.status(200).send({result: data});
    });

});

module.exports = router;