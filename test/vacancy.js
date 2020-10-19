process.env.JWT_SECRET= "secret"
process.env.DB_URL = "mongodb://127.0.0.1/nodejs"
let mongoose = require("mongoose");
let Vacancy = require('../models/vacancy');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
//Our parent block
describe('Employees ', () => {
    beforeEach((done) => { //Before each test we empty the database
        Vacancy.remove({}, (err) => {
           done();
        });
    });

    // Create new post
    it('should create new post', (done) => {

        chai.request(app)
            .post('/vacancy/post')
            .set('Authorization', 'Bearer ' + " ")
            .send({
                "project": "AirZck",
                "client": "AirZck",
                "technology": "AirZck",
                "role": "Developer",
                "description": "Developer",
                "status": "OPEN"
            })
            .end((error, res) => {
                should.exist(res.body);
                res.body.should.be.a('object');
                done();
            })
    });

    it('should get all available vacancies', (done) => {
        chai.request(app)
            .get('/vacancy/all')
            .set('Authorization', 'Bearer ' + "")
            .end((error, res) => {
                should.exist(res.body);
                done();
            })
    })


    it('should apply for vacancy', (done) => {
        chai.request(app)
            .get('/vacancy/apply/' + "i")
            .set('Authorization', 'Bearer ' + "")
            .end((error, res) => {
                should.exist(res.body);
                res.body.should.be.a('object');
                done();
            })
    })

    it('should display vacancy detail', (done) => {
        chai.request(app)
            .get('/vacancy/get/' + "i")
            .set('Authorization', 'Bearer ' + "")
            .end((error, res) => {
                should.exist(res.body);
                res.body.should.be.a('object');
                done();
            })
    })


    it('should update vacancy', (done) => {
        chai.request(app)
            .post('/vacancy/create/' + "i")
            .set('Authorization', 'Bearer ' + "")
            .send({
                "status": "CLOSED"
            })
            .end((error, res) => {
                should.exist(res.body);
                res.body.should.be.a('object');
                done();
            })
    })
});