var mysql = require('mysql');
var connection = mysql.createConnection({
    host : "54.180.140.100",
    user : "root",
    password: "hongik998013",
    database: "opentutorials",
    port: 3306
});

connection.connect();
connection.query('SELECT * FROM topic', function(error, results,fields){
    if(error){
        console.log(error);
    }
    console.log(results);
});
connection.end();
