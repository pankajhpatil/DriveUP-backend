var mysql = require('mysql');
const config = require("../../config");
//Put your mysql configuration settings - user, password, database and port
function getConnection(){
    var connection = mysql.createConnection({
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : config.database,
        port	 : config.port
    });
    return connection;
}


function fetchData(callback,sqlQuery){

    // console.log("\nSQL Query::"+sqlQuery);

    var connection=getConnection();

    connection.query(sqlQuery, function(err, rows, fields) {
        if(err){
            console.log("ERROR: " + err.message);
        }
        else
        {	// return err or result
            console.log("DB Results:"+rows);
        }
        callback(err, rows);
    });
    console.log("\nConnection closed..");
    connection.end();
}

exports.fetchData=fetchData;