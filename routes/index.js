var express = require('express');
var router = express.Router();
const config = require("../config");
var mysql = require('./db/sql');


router.post('/login', function (req, res) {

    console.log("INside /getuser" + "withoutbody" + req.body + res.body + req.user_id);
    console.log(req.body);

    var sqlQuery = "select * from dropboxmysql.user_data d WHERE (`username` = '" + req.body.username + "') and (`password` = '" + req.body.password + "')";
    console.log(sqlQuery);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            console.log(results.length);
            console.log(results[0]);
            if (results.length === 1) {
                req.session.username = req.body.username;
                req.session.firstName = results[0].firstname;
                req.session.lastName = results[0].lastname;
                req.session.user_id = results[0].user_id;
                // res.status(200);
                res.status(200).send({result: results});
            }
            else {
                res.status(403);
                res.send({msg: 'Invalid credentials'});
            }


        }
    }, sqlQuery);


});


router.get('/checkLogin', function (req, res) {

    console.log(req.session.username);

    if (req.session.username && req.session.username !== "") {
        res.status(200).send({loggedInUser: req.session});
    }

    else {
        res.status(404);
        res.send({msg: 'No user logged In'});
    }


});


router.post('/register', function (req, res, next) {

    var sqlselectQuery = "select count(*) as cnt from `user_data` where ( `username` = '" + req.body.username + "')";

    console.log(sqlselectQuery);

    mysql.fetchData(function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(results[0].cnt);
            console.log((Number(results[0].cnt) > 0));
            if ((Number(results[0].cnt) > 0)) {
                res.statusMessage = "User present";
                res.status(403).send({result: results});
                return;
            } else {
                console.log("user not present continue to insert");
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


router.get('/fetchs3data', function (req, res) {

    var sqlQuery = "select d.username,d.firstname,d.lastname,f.file_name,f.filedesc,f.fileuploadtime,DATE_FORMAT(f.filecreatedate, '%d-%m-%Y %H:%i:%s') as filecreatedate,DATE_FORMAT(f.filemodifieddate, '%d-%m-%Y %H:%i:%s') filemodifieddate,f.fileurl from dropboxmysql.user_files f join dropboxmysql.user_data d on d.user_id=f.userid WHERE (`username` = '" + req.session.username + "')";

    if (req.session.username === "admin") {
        sqlQuery = "select d.username,d.firstname,d.lastname,f.file_name,f.filedesc,f.fileuploadtime,DATE_FORMAT(f.filecreatedate, '%d-%m-%Y %H:%i:%s') as filecreatedate,DATE_FORMAT(f.filemodifieddate, '%d-%m-%Y %H:%i:%s') filemodifieddate,f.fileurl from dropboxmysql.user_files f join dropboxmysql.user_data d on d.user_id=f.userid";
    }
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

router.get('/fetchallusers', function (req, res) {

    var sqlQuery = "select * from dropboxmysql.user_data d where d.username <> 'admin'";

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


router.get('/logout', function (req, res) {

    if (req.session.username) {
        req.session.destroy();
        res.status(200);
        res.send({msg: 'User logged out Successfully'});
    }
    else {
        res.status(403);
        res.send({msg: 'No user is logged in'});
    }


});

router.post('/login/OAuth', function (req, res) {

    console.log("Inside /login/OAuth");
    console.log(req.body);

    var sqlQuery = "select * from dropboxmysql.user_data d WHERE `email` = '" + req.body.email + "'";
    console.log(sqlQuery);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            // New User
            if(results.length === 0) {
                console.log("user not present continue to insert");
                var insertQuery = "INSERT INTO `user_data` ( `username`, `password`, `firstname`, `lastname`,`email`,`modifieddate`,`phone`) VALUES ('" + 
                                        req.body.username + "', '" + req.body.password + "', '" + req.body.firstname + "', '" + 
                                        req.body.lastname + "', '" + req.body.email + "', " + "now()" + ", '" + req.body.phone + "')";
                mysql.fetchData(function (err, insertResults) {
                    console.log('Results inside:: ');
                    console.log(insertResults.length);
                    console.log(insertResults[0]);                    
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("Insert Complete");
                        res.statusMessage = "Insert Complete";
                        req.session.username = req.body.username;
                        req.session.firstName = req.body.firstname;
                        req.session.lastName = req.body.lastname;
                        req.session.user_id = results.length === 0? 'New User' : results[0].user_id;
                        res.status(200).send({result: results});
                    }
                }, insertQuery);
            }        
        }
    }, sqlQuery);
});

module.exports = router;