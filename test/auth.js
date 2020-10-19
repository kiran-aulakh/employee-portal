process.env.JWT_SECRET= "secret"
process.env.DB_URL = "mongodb://127.0.0.1/nodejs"
let mongoose = require("mongoose");
let User = require('../models/employee');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
const expect = chai.expect;
let token = "";
let id = "";
chai.use(chaiHttp);
//Our parent block
describe('Employees ', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
           done();
        });
    });
/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all the users and authenticate', (done) => {
        chai.request(app)
            .post('/auth/register')
            .send({
                username: "admin",
                email: "a@a.com",
                password: "admin",
                role: "manager",
            })
            .end((err, res) => {
                  should.exist(res.body);
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
  });

  it("it should test login", (done) => {
    chai.request(app)
        .post('/auth/login')
        .send({
            username: 'e1',
            password: 'e1'
        })
        .end((error, res) => {
            should.exist(res.body);
            token = res.body.token;
            id = res.body.id;
            res.body.should.be.a('object');
            should.exist(res.body);
            done();
        })
});
});