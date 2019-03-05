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


module.exports = {
    getAll
}
