# reporter-saucelabs
Saucelabs reporter for jasmine tests.


## How-to

1. Install

npm install --save reporter-saucelabs


1. Ensure your SauceLabs environment variables are set (export).

* export SAUCE_USERNAME=<YOUR SAUCE USERNAME>
* export SAUCE_ACCESS_KEY=<YOUR ACCESS KEY>

1. Update your Jasmine config file.

```
var SauceReporter = require('reporter-saucelabs');

exports.config = {
  directConnect: false,

  sauceProxy: 'http://localhost:4445',
  seleniumAddress: 'http://localhost:4445/wd/hub',

  capabilities: {
    maxDuration: 3600,
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '58.0',
    screenResolution: "1440x900",
    name: process.env.BUILD_TAG + '.chrome58_Win10',
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    idleTimeout: 180,
    tunnelIdentifier: process.env.SAUCE_TUNNEL_ID
  },

  chromeOnly: true,
  baseUrl: 'http://localhost:3000/',
  specs: ['spec.js'],
  framework: 'jasmine2',
  getPageTimeout: 60000,
  allScriptsTimeout: 60000,

  onPrepare: function onPrepare() {
    var sauceReporter = new SauceReporter( { name:  process.env.BUILD_TAG,
                                             proxy: "<YOUR PROXY>" });
    jasmine.getEnv().addReporter(sauceReporter);

    browser.getSession().then(function(session) {
      sauceReporter.update( { session: session } );
    });

  },

  jasmineNodeOpts: {
    isVerbose: true,
    defaultTimeoutInterval: 60000
  }
};
```


