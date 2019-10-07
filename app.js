//require related modules used in the proj
const express = require('express')
const app = express()
const port = 1250
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const db = mongoose.connection
const bodyParser = require('body-parser') 
const session = require('express-session')
const ShortenUrl = require('./models/shortenUrl')
const flash = require('connect-flash')



//set template engine
app.engine('handlebars', exphbs({ defaultLayout:'main'}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost/shortenUrl', { useNewUrlParser: true, useCreateIndex: true })

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

app.use(flash())

app.use((req, res, next) => {
	res.locals.warning_msg = req.flash('warning_msg')
	next()
})

//localhost:2150 
app.get('/', (req, res) => {
	res.render('index')
})

app.post('/shortenURL' , (req, res) => {		
	let inputURL = req.body.orgURL
	let number =""
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	for (let i = 0; i < 5; i++) {
		index = Math.floor(Math.random() * letters.length)
		number += letters[index]
	}
	if (!inputURL){
		req.flash('warning_msg', '請輸入網址!')
		return res.redirect('/') 
	}
	ShortenUrl.findOne({
		number: number
	}).then((url, err) => {
		if (err) { return done(err); }
		//驗證是否有相同的number
		if (url) {
			console.log('轉址重複!重新建立位址!')
			req.flash('warning_msg', '轉址重複!請重新輸入!!')
			//redirect to localhost:port/ 重新取得number or 再產生一組number
			return res.redirect('/')
		}
		if (!url) {
			Authenticated = true
			let shortenURL = `http://localhost:1250/shortenURL/${number}`
			const shortenUrl = new ShortenUrl({
				inputURL,
				number,
				shortenURL
			})
			shortenUrl
				.save(err => {
					if (err) return console.error(err)
					return res.render('index', { urlShortener: shortenURL, isAuthenticated: Authenticated })
				})
		 }
		 else{
			req.flash('warning_msg', '請填入網址!')
			res.redirect('/')
		 }
	})	 
})

app.get('/shortenURL/:id', (req, res) => {
	ShortenUrl.findOne( {number : req.params.id} , (err, shortenUrL) => {
		if (err) return console.error(err)
		return res.redirect(`http://${shortenUrL.inputURL}`)
	})
		
})

app.listen(process.env.Port || port, () => {
	console.log(`This server is running on http://localhost:${port}`)
})