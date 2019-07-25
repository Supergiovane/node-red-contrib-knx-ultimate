/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2017 Elias Karakoulakis
*/

var knx = require('knx');

if (process.argv.length < 3) {
	console.log('usage: %s <ga> <optional: status_ga> to toggle a light on & off',
		process.argv[1]);
	process.exit(1);
}
var connection = knx.Connection({
	debug: true,
	handlers: {
		connected: function() {
			console.log('----------');
			console.log('Connected!');
			console.log('----------');
			// define a datapoint:
			var dp = new knx.Datapoint({
				ga: process.argv[2],
				dpt: 'DPT1.001'
			}, connection);
			if (process.argv[3]) {
				var status_ga = new knx.Datapoint({
					ga: process.argv[3],
					dpt: 'DPT1.001'
				}, connection);
				status_ga.on('change', function(oldvalue, newvalue) {
					console.log("**** Light %s changed from: %j to: %j",
						process.argv[2], oldvalue, newvalue);
				});
			}
			// Now send off a couple of requests:
			console.log('\n\n\n');
			console.log('PRESS ANY KEY TO TOGGLE %s AND "q" TO QUIT.', process.argv[2]);
			console.log('\n\n\n');
			var dpVal = false;
			process.stdin.setRawMode(true);
			process.stdin.resume();
			process.stdin.on('data', (data) => {
				console.log(JSON.stringify(data));
				if (data[0] === 113) {
					process.exit(0);
					return;
				}
				dpVal = !dpVal;
				console.log("Sending " + dpVal);
				dp.write(dpVal);
			});
		}
	}
});
