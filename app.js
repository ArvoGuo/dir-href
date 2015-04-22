#!/usr/bin/env node
var config        = require('./temp/config.js');
var templatePath  = __dirname + '/temp/template.html';
var path          = require('path');
var readlineSync  = require('readline-sync');
var fs            = require('fs');
var dir           = process.argv[2] || process.cwd();
var host          = config.host;
var template      = config.temp;
var html          = '';

/**===================================**/
/**============ prototype ============**/
/**===================================**/
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

/**===================================**/
/**============= Function ============**/
/**===================================**/

function ignoreFiles(files) {
  files.remove('.DS_Store').remove('.git').remove('node_modules').remove('bower_compontents').remove('lib');
}

function getFiles(path, files_) {
  files_    = files_ || [];
  var files = fs.readdirSync(path);
  ignoreFiles(files);

  for (var i in files) {
    if (!files.hasOwnProperty(i)) {
      continue;
    }
    var _path = path + '/' + files[i];
    if (fs.statSync(_path).isDirectory()) {
      getFiles(_path,files_);
    } else {
      if (files[i].match('.html')) {
        files_.push((path + '/' + files[i]).replace(dir,host));
      }
    }

  }
  return files_;
}

/**===================================**/
/**=============== Main ==============**/
/**===================================**/
html = (function() {
  var h = '';
  getFiles(dir).forEach(function(item){
    var urlName = readlineSync.question('href ( ' + item + ' ) name is :');
    h += template.replace(/{url}/g, item).replace(/{urlName}/g,urlName);
  });
  return h;
})();

html = fs.readFileSync(templatePath, {encoding: 'utf8'}).replace(/{{content}}/g, html);

fs.writeFileSync('catalogue.html', html);




