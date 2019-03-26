const db = require("../../db/connection");

function deposit(req, res, next) {
    const userId = req.body.userId;
    const amount = req.body.amount;

    if (!userId || !amount) {
        return next({
            status: 500,
            title: "Missing values",
            message: "Du glömde skriva in en summa."
        });
    }

    if (amount <= 0) {
        return next({
            status: 500,
            title: "Invalid amount",
            message: "Summan måste vara högre än 0."
        });
    }

    const sql = "CALL deposit(?, ?)";
    db.query(sql, [userId, amount], (err, rows) => {
        if (err) {
            return next(err);
        }
        res.json({
            message: `Insättning lyckades! Du satte in ${rows[0][0].deposit}kr och ditt konto innehåller nu ${rows[0][0].balance}kr.`
        })
    })
}





function buy(req, res, next) {
    const userId = req.body.userId;
    const objectId = req.body.objectId;
    const amount = req.body.amount;

    const sql = "CALL buy(?, ?, ?)";
    db.query(sql, [userId, objectId, amount], (err, rows) => {
        if (err) {
            return next(err);
        }
        if (rows[0][0].error) {
            return next({
                message: rows[0][0].error
            });
        }
        res.json({
            message: `Köp lyckades! Du har köpt ${amount} enheter av ${rows[0][0].name} till ett värde av ${rows[0][0].totalValue}kr.`
        })
    })
}


function depot(req, res, next) {
    const userId = req.params.userId;
    const sql = "CALL depot(?)";
    db.query(sql, userId, (err, rows) => {
        if (err) {
            return next(err);
        }
        res.json(rows[0][0]);
    })
}


function boughtObjects(req, res, next) {
    const userId = req.params.userId;
    const sql = "CALL boughtObjects(?)";
    db.query(sql, userId, (err, rows) => {
        if (err) {
            return next(err);
        }
        res.json(rows[0]);
    })
}


function sell(req, res, next) {
    const userId = req.body.userId;
    const objectId = req.body.objectId;
    const amount = req.body.amount;

    const sql = "CALL sell(?, ?, ?)";
    db.query(sql, [userId, objectId, amount], (err, rows) => {
        if (err) {
            return next(err);
        }
        if (rows[0][0].error) {
            return next({
                status: 500,
                title: "Not enough objects",
                message: rows[0][0].error
            });
        }
        res.json({
            message: `Försäljning lyckades! Du har sålt ${amount} enheter av ${rows[0][0].name} till ett värde av ${rows[0][0].totalValue}kr.`
        })
    });
}

function getUsers(req, res, next) {
    db.query("SELECT * FROM users", (err, rows) => {
        res.json(rows);
    });
}


module.exports = {
    deposit,
    buy,
    depot,
    boughtObjects,
    sell,
    getUsers
};
