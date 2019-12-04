var express = require('express');
var router = express.Router();
const instructorschedule= require('./Models/instructorSchedule');
const Student = require('./Models/StudentDetails');
const Resource = require('./Models/Resources');

router.post('/home/plans', function (req, res) {
    let startDate=req.body.fromdate;
    let endDate=req.body.todate;

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

    // console.log(req.body);
    let user=req.session.username;

    // student details update
    Student.findOne({ Name: user })
        .then(student => {
            
        if(student){
            
            Student.updateOne({_id:student._id}, {
                schedule: req.body.selectedSchedules,
                plansummary: req.body.planSummary
            })
            .then(student => {
                console.log("Student details updates successfully");
                
            })
            .catch(err=>console.log(err));
        }
    })
    .catch(err=>console.log(err));



    //instructor details update
    let selectedSchedules = req.body.selectedSchedules;
    let tableData = req.body.tableData;

    selectedSchedules.forEach(element => {
        
        tableData.forEach(item => {

            if(item.iusername == element.iusername && item.sdate == element.sdate){

                if(element.slot == 'Slot1- 8am-10am' && item.slot0810 == 'Y'){
                    item.slot0810 = 'Booked_'+user;
                }
                else if(element.slot == 'Slot2- 10am-12pm' && item.slot1012 == 'Y'){
                    item.slot1012 = 'Booked_'+user;
                }
                else if(element.slot == 'Slot3- 12pm-2pm' && item.slot1214 == 'Y'){
                    item.slot1214 = 'Booked_'+user;
                }
                else if(element.slot == 'Slot4- 2pm-4pm' && item.slot1416 == 'Y'){
                    item.slot1416 = 'Booked_'+user;
                }
                else if(element.slot == 'Slot5- 4pm-6pm' && item.slot1618 == 'Y'){
                    item.slot1618 = 'Booked_'+user;
                }
                else if(element.slot == 'Slot6- 6pm-8pm' && item.slot1820 == 'Y'){
                    item.slot1820 = 'Booked_'+user;
                }
                else if(element.slot == 'Slot7- 8pm-10pm' && item.slot2022 == 'Y'){
                    item.slot2022 = 'Booked_'+user;
                }
            
                instructorschedule.updateOne({_id:item._id}, {
                    slot0810: item.slot0810,
                    slot1012: item.slot1012,
                    slot1214: item.slot1214,
                    slot1416: item.slot1416,
                    slot1618: item.slot1618,
                    slot1820: item.slot1820,
                    slot2022: item.slot2022
                })
                .then(student => {
                    console.log("Instructor details updates successfully");
                })
                .catch(err=>console.log(err));
            }

        });
    });

    res.status(200).send();
});


router.get('/home/appointments', function (req, res) {

    let user=req.session.username;

    Student.findOne({ Name: user })
        .then(student => {  
            res.status(200).send({result: student});
    })
    .catch(err=>console.log(err));
});

router.get('/home/resources', function (req, res) {

    Resource.find()
        .then(resource => { 
            res.status(200).send({result: resource});
    })
    .catch(err=>console.log(err));

    // const resource = new Resource({

    //     index: '1',
    //     desc: 'The California Department of Motor Vehicles (DMV) tests and licenses drivers, maintains driving records, registers and issues titles to vehicles and vessels, investigates auto and identity related fraud, issues disabled placards, licenses vehicle dealers, salespersons, dismantlers, driving and traffic violator schools, and issues permits to commercial truckers.',
    //     file: 'https://www.dmv.ca.gov/web/eng_pdf/dl600.pdf',
    //     videoId: 'TcFGlHUbKgM',
    //     tags: ['Introduction - Making a Bad Decision','Basic Driver License Information','Save Time! Go Online!']
    // });

    // resource.save()
    // .then(resource => {
    //     console.log("Resource details saved successfully");
    //     res.status(200).send();
    // })
    // .catch(err=>console.log(err));

});

module.exports = router;