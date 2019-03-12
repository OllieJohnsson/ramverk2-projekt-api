const express = require("express");
const auth = require("../auth/auth");
const objects = require("../objects/objects");
const router = new express.Router();

router.post("/register",
    (req, res, next) => auth.register(req, res, next),
    (req, res, next) => auth.getToken(req, next),
    (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => auth.displayToken(req, res)
);

router.post("/login",
    (req, res, next) => auth.getHashFromUsername(req, next),
    (req, res, next) => auth.checkPassword(req, next),
    (req, res, next) => auth.getToken(req, next),
    (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => auth.displayToken(req, res)
);

router.get("/checkToken",
    (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => auth.displayToken(req, res)
);

router.get("/objects",
    // (req, res, next) => auth.checkToken(req, next),
    (req, res, next) => objects.getAll(req, res, next)
);

router.get("/users", (req, res, next) => auth.getUsers(req, res, next));

router.put("/updatePrice", (req, res, next) => objects.updatePrice(req, res, next));


module.exports = router;
