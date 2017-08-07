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
                    src: ['src/js/plugins/*.js'],
                    dest: 'public/dist/src/<%= pkg.name %>.js'
                }, {
                    src: ['src/js/libs/*.js'],
                    dest: 'public/dist/src/<%= pkg.name %>.lib.js'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['img/*.*', 'fonts/*.*'],
                    dest: 'public/dist/src/'
                }]
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'src/scss/',
                    cssDir: 'public/dist/src/',
                    imagesDir: 'src/img/',
                    generatedImagesDir: 'public/dist/src/img/s-img/',
                    httpGeneratedImagesPath: 'img/s-img/'
                }
            }
        },
        autoprefixer: {
            dist: {
                files: {
                    'public/dist/src/<%= pkg.name %>.css': 'public/dist/src/<%= pkg.name %>.css'
                }
            }
        },
        cssmin: {
            dist: {
                files: [{
                    src: ['public/dist/src/<%= pkg.name %>.css'],
                    dest: 'public/dist/src/<%= pkg.name %>.min.css'
                }]
            }
        },
        uglify: {
            dist: {
                files: [{
                    src: ['public/dist/src/<%= pkg.name %>.lib.js', 'public/dist/src/<%= pkg.name %>.js'],
                    dest: 'public/dist/src/<%= pkg.name %>.min.js'
                }]
            }
        },
        watch: {
            script: {
                files: ['src/js/plugins/*.js'],
                tasks: ['concat:dist']
            },
            scss: {
                files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
                tasks: ['compass:dist']
            },
            css: {
                options: {
                    debounceDelay: 250,
                    livereload: true
                },
                files: ['public/dist/src/cui.css'],
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', ['copy', 'concat', 'compass', 'autoprefixer', 'cssmin', 'uglify']);
    grunt.registerTask('dev', ['copy', 'concat', 'compass', 'autoprefixer', 'cssmin', 'watch']);
};