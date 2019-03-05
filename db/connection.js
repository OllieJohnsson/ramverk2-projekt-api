const mysql = require('mysql');

// switch (process.env.NODE_ENV) {
    // case "development":
return module.exports = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: 'rv2proj'
});
        // break;
    //
    // case "production":
    //     return module.exports = mysql.createPool({
    //         connectionLimit: 10,
    //         host: 'eu-cdbr-west-02.cleardb.net',
    //         user: process.env.MYSQL_USER,
    //         password: process.env.MYSQL_PASS,
    //         database: 'heroku_a840f59c1a1e794'
    //     });
    //     break;

// }
