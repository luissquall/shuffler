#!/usr/bin/env node

var Collections = require('./lib/collections'),
	optimist = require('optimist'),
	bl = require('bl'),
	fs = require('fs');

argv = optimist
	.usage('Shuffle a list. Usage $0 [file]')
	.options({
		h: {
			alias: 'help',
			describe: 'Display this help and exit',
			boolean: true
		},
		n: {
			describe: 'Print only n items'
		}
	})
	.argv;

if (argv.h) {
	optimist.showHelp();
	process.exit();
}

if (argv._.length) {
	var filename = argv._[0],
		rs = fs.createReadStream(filename);

	rs.pipe(bl(function(err, data) {
		var list,
			n = argv.n;

		if (err)
			return console.log(err);

		list = data.toString().split('\n');
		Collections.shuffle(list);
		list = (typeof n == 'number' && n <= list.length) ? list.splice(0, n) : list;

		list.forEach(function(el) {
			console.log(el);
		});
	}));
	rs.on('error', function(err) {
		console.log("Error %s", err.code);
	});
}