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
var MyReporter = require('../lib/reporter');

exports.config = {
  directConnect: false,
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

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
    jasmine.getEnv().addReporter(new MyReporter({ name: process.env.BUILD_TAG }));
  },

  jasmineNodeOpts: {
    isVerbose: true,
    defaultTimeoutInterval: 60000
  }
};
```


