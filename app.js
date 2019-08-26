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
	res.locals.number = req.number
	console.log('res.locals.number', res.locals.number)
	res.locals.warning_msg = req.flash('warning_msg')
	next()
})

//localhost:2150 
app.get('/', (req, res) => {
	res.render('index')
})



app.post('/shortenURL' ,authenticated, (req, res) => {
	//console.log('req.session', req.session)
			
	 let inputURL = req.body.orgURL
	 let number = 1234
	// let number = ""
	// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	// for (let i = 0; i < 5; i++) {
	// 	index = Math.floor(Math.random() * letters.length)
	// 	number += letters[index]
	// }
	// passport.authenticate('local', {
	// 	successRedirect: '/shortenURL',
	// 	failureRedirect: '/',
	// 	failureFlash: true,
	// })
	// //req('warring_msg', [errors][messages][0])
	 
	 let bycrptURL =	`http://localhost:1250/shortenURL/${number}`
	console.log('bycrptURL', bycrptURL)
	const urlbycrpt = new Urlbycrpt({
		inputURL,
		number, 
		bycrptURL
	})
	urlbycrpt
		.save(err => {
			if (err) return console.error(err)
			return res.render('index')
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