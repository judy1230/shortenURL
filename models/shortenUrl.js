const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortenUrlSchema = new Schema({
	inputURL: {
		type: String,
		require: true
	},
	number: {
		type: String,
		require: true
	},
	shortenURL: {
		type: String,
		require: true
	}
})

module.exports = mongoose.model('shortenUrl', shortenUrlSchema)
