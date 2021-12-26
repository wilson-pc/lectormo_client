export function makeDir(dir, newDir) {
  console.log("entrando a mker", dir, newDir);
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      dir,
      directoryEntry => {
        directoryEntry.getDirectory(
          newDir,
          { create: true, exclusive: false },
          suss => {
            console.log(suss);
            resolve(suss);
          },
          error => {
            console.log(error);
            reject(error);
          }
        );
      },
      err => {
        console.log(err);
        reject(err);
      }
    );
  });
}

export function checkFile(dir) {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      dir,

      () => {
        resolve(true);
      },
      () => {
        resolve(false);
      }
    );
  });
}

export function dowloadFile(url, folder, link) {
  return new Promise((resolve, reject) => {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);

    fileTransfer.download(
      uri,
      folder,
      entry => {
        console.log("download complete: " + entry.toURL());
        resolve(entry);
      },
      error => {
        reject(error);
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
      },
      false,
      { headers: { referer: link } }
    );
  });
}

export function getFileContentAsBase64(path) {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(path, gotFile, fail);

    function fail(e) {
      reject(e);
    }

    function gotFile(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
          var content = this.result;
          resolve(content);
        };
        // The most important point, use the readAsDatURL Method from the file plugin
        reader.readAsDataURL(file);
      });
    }
  });
}

export function saveFile(fileDir, fileName, blob) {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      fileDir,
      dirEntry => {
        // createFile(dirEntry, fileName, blob);
        dirEntry.getFile(
          fileName,
          { create: true, exclusive: false },
          fileEntry => {
            fileEntry.createWriter(fileWriter => {
              fileWriter.onwriteend = function() {
                resolve(true);
              };

              fileWriter.onerror = function(error) {
                reject(error);
              };
              fileWriter.write(blob);
            });
          },
          error => {
            reject(error);
          }
        );
      },
      error => {
        reject(error);
      }
    );
  });
}
