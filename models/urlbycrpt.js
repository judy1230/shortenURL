const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlbycrptSchema = new Schema({
	inputURL: {
		type: String,
		require: true
	},
	number: {
		type: String,
		require: true
	}
})

module.exports = mongoose.model('Urlbycrpt', urlbycrptSchema)
