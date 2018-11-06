const fs = require('fs');
const path = require('path');

module.exports.downloadZip = function(uri, dirname, outFile, cb) {
	mkdir(dirname);
	
	let fileName = path.resolve(dirname, outFile);

	download(uri, fileName, () => {
		unzip(dirname, fileName, cb);
	});
};

module.exports.exec = function(command) {
	const { execSync } = require('child_process');
	
	try {
		execSync(command, {stdio: [0, 1, 2]});
	} catch(err) {
		console.log(err.toString());
	}
}

function unzip(dirname, fileName, cb) {
	console.log(`unzipping ${fileName}...`);
	const admZip = require('adm-zip');
	let zip = new admZip(fileName);
	zip.extractAllTo(dirname);
	console.log(`unzipping ${fileName} completed.`);
	if (cb) cb();
}

function mkdir(dir){
	if (fs.existsSync(dir)){
		return;
	}

	try{
		fs.mkdirSync(dir)
	} catch(err){
		if(err.code == 'ENOENT'){
			mkdir(path.dirname(dir)) //create parent dir
			mkdir(dir) //create dir
		}
	}
}

function download(url, dest, callback) {
	if (fs.existsSync(dest)) {
		console.log(`File exists ${dest}, skipping download`);
		callback();
		return;
	}

	console.log(`Downloading ${url}...`);

	const lib = url.startsWith('https') ? require('https') : require('http');
	
	var file = fs.createWriteStream(dest);
	
	lib.get(url, function(response) {
		response.pipe(file);
	});

	file.on('finish', function() {
		console.log(`Download ${url} completed.`);
		file.close(callback);
	});
}
