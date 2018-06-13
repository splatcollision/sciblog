
const fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp')

var _config = {
	path: path.join(__dirname, 'static'),
	cssin: path.join(__dirname, 'public', 'styles', 'site.css'),
	cssout: path.join(__dirname, 'static', 'styles', 'site.css'),
}

function cacheBodyToStatic(path, body) {
	console.log("cacheBodyToStatic: path", path);
	// fs.createReadStream(_config.cssin).pipe(fs.createWriteStream(_config.cssout));

	var filename = "index.html";
	// if (path === "/") filename = "index.html"
    if (path.includes('feed.xml')) {
        filename = "feed.xml";
        path = path.replace('feed.xml', '');
    } else {
        if (path[path.length - 1] !== "/") path += "/";    
    }
	

    
    // path is relative fs path
    // send raw file contents to be piped to disk and then commit...
    // used for index.html cache from site root for example..
    var fspath = _config.path + path;
    console.log(fspath + filename);

    mkdirp(fspath, function(err){
        if (err) return console.warn(err);
        fs.writeFile(fspath + filename, body, 'utf-8', function(err, ok){
            console.log('cachePathBody file write done', path, filename);
            // if (commit) 
            

        })
    });
}
module.exports = {
	cache: cacheBodyToStatic
}