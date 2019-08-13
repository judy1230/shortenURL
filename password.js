function password() {
	let password = ""
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	index = Math.floor(Math.random() * letters.length)

	for (let i=0; i < 6 ;) {
		password += letters[index]
	}

	console.log('password', password)
	return password
}
module.exports = password