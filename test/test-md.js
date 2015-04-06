'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var moduleMD = require('../');


suite('MD', function() {
  var md;

  suiteSetup(function() {
    md = moduleMD(common.root);
  });


  test('init', function(done) {
    md.init(function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(md.rawJSON.name, md.npmJSON.name);
      assert.strictEqual(md.rawJSON.version, md.npmJSON.version);
      done();
    });
  });


  test('parse', function(done) {
    md.parse(function(err) {
      done(err);
    });
  });
});
