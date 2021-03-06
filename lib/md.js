'use strict';
var fs = require('fs');
var path = require('path');
var readPackageJSON = require('read-package-json');
var FileEmitter = require('file-emitter');
var Parser = require('./parser');
var Context = require('./context');



function MD(modulePath) {
  if (!(this instanceof MD)) {
    return new MD(modulePath);
  }
  this.modulePath = path.resolve(process.cwd(), modulePath);
  this.parser = new Parser();

  this.context = new Context();

  this.rawJSON = null;
  this.npmJSON = null;
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
  var source = this.modulePath;
  var errors = [];

  var fe = new FileEmitter(source, {
    buffer: true,
    maxFileSize: 1048576,
    include: ['*.js'],
    exclude: [
      'bin',
      'node_modules',
      '.git',
      'test',
      'coverage',
      'tools'
    ]
  });

  fe.on('error', function(err) {
    errors.push(err);
  });

  fe.on('file', function(file) {
    var intel;
    file.buffer = file.buffer.toString();

    try {
      intel = self.parser.parse(file.buffer);
    } catch (err) {
      errors.push(new Error(err.message + ' (' + file.name + ')'));
    }

    self.context.addFile(file, intel);
  });

  fe.once('end', function() {
    if (errors.length) {
      // TODO: wtf?!
      return callback(errors.slice(-1)[0]);
    }
    callback(null, self.context);
  });
};


MD.prototype.toMarkdown = function() {
  // body...
};
