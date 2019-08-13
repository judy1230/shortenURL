function urlShortener(URL) {
	const bcrypt = require('bcryptjs')
	const Urlbycrpt = require('./models/urlbycrpt')
	let inputURL = URL
	let bycrptURL = 1234
	const shortenURL = new Urlbycrpt({
		inputURL,
		bycrptURL
	})

	// let hash = bcrypt.hashSync('bacon', 5)
	// console.log('hash', hash)
	// shortenURL
	// 			.save()
	//     	.then(hash=> {
	// 				return hash
	// 			})
	// 			.catch(err => console.log(err))
		
	bcrypt.genSalt(1, (err, salt) =>
		bcrypt.hash(shortenURL.bycrptURL, salt, (err, hash) => {
			if (err) throw err
			shortenURL.bycrptURL = hash
			console.log('shortenURL.bycrptURL',shortenURL.bycrptURL)
			shortenURL
				.save()
				.then(user => {
					//console.log('shortenURL', shortenURL)
					return shortenURL.bycrptURL
				})
				.catch(err => console.log(err))
		})
	)

}

module.exports = urlShortener