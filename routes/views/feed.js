// feed.js

// generate an xml feed of posts. 
// let the staticr cache it

var keystone = require('keystone');
var async = require('async');

var staticr = keystone.get('staticr');

var RSS = require('rss');
 


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
		categories: []
	};

	var feed = new RSS({
		title: "Splat Collision Web Industries",
		description: "description",
		feed_url: "http://splatcollision.com/rss/feed.xml",
		site_url: "http://splatcollision.com",
		copyright: "2018 Kevin Haggerty, Splat Collision Web Industries",
		managingEditor: "Kevin Haggerty",
		language: "en",
		pubDate: new Date()
	});
	
	var postsQ = keystone.list('Post').model.find().where({state: 'published'})
					.sort('-publishedDate')
					.populate('author categories');

	postsQ.exec(function(err, posts){
		locals.data.posts = posts;
		posts.forEach(function(post){
			feed.item({
				title:  post.title,
			    description: post.content.full,
			    url: 'http://splatcollision.com/post/' + post.slug,
			    categories: post.categories.map(function(c){ return c.name; }), // optional - array of item categories
			    date: post.publishedDate
			});
		})

		var xml = feed.xml({indent: true});
		console.log("req.originalUrl", req.originalUrl);
		staticr.cache(req.originalUrl, xml);
		res.set('Content-Type', 'application/rss+xml');
		res.send(xml);

		// next(err, posts);
	})


}