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
    const sql = "CALL updatePrice(?, ?)";

    db.query(sql, [objectId, price], (err, rows) => {
        if (err) {
            return next(err);
        }
        res.json(rows[0][0]);
    })
}



function priceHistory(req, res, next) {
    const id = req.params.id;
    const sql = "CALL priceHistory(?)";

    db.query(sql, id, (err, rows) => {
        if (err) {
            return next(err);
        }

        res.json(rows[0]);
    });

}


module.exports = {
    getAll,
    updatePrice,
    priceHistory
}
