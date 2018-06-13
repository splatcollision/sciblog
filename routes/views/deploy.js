// deploy.js

// require logged in user

// walk the whole site

// app.get('/', routes.views.blog);
// app.get('/about/', routes.views.about);
// app.get('/rss/feed.xml')
// app.get('/:category?', routes.views.blog);
// app.get('/post/:post', routes.views.post);

// then ftp-deploy

var keystone = require('keystone');
var async = require('async');

var staticr = keystone.get('staticr');
var ftpr = keystone.get('ftpr');
var request = require('request');

const fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp');

var dir = keystone.get('dirname');
var _config = {
	path: path.join(dir, 'static'),
	cssin: path.join(dir, 'public', 'styles', 'site.css'),
	cssout: path.join(dir, 'static', 'styles', 'site.css'),
}

var pages = {
	index: "/",
	about: "/about/",
	feed: "/rss/feed.xml"
}

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	// console.log("req", req);
	// Init locals
	locals.section = 'deploy';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		posts: [],
		categories: [],
	};

	
	async.auto({
		posts: function(next) {
			var postsQ = keystone.list('Post').model.find().where({state: 'published'})
						.sort('-publishedDate')
						.populate('author categories');

			postsQ.exec(function(err, posts){
				locals.data.posts = posts;
				next(err, posts);
			})	
		},
		categories: function(next) {
			keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {
				locals.categories = results;
				next(err, results);
			});
		}
	}, function(err, results){
		console.log("err", err);
		console.log("results", results);
		// results.posts and categories
		// prepare secondary async series
		var baseUrl = 'http://' + keystone.get('host') + ':' + keystone.get('port');
		var requests = [];
		for (var page in pages) {
			requests.push(baseUrl + pages[page]);
		}
		results.posts.forEach(function(post){
			// post + post.slug 
			requests.push(baseUrl + "/post/" + post.slug);
		})
		results.categories.forEach(function(cat){
			requests.push(baseUrl + "/" + cat.key + "/");
		})
		console.log("requests", requests.length);
		async.eachSeries(requests, function(path, next){
			console.log('cache request:', path);
			request(path, next);
		}, function(err, renders){
			console.log('done caching:', err);
			fs.createReadStream(_config.cssin).pipe(fs.createWriteStream(_config.cssout));

			locals.message = {
				posts: results.posts.length,
				categories: results.categories.length,
				totals: requests.length
			}

			ftpr(_config.path, function(ftperr, ftpok){
				locals.message.ftp = ftperr || ftpok;
				view.render('deploy');
			})
			
		})
		

	})

		
	

	

}