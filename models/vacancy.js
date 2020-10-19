const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const VacancySchema = new Schema({
    project: String,
    client: String,
    technology: String,
    role: String,
    description: String,
    status: String,
    createdby: String,
    appliedBy:[String]
})

module.exports = mongoose.model('Vacancy', VacancySchema);
