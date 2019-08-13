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
//require('./handlebars-helpers')



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
	//res.locals.inputURL = req.body.orgURL
	//res.locals.isAuthenticated = req.isAuthenticated()
	res.locals.warning_msg = req.flash('warning_msg')
	next()
})

//localhost:2150 
app.get('/', (req, res) => {
	res.render('index')
})



app.post('/shortenURL', authenticated, (req, res, next) => {
//console.log('req.body', req.body)	
  
	let inputURL = req.body.orgURL
	let number = ""
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
		for (let i = 0; i < 5; i++) {
		index = Math.floor(Math.random() * letters.length)
	  number += letters[index]
	}
	

	let bycrptURL =	`http://localhost:1250/${number}`

	const shortenURL = new Urlbycrpt({
		inputURL,
		number
	})
			shortenURL
				.save()
				.then(user => {
					//console.log('shortenURL', shortenURL)
					res.render('index', { urlShortener: bycrptURL})
				})
				.catch(err => console.log(err))
		
	
})

app.get('/:id', (req, res) => {

	Urlbycrpt.findOne( {number : req.params.id} , (err, urlbycrpt) => {
		if (err) return console.error(err)
		//console.log('urlbycrpts', urlbycrpt.inputURL)
		return res.redirect(`http://${urlbycrpt.inputURL}`)
	})
		
})
	

	



app.listen(port, () => {
	console.log(`This server is running on http://localhost:${port}`)
})