'use strict';
var fs = require('fs');
var path = require('path');
var readPackageJSON = require('read-package-json');
var Parser = require('./parser');
var FileEmitter = require('file-emitter');



function MD(modulePath) {
  if (!(this instanceof MD)) {
    return new MD(modulePath);
  }
  this.modulePath = path.resolve(process.cwd(), modulePath);
  this.parser = new Parser();

  this.rawJSON = null;
  this.npmJSON = null;

  this.npmIgnore = null;
  this.gitIgnore = null;
}
module.exports = MD;


MD.prototype.init = function(callback) {
  var self = this;
  var packageJSON = this.modulePath + '/package.json';

  fs.readFile(packageJSON, function(err, data) {
    if (err) {
      return callback(err);
    }
    self.rawJSON = JSON.parse(data);

    readPackageJSON(packageJSON, null, true, function(err2, data2) {
      if (err2) {
        return callback(err2);
      }
      self.npmJSON = data2;

      callback();
    });
  });
};


MD.prototype.parse = function(callback) {
  var self = this;
  var source = this.modulePath + '/lib';
  var errors = [];

  var files = {};

  var fe = new FileEmitter(source, {
    pattern: /.*\.js$/,
    maxFileSize: 1048576
  });

  fe.on('error', function(err) {
    errors.push(err);
  });

  fe.on('file', function(file) {
    var data = file.data.toString();

    files[file.name] = {
      data: data,
      parsed: self.parser.parse(data)
    };

    console.log('parsed', file.name);
  });

  fe.once('end', function(hadError) {
    if (hadError) {
      return callback(errors.slice(-1), files);
    }
    callback(null, files);
  });
};
