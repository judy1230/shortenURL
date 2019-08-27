//require related modules used in the proj
const express = require('express')
const app = express()
const port = 1250
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const db = mongoose.connection
const bodyParser = require('body-parser') 
const urlShortener = require('./urlShortener')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const passport = require('passport')
const Urlbycrpt = require('./models/urlbycrpt')
const flash = require('connect-flash')
const {authenticated}  = require('./config/auth.js')
require('./handlebars-helpers')



//set template engine
app.engine('handlebars', exphbs({ defaultLayout:'main'}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://127.0.0.1/urlbycrpt', { useNewUrlParser: true, useCreateIndex: true })

db.on('error', () => {
	console.log('mongodb error!')
})

db.once('open', () => {
	console.log('mongodb connected!')
})

// 使用 express session 
app.use(session({
	secret: 'aaaaaaaaaaaaaaa',
	resave: 'false',
	saveUninitialized: 'false'   // secret: 定義一組自己的私鑰（字串)
}))
// 使用 Passport 
app.use(passport.initialize())
app.use(passport.session())

// 載入 Passport config
require('./config/passport')(passport)


app.use(flash())

app.use((req, res, next) => {
	res.locals.user = req.user
	//res.locals.isAuthenticated = isAuthenticated()
	console.log('res.locals.number', res.locals.number)
	res.locals.warning_msg = req.flash('warning_msg')
	next()
})

//localhost:2150 
app.get('/', (req, res) => {
	res.render('index')
})



app.post('/shortenURL' , (req, res) => {
	//console.log('req.session', req.session)
	//console.log('req', req.body)		
	 let inputURL = req.body.orgURL
	 //let number = req.number
	console.log('inputURL', inputURL)
	//console.log('NUMBER', number)
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
	// //req('warring_msg', [errors][messages][0])

	Urlbycrpt.findOne({
		number: number
	}).then((user, err) => {
		console.log('number in auth', number)
		console.log(' user', user)
		//console.log('number in user', user.number)
		if (err) { return done(err); }

		//驗證是否有相同的number
		if (user) {
			console.log('轉址重複!重新建立位址!')
			req.flash('warning_msg', '轉址重複!重新建立位址!!')
			res.redirect('/')
		}

		if (!user) {
			Authenticated = true
			let bycrptURL = `http://localhost:1250/shortenURL/${number}`
			console.log('bycrptURL', bycrptURL)
			const urlbycrpt = new Urlbycrpt({
				inputURL,
				number,
				bycrptURL
			})
			urlbycrpt
				.save(err => {
					if (err) return console.error(err)
					return res.render('index', { urlShortener: bycrptURL, isAuthenticated: Authenticated })
				})
		 }
		 else{
			req.flash('warning_msg', '請填入網址!')
			res.redirect('/')
		 }
	})
	 
	 
		
	
})

app.get('/shortenURL/:id', (req, res) => {

	Urlbycrpt.findOne( {number : req.params.id} , (err, urlbycrpt) => {
		if (err) return console.error(err)
		//console.log('urlbycrpts', urlbycrpt.inputURL)
		return res.redirect(`http://${urlbycrpt.inputURL}`)
	})
		
})
	

	



app.listen(port, () => {
	console.log(`This server is running on http://localhost:${port}`)
})