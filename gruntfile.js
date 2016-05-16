module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        files: [{
          src: ['src/js/libs/*.js','src/js/plugins/*.js'],
          dest: 'dest/<%= pkg.name %>.js'
        }]
      }
    },
    sass: {
      dist: {
        files: [{
          src: ['src/scss/<%= pkg.name %>.scss'],
          dest: 'dest/<%= pkg.name %>.css',
        }]
      }
    },
    cssmin: {
      dist: {
        files: [{
          src: ['dest/<%= pkg.name %>.css'],
          dest: 'dest/<%= pkg.name %>.min.css'
        }]
      }
    },
    uglify: {
      dist: {
        files: [{
          src: ['dest/<%= pkg.name %>.js'],
          dest: 'dest/<%= pkg.name %>.min.js'
        }]
      }
    },
    watch: {
      script:{
        files: ['src/js/**/*.js'],
        tasks: ['concat:dist']
      },
      css: {
        files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
        tasks: ['sass:dist']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['concat', 'sass', 'cssmin', 'uglify']);
  grunt.registerTask('dev', ['concat', 'sass', 'cssmin', 'watch'])
};
