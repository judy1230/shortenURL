const LocalStrategy = require('passport-local').Strategy  // 載入 passport-local
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/urlbycrpt')

module.exports = passport => {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'number' }, (number, password, done) => {
				User.findOne({
					number: number
				}).then((user, err) => {
					if (err) { return done(err); }

					if (!user) {

						return done(null, false, { message: '帳號不正確, 請重新輸入!' })
					}


					bcrypt.compare(number, user.password, (err, isMatch) => {

						if (err) throw err;
						if (isMatch) {
							return done(null, user)
						} else {
							return done(null, false, { message: '密碼不正確, 請重新輸入!' })
						}

					})
				})
			})
	)

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
}