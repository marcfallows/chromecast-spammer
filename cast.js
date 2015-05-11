var castv2Client = require('castv2-client');
var readline = require('readline');
var _ = require('lodash');

var Client = castv2Client.Client;
var YouTubeRedirectApp = require('./lib/senders/youtube-redirect-receiver');
var mdns = require('mdns');

var browser = mdns.createBrowser(mdns.tcp('googlecast'));

var clients = {}, services = {};
var started = false;

var targetDevices = {
	"TV Devices": {
		//youTubeVideoId: 'h1qQ1SKNlgY',
		youTubeVideoId: 'yURRmWtbTbo',
		startTime: 13
	},
	"AA Hollywood 1": {
		youTubeVideoId: '7u6auJ_ezec'
	},
	"AA Hollywood 2": {
		youTubeVideoId: 'GWrCNHG_x1I',
		startTime: 10
	},
	"AA Hollywood 3": {
		youTubeVideoId: 'f0QOifUhfwk',
		startTime: 90
	}
};

browser.on('serviceUp', function(service) {
	services[service.name] = service;
});
browser.on('serviceDown', function(service) {
	delete clients[service.name];
	delete services[service.name];
});

function start(){
	started = true;
	clients = {};
	
	_.each(services, function(service){
		var targetDevice = targetDevices[service.name];
		
		if(!!targetDevice){
			var client = launchYouTube(service.addresses[0], targetDevice);
			clients[service.name] = client;
		};
	});
}

function stop(){
	started = false;
	_.each(clients, function(client){
		!!client.receiver && client.receiver.stop(function(){
			console.log('client stopped');
		});
		client.close();
	});
}

function launchYouTube(host, targetDevice){
	
	var client = new Client();

	client.connect(host, function() {
		console.log('connected to ' + host + ', launching YouTube video ' + targetDevice.youTubeVideoId);

		client.launch(YouTubeRedirectApp, function(err, youTubeApp) {

			youTubeApp.goTo(targetDevice.youTubeVideoId, targetDevice.startTime, function(){
				console.log('requested youTube video ' + targetDevice.youTubeVideoId);
			});
		
		});

    });

	client.on('error', function(err) {
		console.log('Error: %s', err.message);
		client.close();
	});
	
	return client;
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(line){
    started ? stop() : start();
})

browser.start();