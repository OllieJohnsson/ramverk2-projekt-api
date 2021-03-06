const mysql = require("mysql");

return module.exports = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: process.env.NODE_ENV === "test" ? "travis" : process.env.MYSQL_USER,
    password: process.env.NODE_ENV === "test" ? "" : process.env.MYSQL_PASS,
    database: process.env.NODE_ENV === "test" ? "rv2projTest" : "rv2proj",
    charset : "utf8mb4"
});
