// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
var mongostr = process.env.MONGODB_URI_LOCAL;

if (process.env.NODE_ENV === 'production') mongostr = process.env.MONGODB_URI;

console.log("mongostr", mongostr);

keystone.init({
	'name': 'Splat Collision Industries',
	'brand': 'Splat Collision Industries',
	'mongo': mongostr,
	'mongo options': {
		server: {
		    socketOptions: {
		    	socketTimeoutMS: 0,
				connectionTimeout: 0
		    }
		}
	},
	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'auto update': true,
	'session': true,
	'session store': "mongo",
	'auth': true,
	'user model': 'User',
});

keystone.set('dirname', __dirname);
keystone.set('staticr', require('./static'));
keystone.set('ftpr', require('./lib/ftpr'));
// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server



keystone.start();
