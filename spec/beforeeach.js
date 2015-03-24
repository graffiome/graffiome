var fs = require('fs');
var page;
var beforeLoadFn;
var src = '../src/content-scripts/';
var lib = '../bower_components/';

beforeEach(function() {

  page = require('webpage').create();

  page.onConsoleMessage = function(msg) {
    console.log(msg);
  };

  // listen page.onError to catch assertions
  page.onError = function(msg, trace) {
    var msgStack = [msg];
    if (trace && trace.length) {
      msgStack.push('TRACE:');
      trace.forEach(function(t) {
        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
      });
    }
    // we need try..catch here as mocha throws error that catched by phantom.onError
    try {
      mocha.throwError(msgStack.join('\n'));
    } catch(e) { }
  };

  page.onInitialized = function() {
    page.injectJs(node_modules + 'chai/chai.js');
    page.injectJs(node_modules + 'sinon/pkg/sinon.js');
    page.injectJs(node_modules + 'sinon-chrome/chrome.js');
    page.injectJs(node_modules + 'sinon-chrome/phantom-tweaks.js');

    page.injectJs(lib + 'jquery/dist/jquery.min.js');
    page.injectJs(lib + 'firebase/firebase.js');
    page.injectJs(lib + 'mockfirebase/browser/mockfirebase.js');
    page.injectJs(lib + 'CryptoJS/rollups/sha1.js');
    page.injectJs('data.js');
    page.injectJs(src + 'canvas.js');

    page.evaluate(function() {
      assert = chai.assert;

      // for emulating click
      clickEvent = document.createEvent('MouseEvents');
      clickEvent.initMouseEvent('click', true);
    });
    // call additional function defined in tests
    if (beforeLoadFn) {
      beforeLoadFn();
    }
  };
});

afterEach(function() {
  page.close();
  beforeLoadFn = null;
});