const fs = require('fs');
const path = require('path');

module.exports.downloadZip = function (uri, dirname, outFile, cb) {
  mkdir(dirname);

  let fileName = path.resolve(dirname, outFile);

  download(uri, fileName, () => {
    unzip(dirname, fileName, cb);
  });
};

module.exports.exec = function (command, env) {
  const { execSync } = require('child_process');

  try {
    execSync(command, { env: env, stdio: [0, 1, 2] });
  } catch (err) {
    console.error(err.toString());
  }
}

function unzip(dirname, fileName, cb) {
  if (fs.existsSync(fileName)) {
    console.log(`unzipping ${fileName}...`);
    const admZip = require('adm-zip');
    let zip = new admZip(fileName);
    zip.extractAllTo(dirname);
    console.log(`unzipping ${fileName} completed.`);
  }

  if (cb) cb();
}

function mkdir(dir) {
  if (fs.existsSync(dir)) {
    return;
  }

  try {
    fs.mkdirSync(dir)
  } catch (err) {
    if (err.code == 'ENOENT') {
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

  let file = fs.createWriteStream(dest);

  const sigIntListener = () => {
    console.warn(`Caught interrupt signal while downloading dependencies, cleaning up`);
    onDownloadComplete(true);
    process.exit();
  };

  process.on('SIGINT', sigIntListener);

  const onDownloadComplete = (isError) => {
    if (isError) {
      console.log(`Deleting ${file.path}...`);
      file.close(callback);
      fs.unlinkSync(file.path);
    } else {
      file.close(callback);
    }

    process.removeAllListeners('SIGINT', sigIntListener)
  };

  lib
    .get(url, response => {
      const { statusCode } = response;

      if (statusCode !== 200) {
        console.error(`Error while downloading ${url}, Status Code: ${statusCode}`);
        onDownloadComplete(true);
      } else {
        response.pipe(file);
      }
    })
    .on('end', err => {
      onDownloadComplete(err ? true : false);
    });

  file.on('finish', () => {
    onDownloadComplete(false, callback);
  });
}
