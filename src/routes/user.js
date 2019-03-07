const express = require("express");
const user = require("../user/user");
const auth = require("../auth/auth");

const router = new express.Router();

router.post("/user/deposit",
    (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => user.deposit(req, res, next)
);

router.post("/user/buy",
    (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => user.buy(req, res, next)
);

router.post("/user/depot",
    (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => user.depot(req, res, next)
);

router.post("/user/boughtObjects",
    (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => user.boughtObjects(req, res, next)
);




module.exports = router;
