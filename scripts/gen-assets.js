var fs = require('fs');

var files = fs.readdirSync('./test/assets/');

for (var i = 0; i < files.length; i ++) {
  var f = files[i];
  if (f.lastIndexOf('.pdf') != 5)
    continue;

  var c = fs.readFileSync('./test/assets/' + f);
  var json = JSON.stringify(c);

  var contents = 'module.exports = ' + json;
  fs.writeFileSync('./test/assets/' + f + '.js', contents);
}
