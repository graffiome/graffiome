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
          {src: ['path/*'], dest: 'internal_folder/', filter: 'isFile'}, // includes files in path
          {src: ['path/**'], dest: 'internal_folder2/'}, // includes files in path and its subdirs
          {expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
          {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
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
