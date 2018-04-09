const config = require('./config');
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'public/index.html': 'public/index.html',
                    'public/demo1.html': 'public/demo1.html'
                }
            }
        },
        sass: {
            options: {
                outputStyle: 'expanded'
            },
            dist: {
                files: [{
                    'public/dist/src/cui.min.css': 'src/scss/cui.scss',
                    'public/dist/src/visual/src/v-1.min.css': 'src/visual/src/v-1.scss'
                }]
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                files: [{
                    src: ['src/js/plugins/*.js'],
                    dest: 'public/dist/src/<%= pkg.name %>.min.js'
                }, {
                    src: ['src/js/libs/*.js'],
                    dest: 'public/dist/src/<%= pkg.name %>.lib.min.js'
                }]
            }
        },
        copy: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['img/*.*', 'img/pin/*.*', 'fonts/*.*', 'doc/src/*.*','demo1/src/*.*','visual/src/*.*'],
                    dest: 'public/dist/src/'
                }, {
                    expand: true,
                    cwd: '',
                    src: ['favicon.ico','sw.js'],
                    dest: 'public'
                },{
                    expand: true,
                    cwd: 'src/visual/',
                    src: ['*.html'],
                    dest: 'public'
                }]
            },
            js:{
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['visual/src/*.js'],
                    dest: 'public/dist/src/'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'src/visual/',
                    src: ['*.html'],
                    dest: 'public'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['doc/src/*.css','demo1/src/*.css','visual/src/*.css'],
                    dest: 'public/dist/src/'
                }]
            }
        },
        autoprefixer: {
            dist: {
                files: {
                    'public/dist/src/<%= pkg.name %>.min.css': 'public/dist/src/<%= pkg.name %>.min.css'
                }
            }
        },
        cssmin: {
            dist: {
                files: [{
                    src: ['public/dist/src/<%= pkg.name %>.min.css'],
                    dest: 'public/dist/src/<%= pkg.name %>.min.css'
                }]
            }
        },
        uglify: {
            dist: {
                files: [{
                    src: ['public/dist/src/<%= pkg.name %>.lib.min.js'],
                    dest: 'public/dist/src/<%= pkg.name %>.lib.min.js'
                }, {
                    src: ['public/dist/src/<%= pkg.name %>.min.js'],
                    dest: 'public/dist/src/<%= pkg.name %>.min.js'
                }]
            }
        },
        watch: {
            html:{
                files: ['public/*.html','src/visual/*.html'],
                tasks: ['copy:html','replace:dev']
            },
            script: {
                files: ['src/js/plugins/*.js','src/visual/src/v-1.js'],
                tasks: ['concat:dist','copy:js','replace:dev']
            },
            scss: {
                files: ['src/scss/cui.scss', 'src/scss/**/*.scss', 'src/visual/src/*.scss'],
                tasks: ['sass','autoprefixer','replace:dev'],
                options: {
                    debounceDelay: 10000,
                    livereload: true,
                }
            }
        },
        replace: {
            publish: {
                src: [
                    'public/*.html',
                    'public/sw.js'
                ],
                overwrite: true,
                replacements: [{
                    from: '%RootUrl%',
                    to: config.github.url
                }]
            },
            dev: {
                src: [
                    'public/*.html',
                    'public/sw.js'
                ],
                overwrite: true,
                replacements: [{
                    from: '%RootUrl%',
                    to: config.dev.url
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['copy:all', 'concat', 'sass', 'autoprefixer', 'cssmin', 'uglify', 'htmlmin','replace:publish']);
    grunt.registerTask('dev', ['copy:all', 'concat', 'sass', 'autoprefixer','replace:dev', 'watch']);
};
