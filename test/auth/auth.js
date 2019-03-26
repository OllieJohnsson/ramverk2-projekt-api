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
        const failMessageDuplicateUsername = "Användaren dolan är redan registrerad.";
        const failMessageDuplicateEmail = "En användare med e-postadressen kalle@me.com är redan registrerad.";
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


        it(`500 should fail to register with message: "${failMessageDuplicateUsername}"`, (done) => {
            chai.request(server)
            .post("/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.errors[0].detail.should.equal(failMessageDuplicateUsername);
                done();
            });
        });


        it(`500 should fail to register with message: "${failMessageDuplicateEmail}"`, (done) => {
            user.username = "hej";
            chai.request(server)
            .post("/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.errors[0].detail.should.equal(failMessageDuplicateEmail);
                done();
            });
        });
    });




    describe("POST /login", () => {
        const successMessage = "Loggade in dolan.";
        const failMessageIncorrectValue = "Fel användare eller lösenord.";
        const failMessageUnknownUser = "Användaren lala är inte registrerad än.";
        const user = {
            username: "dolan",
            password: "1234"
        };

        it(`200 should login user and return message: "${successMessage}"`, (done) => {
            chai.request(server)
            .post("/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.equal(successMessage);
                done();
            });
        });

        it(`401 should fail to login with message: "${failMessageIncorrectValue}"`, (done) => {
            user.password = "hej";
            chai.request(server)
            .post("/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.errors[0].detail.should.equal(failMessageIncorrectValue);
                done();
            });
        });

        it(`401 should fail to login with message: "${failMessageUnknownUser}"`, (done) => {
            user.username = "lala";
            chai.request(server)
            .post("/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.errors[0].detail.should.equal(failMessageUnknownUser);
                done();
            });
        });
    });
});
