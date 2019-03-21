const db = require("../../db/connection");


function getAll(req, res, next) {
    const sql = "SELECT * FROM objects";
    db.query(sql, async (err, rows) => {
        if (err) {
            return next(err);
        }

        const withHistory = rows.map(async object => {
            const sql = "CALL priceHistory(?)";
            return new Promise((resolve) => {
                db.query(sql, object.id, async (err, rows) => {
                    object["history"] = rows[0];
                    resolve(object);
                })
            })
        });

        Promise.all(withHistory).then(objects => {
            res.json(objects)
        })
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

        let object = rows[0][0];
        object["history"] = rows[1];
        res.json(object);
    })
}




module.exports = {
    getAll,
    updatePrice
}
