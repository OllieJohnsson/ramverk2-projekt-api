const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app.js");
const db = require("../../db/connection");

chai.should();
chai.use(chaiHttp);


describe("Authenticated", () => {
    let token;

    before(() => {
        db.query("DELETE FROM depots", (err) => {
            if (err) {
                console.log("Could not empty test DB depots", err.message);
            }
        });
        db.query("DELETE FROM users", (err) => {
            if (err) {
                console.log("Could not empty test DB users", err.message);
            }
        });
    });



    describe("POST /register", () => {
        const successMessage = "Grattis dolan! Du är nu registrerard.";
        const failMessage = "Användaren dolan är redan registrerad.";
        const user = {
            username: "dolan",
            email: "kalle@me.com",
            firstName: "Kalle",
            lastName: "Anka",
            password: "1234"
        };

        it(`200 should register user and return message: "${successMessage}"`, (done) => {
            chai.request(server)
            .post("/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.equal(successMessage);
                done();
            });
        });


        it(`500 should fail to register with message: "${failMessage}"`, (done) => {
            chai.request(server)
            .post("/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.errors[0].detail.should.equal(failMessage);
                done();
            });
        });
    });
});
