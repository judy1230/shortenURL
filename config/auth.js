module.exports = {
	authenticated: (req, res, next) => {
		const passport = require('passport')
		const urlbycrpt = require('../models/urlbycrpt.js')  
		let inputURL = req.body.orgURL
		let number = ""
		const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
		for (let i = 0; i < 5; i++) {
			index = Math.floor(Math.random() * letters.length)
			number += letters[index]
		}
		// passport.authenticate('local', {
		// 	successRedirect: '/shortenURL',
		// 	failureRedirect: '/',
		// 	failureFlash: true,
		// })
		//req('warring_msg', [errors][messages][0])

		// if (req.isAuthenticated()) {
		// 	console.log('req.session', req.session)
		// 	return next()
		// }

		urlbycrpt.findOne({
			inputURL: inputURL
		}).then((user, err) => {
			console.log('number in auth', number)
			console.log('number in user', user.number)
			if (err) { return done(err); }

			//驗證是否有相同的number
			if (user.number != number ) {

				req.flash('warning_msg', '請填入網址!')
				res.redirect('/')
			}
			// if (!user.inputURL) {

			// 	return done(null, number)
			// }
			
			else{
				return next()
			}
		})
		// if (req.body.orgURL) {
		// 	 return next()
		// }
		//console.log('req.session', req.session)
		req.flash('warning_msg', '請填入網址!')
		res.redirect('/')
	}	
	// if(req.isAuthenticated()) {
	// return next()

}