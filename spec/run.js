var node_modules = '../node_modules/';
var src = '../src/content-scripts/';
var lib = '../bower_components/';

phantom.injectJs(node_modules + 'mocha/mocha.js');
phantom.injectJs(node_modules + 'chai/chai.js');
phantom.injectJs(node_modules + 'sinon-chrome/phantom-tweaks.js');

phantom.injectJs(src + 'canvas.js');
mocha.setup({ui: 'bdd', reporter: 'spec'});
phantom.injectJs('data.js');
phantom.injectJs('beforeeach.js');
phantom.injectJs('canvas.test.js');

mocha.run(function(failures) {
  // setTimeout is needed to supress "Unsafe JavaScript attempt to access..."
  // see https://github.com/ariya/phantomjs/issues/12697
  setTimeout(function() {
    phantom.exit(failures);
  }, 0);
});
