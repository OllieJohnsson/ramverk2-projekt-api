const express = require("express");
const user = require("../user/user");

const router = new express.Router();

router.post("/user/deposit", (req, res, next) => user.deposit(req, res, next));
router.post("/user/buy", (req, res, next) => user.buy(req, res, next));


module.exports = router;
