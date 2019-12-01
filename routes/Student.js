var express = require('express');
var router = express.Router();
const instructorschedule= require('./models/instructorschedule');

router.post('/home/plans', function (req, res) {
    let startDate=req.body.fromdate;
    let endDate=req.body.todate;

    //console.log(req.body);

    // let index=0;
    // let query = '';
    // req.body.slots.forEach(myFunction); 
    // function myFunction(item, index) 
    // { 
    //     // console.log(item);
    //     query = query+"{ "+item+": { $eq: 'Y'}} ,";
    // }
    // query += " ]}";


    let slot1012=req.body.slot1012;
    let slot1214=req.body.slot1214;
    let slot1416=req.body.slot1416;
    let slot1618=req.body.slot1618;
    let slot1820=req.body.slot1820;
    let slot2022=req.body.slot2022;

        instructorschedule.find({$and: [
            { sdate: { $gte: startDate } }, { sdate: { $lte: endDate}}
        ]},(err, data) => {

        if(Array.isArray(data) && data.length==0){
            res.statusMessage = "No Instructors are Available";
        }
        else{
            res.statusMessage = "Instructors are Available";
        }
        res.status(200).send({result: data});
    });

});

router.post('/home/confirm', function (req, res) {

    let user=req.session.username;
    let finalUpdate = [];

    let timetable =  req.body.timetable;
    let selectedRowKeys =  req.body.selectedRowKeys;

    selectedRowKeys.forEach(element => {

        console.log(timetable[element]);
        let date=timetable[element].sdate;
        let name=timetable[element].iusername;
        let slot=timetable[element].slot;

        instructorschedule.findOne({ $and: [ {iusername: name}, {sdate: date}]},(err, data) => {
            console.log('data retirved');
            console.log(data);
            let ISchedule = new instructorschedule({
                iusername : name,
                sdate : date,
                slot0810:data.slot0810,
                slot1012:data.slot1012,
                slot1214:data.slot1214,
                slot1416:data.slot1416,
                slot1618:data.slot1618,
                slot1820:data.slot1820,
                slot2022:data.slot2022
            });

            // slots.forEach(slot => {

            if(slot == 'Slot1- 8am-10am' && ISchedule.slot0810 == 'Y'){
                ISchedule.slot0810 = 'Booked_'+user;
            }
            else if(slot == 'Slot2- 10am-12pm' && ISchedule.slot1012 == 'Y'){
                ISchedule.slot1012 = 'Booked_'+user;
            }
            else if(slot == 'Slot3- 12pm-2pm' && ISchedule.slot1214 == 'Y'){
                ISchedule.slot1214 = 'Booked_'+user;
            }
            else if(slot == 'Slot4- 2pm-4pm' && ISchedule.slot1416 == 'Y'){
                ISchedule.slot1416 = 'Booked_'+user;
            }
            else if(slot == 'Slot5- 4pm-6pm' && ISchedule.slot1618 == 'Y'){
                ISchedule.slot1618 = 'Booked_'+user;
            }
            else if(slot == 'Slot6- 6pm-8pm' && ISchedule.slot1820 == 'Y'){
                ISchedule.slot1820 = 'Booked_'+user;
            }
            else if(slot == 'Slot7- 8pm-10pm' && ISchedule.slot2022 == 'Y'){
                ISchedule.slot2022 = 'Booked_'+user;
            }
            console.log(ISchedule);

            instructorschedule.update({_id:data._id}, {
                iusername: ISchedule.iusername,
                sdate: ISchedule.sdate,
                slot0810: ISchedule.slot0810,
                slot1012: ISchedule.slot1012,
                slot1214: ISchedule.slot1214,
                slot1416: ISchedule.slot1416,
                slot1618: ISchedule.slot1618,
                slot1820: ISchedule.slot1820,
                slot2022: ISchedule.slot2022
             })
             .then(instructor => {
                console.log("Schedule updated successfully");
                console.log(instructor);
                res.status(200).send();
            })
            .catch(err=>console.log(err));
    });
});
});

module.exports = router;