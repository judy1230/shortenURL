const LocalStrategy = require('passport-local').Strategy  // 載入 passport-local
const mongoose = require('mongoose')
//const bcrypt = require('bcryptjs')
const urlbycrpt = require('../models/urlbycrpt.js')            
    

module.exports =  passport => {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'inputURL', passwordField: 'number', }, ( inputURL, number, done) =>{

				//檢測沒有輸入網址
        if (!inputURL){
					return done(null, false, { message: '請輸入網址!' })
				}

				urlbycrpt.findOne({
					number: number
				}).then((user,err) => {
					console.log('number in passport', number)
					if (err) { return done(err); }

          //驗證是否有相同的number
					if (user.number == number){
						
						return done(null, false, { message: '網頁已存在! 請再輸入一次!' }	)

					}
					
					if (user.number != number) {
			
						return done(null, user.number)
					}

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