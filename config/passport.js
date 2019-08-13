const LocalStrategy = require('passport-local').Strategy  // 載入 passport-local
const mongoose = require('mongoose')
//const bcrypt = require('bcryptjs')
const User = require('../models/urlbycrpt.js')            
    

module.exports =  passport => {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'number' }, ( number, done) =>{
				User.findOne({
					number:number
				}).then((user,err) => {
					if (err) { return done(err); }

					if(!number){
					
						return done(null, false, { message: '請輸入網址' }	)
					}
					return done(null, number)
					  

				// 	bcrypt.compare(password, user.password, (err, isMatch) => {
						
				// 		if (err) throw err;
				// 		if (isMatch) {
				// 			return done(null, user)
				// 		} else {
				// 			return done(null, false, { message: '密碼不正確, 請重新輸入!' })
				// 	}
					
				// })
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