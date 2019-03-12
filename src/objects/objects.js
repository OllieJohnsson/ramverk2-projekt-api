const db = require("../../db/connection");



function getAll(req, res, next) {
    const sql = "SELECT * FROM objects";
    db.query(sql, (err, rows) => {
        if (err) {
            return next(err);
        }

        res.json({
            data: rows
        });
    });
}



function updatePrice(req, res, next) {
    const objectId = req.body.objectId;
    const price = req.body.price;
    const sql = "call(updatePrice(?, ?))";

    db.query(sql, [objectId, price], (err, rows) => {
        if (err) {
            return next(err);
        }

        console.log(`Updated price!`);
    })
}


module.exports = {
    getAll,
    updatePrice
}
