'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compress: {
      main: {
        options: {
          archive: 'graffiome.zip'
        },
        files: [
          {src: ['src/**'], dest: ''},
          {src: ['static/**'], dest: ''},
          {src: ['bower_components/firebase/firebase.js'], dest: ''},
          {src: ['bower_components/angular/angular.min.js'], dest: ''},
          {src: ['bower_components/angular-ui-router/release/angular-ui-router.min.js'], dest: ''},
          {src: ['bower_components/jquery/dist/jquery.js'], dest: ''},
          {src: ['bower_components/CryptoJS/rollups/sha1.js'], dest: ''},
          {src: ['manifest.json'], dest: ''}
        ]
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: false,
        createTag: false,
        push: false,
      }
    }
  });

  // Don't worry about this one - it just works. You'll see when you run `grunt`.
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-bump');

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('deploy', ['bump', 'compress']);
};
