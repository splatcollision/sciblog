// ftpr.js

// var ftpd = require('ftp-deploy');
var FtpDeploy = require('ftp-deploy');

module.exports = function(srcdir, done) {
	console.log('ftpr go', srcdir, process.env.FTP_DIR); // HOST USER PASS

	
	var ftpDeploy = new FtpDeploy();

	var config = {
	    user: process.env.FTP_USER,                   // NOTE that this was username in 1.x 
	    password: process.env.FTP_PASS,           // optional, prompted if none given
	    host: process.env.FTP_HOST,
	    port: 21,
	    localRoot: srcdir,
	    remoteRoot: process.env.FTP_DIR,
	    include: ['*', '**/*'],      // this would upload everything except dot files
	    exclude: []
	    // include: ['*.php', 'dist/*'],
	    // exclude: ['dist/**/*.map'],     // e.g. exclude sourcemaps
	    // deleteRoot: true                // delete existing files at destination before uploading
	}
	console.log("config", config);

	ftpDeploy.on('uploading', function(data) {
	    console.log("uploading", data);
	});
	ftpDeploy.on('uploaded', function(data) {
	    console.log("uploaded:", data);
	});

	ftpDeploy.on('upload-error', function (data) {
	    console.log('err:', data); // data will also include filename, relativePath, and other goodies
	});

	ftpDeploy.deploy(config, function(err) {
		console.log("ftpDeploy err", err);
	    done(err, err || "All files deployed.");
	});


	// done(null, "files sent ok temp");
}