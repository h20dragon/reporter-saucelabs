'use strict';


var SauceLabs = require("saucelabs");
var util = require('util');

function myReporter(opts) {
  var options = opts || { debug: false, verbose: false } ;
  var debug = options.debug;
  var specResults = [];
  var masterResults = {};
  var totalFailed = 0;
  var totalPassed = 0;

  this.jasmineStarted = function(suiteInfo) {
    if (debug) { console.log("[jasmineStarted]: " + util.inspect(suiteInfo)); }
  };

  this.suiteDone = function(suite) {
    if (debug) { console.log("[suiteDone]: Suite: " + suite.id + " : " + suite.description + " was " + suite.status); }

    if (suite.status !== 'finished' && debug) {
      console.log("[suiteDone]: total failed : " + suite.failedExpectations.length);
      console.log("[suiteDone]: total passed : " + suite.passedExpectations.length);
    }

    suite.specs = specResults;
    masterResults[suite.id] = suite;
    specResults = [];
  };

  this.specDone = function(spec) {
     if (debug) {
       console.log("[specDone]: " + util.inspect(spec));
       console.log("[specDone]: " + spec.description + ' was ' + spec.status);
       console.log("[specDone]: total failed : " + spec.failedExpectations.length);
       console.log("[specDone]: total passed : " + spec.passedExpectations.length);
     }

     totalFailed = totalFailed + spec.failedExpectations.length;
     totalPassed = totalPassed + spec.passedExpectations.length;
     specResults.push(spec);
  };

  this.update = function(opt) {
    options.sessionid = opt.session;
  };

  this.jasmineDone = function() {
    var name = options.hasOwnProperty('name') ? options.name : 'TBD';
    var finalResult = options.hasOwnProperty('status') ? options.status :  (totalFailed === 0);
    var id = options.hasOwnProperty('sessionid') ? options.sessionid.getId() : browser.session.getId();
    var cfg = { username: process.env.SAUCE_USERNAME, password: process.env.SAUCE_ACCESS_KEY };

    if (options.hasOwnProperty('proxy')) {
      cfg.proxy = options.proxy;
    }

    if (options.verbose) {
      console.log("[jasmineDone => " + util.inspect(masterResults));
      console.log("[jasmineDone]: sessionId  : " + id);
      console.log("[jasmineDone]: totalFailed: " + totalFailed);
      console.log("[jasmineDone]: totalPassed: " + totalPassed);
      console.log("[jasmineDone]: Final = " + finalResult);
    }


    console.log("[reporter-saucelabs]: update Sauce run " + name + "  with session " + id + " with status " + finalResult);

    var sauce = new SauceLabs(cfg);
    sauce.updateJob(id, {
       name: name, //process.env.BUILD_TAG,
       passed: finalResult
    }, function() { console.log("sauce.updateJob() - failed tests."); } );
  };

};

module.exports = myReporter;
