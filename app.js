//require related modules used in the proj
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const db = mongoose.connection
const bodyParser = require('body-parser') 
const session = require('express-session')
const ShortenUrl = require('./models/shortenUrl')
const flash = require('connect-flash')
const port = 1250
// 判別開發環境
if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式
	require('dotenv').config()                      // 使用 dotenv 讀取 .env 檔案
}

//set template engine
app.engine('handlebars', exphbs({ defaultLayout:'main'}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/shortenUrl', { useNewUrlParser: true, useCreateIndex: true })

db.on('error', () => {
	console.log('mongodb error!')
})

db.once('open', () => {
	console.log('mongodb connected!')
})

// 使用 express session 
app.use(session({
	secret: 'blackmoon',
	resave: 'false',
	saveUninitialized: 'false',	
}))

app.use(flash())

app.use((req, res, next) => {
	res.locals.warning_msg = req.flash('warning_msg')
	next()
})

//localhost:1250
app.get('/', (req, res) => {
	res.render('index')
})

app.post('/Shorten' , (req, res) => {		
	let inputURL = req.body.orgURL
	let number =""
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	
		for (let i = 0; i < 5; i++) {
			index = Math.floor(Math.random() * letters.length)
			number += letters[index]
		}
		if (!inputURL) {
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
				let shortenURL = `https://pure-waters-66922.herokuapp.com/${number}`
				const shortenUrl = new ShortenUrl({
					inputURL,
					number,
					shortenURL
				})
				shortenUrl
					.save(err => {
						if (err) return console.error(err)
						return res.render('index', { urlShortener: shortenURL,inputURL:`www.${inputURL}`, isAuthenticated: Authenticated })
					})
			}
		})	 
})

app.listen(process.env.PORT || port, () => {
	//console.log(`This server is running on http://localhost:${port}`)
	console.log(`This server is running on http://localhost:${process.env.PORT}`)
})
