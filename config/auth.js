module.exports = {
	authenticated: (req, res, next) => {
		console.log('req.body.orgURL:', req.body.orgURL)
		if (req.body.orgURL) {
			return next()
		}
		// Urlbycrpt.findOne({ number: number }, (err, urlbycrpt) => {
		// 	console.log('number', number)
		// 	if (err) return console.error(err)
		// 	req.flash('warning_msg', '網址已存在!')
		// 	return res.redirect('/')
		// })
		req.flash('warning_msg', '請填入網址!')
		res.redirect('/')
		
	},
}