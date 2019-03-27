const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app.js");
const db = require("../../db/connection");

chai.should();
chai.use(chaiHttp);



describe("Buy", () => {

    let user = {
        username: "dolan",
        password: "1234",
        id: null,
        token: null
    };

    const deleteDepots = function() {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM depots", (err) => {
                if (err) {
                    console.log("Could not empty test DB depots", err.message);
                }
                resolve("deleted depots");
            });
        });
    };

    const deleteUsers = function() {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM users", (err) => {
                if (err) {
                    console.log("Could not empty test DB users", err.message);
                }
                resolve("deleted users");
            });
        });
    };

    const register = function() {
        return new Promise(function(resolve, reject) {
            db.query("CALL register('dolan', '$2b$10$uvxjNQiUczgc0OCqz7PeZe.ztfMtLyef1CQ2Nt1zKL8uF08bn9.5W', 'kalle@me.com', 'Kalle', 'Anka');", (err) => {
                if (err) {
                    console.log("Could not register user", err.message);
                }
                resolve("registered user");
            });
        });
    };


    before("Prepare tables", (done) => {
        deleteDepots().then((res) => {
            console.log(res);
            deleteUsers().then((res) => {
                console.log(res);
                register().then((res) => {
                    console.log(res);
                    chai.request(server)
                    .post("/login")
                    .send(user)
                    .end((err, res) => {
                        user.id = res.body.userId;
                        user.token = res.body.token;
                        done();
                    });
                });
            });
        });
    });




    describe("POST /deposit", () => {
        const failMessageNoValue = "Du glömde skriva in en summa.";
        it(`500 should fail to deposit money and return message: "${failMessageNoValue}"`, (done) => {
            chai.request(server)
            .post("/user/deposit")
            .set("x-access-token", user.token)
            .send({userId: user.id})
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(500);
                res.body.errors[0].detail.should.equal(failMessageNoValue);
                done();
            });
        });

        const failMessageNegativeValue = "Summan måste vara högre än 0.";
        it(`500 should fail to deposit money and return message: "${failMessageNegativeValue}"`, (done) => {
            chai.request(server)
            .post("/user/deposit")
            .set("x-access-token", user.token)
            .send({userId: user.id, amount: -20})
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(500);
                res.body.errors[0].detail.should.equal(failMessageNegativeValue);
                done();
            });
        });

        const depositSuccessMessage = "Insättning lyckades! Du satte in 100kr och ditt konto innehåller nu 100kr.";
        it(`200 should deposit 100 and return message: "${depositSuccessMessage}"`, (done) => {
            chai.request(server)
            .post("/user/deposit")
            .set("x-access-token", user.token)
            .send({userId: user.id, amount: 100})
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.message.should.equal(depositSuccessMessage);
                done();
            });
        });

        const buySuccessMessage = "Köp lyckades! Du har köpt 2 enheter av Kaffe till ett värde av 60kr.";
        it(`200 should buy 2 unit of coffee and return message: "${buySuccessMessage}"`, (done) => {
            chai.request(server)
            .post("/user/buy")
            .set("x-access-token", user.token)
            .send({userId: user.id, objectId: 1, amount: 2})
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.message.should.equal(buySuccessMessage);
                done();
            });
        });

        const sellFailMessage = "Du har inte så många objekt att sälja.";
        it(`500 should fail to sell 3 unit of coffee and return message: "${sellFailMessage}"`, (done) => {
            chai.request(server)
            .post("/user/sell")
            .set("x-access-token", user.token)
            .send({userId: user.id, objectId: 1, amount: 3})
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(500);
                res.body.errors[0].detail.should.equal(sellFailMessage);
                done();
            });
        });

        const sellSuccessMessage = "Försäljning lyckades! Du har sålt 1 enheter av Kaffe till ett värde av 30kr.";
        it(`200 should sell 1 unit of coffee and return message: "${sellSuccessMessage}"`, (done) => {
            chai.request(server)
            .post("/user/sell")
            .set("x-access-token", user.token)
            .send({userId: user.id, objectId: 1, amount: 1})
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.message.should.equal(sellSuccessMessage);
                done();
            });
        });

        const expectedName = "Kaffe";
        const expectedValue = 30;
        it(`200 should return one object with name "${expectedName}" and value "${expectedValue}"`, (done) => {
            chai.request(server)
            .get(`/user/boughtObjects/${user.id}`)
            .set("x-access-token", user.token)
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }

                res.should.have.status(200);
                res.body[0].name.should.equal(expectedName);
                res.body[0].value.should.equal(expectedValue);
                done();
            });
        });



        it(`200 should return an array containing one user with username: "${user.username}"`, (done) => {
            chai.request(server)
            .get("/users")
            .set("x-access-token", user.token)
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body[0].username.should.equal(user.username);
                done();
            });
        });


        it(`200 should return object with username that equals "${user.username}"`, (done) => {
            chai.request(server)
            .get(`/user/depot/${user.id}`)
            .set("x-access-token", user.token)
            .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                res.should.have.status(200);
                res.body.username.should.equal(user.username);
                done();
            });
        });


    });
});
