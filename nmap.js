var sys = require('sys');
var exec = require('child_process').exec;
var os = require('os');

function nmap () {
	if (arguments.callee._singletonInstance){
 		return arguments.callee._singletonInstance;
	}
 	arguments.callee._singletonInstance = this;

 	var child;
 	var net = "";

 	if(process.platform === 'linux' || process.platform === 'darwin'){
 		console.log(process.platform);
 		var networkInterfaces = os.networkInterfaces();

 		if(networkInterfaces.eth0 !== undefined){
 			if(networkInterfaces.eth0.length > 0){
	 			net = networkInterfaces.eth0[0].address;
				net = net.slice(0, net.lastIndexOf('.')) + '.0/24';
			}
 		}
	}

	//Now shows name if lookup is possible and mac / ip-address.
	this.findActiveHosts = function(callback) {
		if(process.platform === 'linux' || process.platform === 'darwin'){
			if(net != ""){
				var str = "sudo nmap --system-dns -sn " + net + " | sed '2d' | head -n -1 | sed '/Host is up/d'"
				child = exec(str, function (error, stdout, stderr) {
					if (error !== null) {
						console.log('exec error: ' + error);
				    }
					else {
						var devices = [];
						var mac = [];
						var tmpArr = stdout.split("\n");
						for (x in tmpArr) {
							if(tmpArr[x].indexOf('Nmap') !== -1) {
								tmpArr[x] = tmpArr[x].substring(21);
								if(tmpArr[x].indexOf('(') === -1) {
									tmpArr[x] = 'unknown ' + tmpArr[x];
								}
								tmpArr[x] = tmpArr[x].replace("(","");
								tmpArr[x] = tmpArr[x].replace(")","");
								var tmpSplit = tmpArr[x].split(" ");
								var tmpJson = {
									"name":	tmpSplit[0],
							        "ip": tmpSplit[1],
								}
								devices[x] = tmpJson;					
			                    // If no mac in nmap output for host, fill in Unknown.
							    if(tmpArr[x++].indexOf('MAC') === -1) {
			                        mac[x] = "Unknown";
			                    }
							}
							if(tmpArr[x].indexOf('MAC') !== -1) {
								tmpArr[x] = tmpArr[x].substring(13);
								tmpArr[x] = tmpArr[x].replace("(","");
								tmpArr[x] = tmpArr[x].replace(")","");
								mac[x] = tmpArr[x];
							}
						}
						devices = devices.filter(function(n){return n}); //Removes all empty elements
						mac = mac.filter(function(n){return n}); //Removes all empty elements
						for (x in devices) {
							devices[x].mac = mac[x];
						}
						callback(devices, net);
					}
				
				});
			}else{
				callback([], net);
			}
		}else{
			callback(null, null);
		}
	}

}

 
nmap();
exports.nmap = nmap;
