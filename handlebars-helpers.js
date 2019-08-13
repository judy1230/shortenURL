const Handlebars = require('handlebars')

Handlebars.registerHelper('if', function (number, options) {
	console.log('numberhandlebars', number)
	if (!number) {
		return options.fn(this);
	 } 
	else {
	 	return options.inverse(this);
	 }
});
