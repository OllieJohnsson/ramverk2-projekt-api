const db = require("../../db/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let salt = bcrypt.genSaltSync(10);

function register(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let hashedPassword = bcrypt.hashSync(password, salt);

    const sql = "CALL register(?, ?, ?, ?, ?)"
    db.query(sql, [username, hashedPassword, email, firstName, lastName], (err, rows) => {
        if (err) {
            return next(err);
        }

        req.body.registerMessage = `Grattis <b>${username}</b>! Du är nu registrerard.`;
        req.body.payload = {username: username};
        next();
        // res.json({
        //     message: `Grattis <b>${username}</b>! Du är nu registrerard.`
        // })
    })
}





function getHashFromUsername(req, next) {
    const username = req.body.username;
    const sql = "SELECT password FROM users WHERE username = ?";
    db.query(sql, username, (err, rows) => {
        if (rows.length < 1) {
            return next({
                status: 401,
                title: "Unknown username",
                message: `A user with the username ${username} is not in the database`
            });
        }
        req.body.hash = rows[0].password;
        next();
    });
}


function checkPassword(req, next) {
    const username = req.body.username;
    const password = req.body.password;
    const hash = req.body.hash;

    bcrypt.compare(password, hash).then(function(result) {
        if(!result) {
            return next({
                status: 401,
                title: "Unauthorized",
                message: "You typed in the wrong username or password"
            });
        }
        req.body.payload = { username };
        next();
    });
}


function getToken(req, next) {
    const payload = req.body.payload;
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: "1h"});

    req.headers["x-access-token"] = token;
    next();
}


function checkToken(req, next) {
    const token = req.headers["x-access-token"];
    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return next({
                status: 401,
                title: "JWT Error",
                message: err
            });
        }
        next();
    });
}


function displayToken(req, res) {
    const token = req.headers["x-access-token"];
    const username = req.body.username;
    const registerMessage = req.body.registerMessage;
    res.json({
        message: registerMessage || `Loggade in <b>${username}</b>`,
        token
    });
}





module.exports = {
    register,
    getHashFromUsername,
    checkPassword,
    getToken,
    checkToken,
    displayToken
}
