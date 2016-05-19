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
    copy: {
      dist: {
        files: [{
            expand: true,
            cwd: 'src/',
            src: ['fonts/*.*','img/*.*'],
            dest: 'dest/'
        }]
      }
    },
    compass: {
        dist: {
            options: {
                sassDir: 'src/scss/',
                cssDir: 'dest/',
                imagesDir: "src/img/",
                generatedImagesDir: "dest/img/s-img/",
                httpGeneratedImagesPath: "img/s-img/"
            }
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

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['copy','concat','compass', 'cssmin', 'uglify']);
  grunt.registerTask('dev', ['copy','concat', 'compass', 'cssmin', 'watch'])
};
