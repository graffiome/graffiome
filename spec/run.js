var node_modules = '../node_modules/';
phantom.injectJs(node_modules + 'mocha/mocha.js');
phantom.injectJs(node_modules + 'chai/chai.js');
phantom.injectJs(node_modules + 'sinon-chrome/phantom-tweaks.js');
mocha.setup({ui: 'bdd', reporter: 'spec'});
phantom.injectJs('beforeeach.js');
phantom.injectJs('canvas.test.js');
mocha.run(function(failures) {
  // setTimeout is needed to supress "Unsafe JavaScript attempt to access..."
  // see https://github.com/ariya/phantomjs/issues/12697
  setTimeout(function() {
    phantom.exit(failures);
  }, 0);
});