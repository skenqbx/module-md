#!/usr/bin/env node
'use strict';
var fs = require('fs');
var moduleMD = require('../');

var modulePath = process.argv[2];

if (!modulePath) {
  console.log('Missing module path');
  /*eslint-disable no-process-exit */
  process.exit(1);
  /*eslint-enable no-process-exit */
}

var md = moduleMD(modulePath);

md.init(function(err) {
  if (err) {
    console.log(err.message);
    /*eslint-disable no-process-exit */
    process.exit(1);
    /*eslint-enable no-process-exit */
  }

  md.parse(function(err2, context) {
    if (err2) {
      console.log(err2.message);
      /*eslint-disable no-process-exit */
      process.exit(1);
      /*eslint-enable no-process-exit */
    }
    var parsed = JSON.stringify(context.files, null, 2);

    fs.writeFileSync(md.modulePath + '/module-md.json', parsed);
  });
});
