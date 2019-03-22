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
        const failMessage = "User with email oliver@me.com is already registered";

        it(`200 should register user and return message: "${successMessage}"`, (done) => {
            const user = {
                username: "dolan",
                email: "kalle@me.com",
                firstName: "Kalle",
                lastName: "Anka",
                password: "1234"
            };
            chai.request(server)
            .post("/register")
            .send(user)
            .end((err, res) => {
                // res.should.have.status(200);
                res.body.message.should.equal(successMessage);
                done();
            });
        });



    });
    //
    //
    //
    //
    //
    //
    // describe("GET /users", () => {
    //     const email = "oliver@me.com";
    //     it(`200 should return list of users including user with email "${email}"`, (done) => {
    //         chai.request(server)
    //         .get("/users")
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.an("array");
    //             res.body[0].email.should.equal(email);
    //             done();
    //         });
    //     });
    // });
    //
    //
    //
    //
    //
    //
    //
    // describe("POST /login", () => {
    //
    //     it("401 should fail to login because email was not registered", (done) => {
    //         const user = {
    //             email: "wrong@me.com",
    //             password: "1234"
    //         };
    //         chai.request(server)
    //         .post("/login")
    //         .send(user)
    //         .end((err, res) => {
    //             res.should.have.status(401);
    //             res.body.should.be.an("object");
    //             res.body.errors[0].detail.should.equal("A user with the email address wrong@me.com is not in the database");
    //             done();
    //         });
    //     });
    //
    //     it("401 should fail to login because wrong password was provided", (done) => {
    //         const user = {
    //             email: "oliver@me.com",
    //             password: "123"
    //         };
    //         chai.request(server)
    //         .post("/login")
    //         .send(user)
    //         .end((err, res) => {
    //             res.should.have.status(401);
    //             res.body.should.be.an("object");
    //             res.body.errors[0].detail.should.equal("You typed in the wrong email address or password");
    //             done();
    //         });
    //     });
    //
    //
    //     const successMessage = "Successfully logged in oliver@me.com";
    //     it(`200 should return token and message: ${successMessage}`, (done) => {
    //         const user = {
    //             email: "oliver@me.com",
    //             password: "1234"
    //         };
    //         chai.request(server)
    //         .post("/login")
    //         .send(user)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.an("object");
    //             res.body.token.should.be.a("string");
    //             res.body.message.should.equal(successMessage);
    //             this.token = res.body.token;
    //             done();
    //         });
    //     });
    // });
})
