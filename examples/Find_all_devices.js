var nmap = require('nmap-js').nmap();

// Find all network devices 
nmap.findActiveHosts(function(data, net){
	console.log("All network devices has been found");
	console.log('My network is: ' + net);
	console.log("Devices:");
    console.log(data); 
});

