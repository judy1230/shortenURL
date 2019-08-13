module.exports = {
	authenticated: (req, res, next) => {
		console.log('req.body.orgURL:', req.body.orgURL)
		if (req.body.orgURL = "") {
			req.flash('warning_msg', '請填入網址!')
			res.redirect('/')
		}
		
		return next()
	},
}