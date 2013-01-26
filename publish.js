#!/usr/bin/env node
// publish.js -- publish website to S3

var credentials = require('./credentials.json');

var fs = require('fs');
var mime = require('mime');
var path = require('path');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var S3 = awssum.load('amazon/s3').S3;

var s3 = new S3({
    'accessKeyId' : credentials.aws.key,
    'secretAccessKey' : credentials.aws.secret,
    'region' : amazon.US_EAST_1
});

var bucket = 'martinepaper.com';

var ignore_dirs = ['node_modules', '.git', '.gitignore', '.DS_Store'];

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      if(ignore_dirs.indexOf(file) >= 0) {
      	console.log('ignoring ' + file);
        if (!--pending) done(null, results);
      	return;
      }
      file = path.join(dir, file); // dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('./', function(err, files) {
	publishNextFile(files);
});

function publishNextFile(files) {

	if(files.length === 0) {
		console.log('SUCCESS!');
		return;
	}

	var file = files.pop();
	fs.readFile(file, function(err, data) {
		if (err) {
			console.log('Error reading ' + file, err);
			console.log('STOPPING WITH ERROR');
			return;
		};
		var s3Options = {
			BucketName: bucket,
			ObjectName: file,
			ContentLength: data.length,
			ContentType: mime.lookup(file),
			Body: data
		};

		s3.PutObject(s3Options, function(err, data) {
			if (err) {
				console.log('Error putting file to s3: ' + file, err);
				console.log('STOPPING WITH ERROR');
				return;
			}
			console.log('Published ' + file + ' (' + s3Options.ContentLength + ' bytes, ' + s3Options.ContentType + ')');
			publishNextFile(files);
		});
	});
}

