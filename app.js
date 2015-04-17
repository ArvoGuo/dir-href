var config   = require('./config');
var path     = require('path');
var fs       = require('fs');
var dir      = process.argv[2] || process.cwd();
var host     = config.host;
var template = config.temp;
var html     = '';

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
  if (files.indexOf('index.html') > 0) {
    files_.push((path + '/index.html').replace(dir,host));
    return files_;
  }
  for (var i in files) {
    if (!files.hasOwnProperty(i)) {
      continue;
    }
    var _path = path + '/' + files[i];
    if (fs.statSync(_path).isDirectory()) {
      getFiles(_path,files_);
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
    h += template.replace(/{data}/g, item);
  });
  return h;
})();

fs.writeFileSync('catalogue.html', html);




