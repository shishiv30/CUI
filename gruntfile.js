module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                files: [{
                    src: ['src/js/libs/*.js', 'src/js/plugins/*.js'],
                    dest: 'dist/<%= pkg.name %>.js'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['img/*.*', 'fonts/*.*'],
                    dest: 'dist/'
                }]
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: 'src/scss/',
                    cssDir: 'dist/',
                    imagesDir: "src/img/",
                    generatedImagesDir: "dist/img/s-img/",
                    httpGeneratedImagesPath: "img/s-img/"
                }
            }
        },
        autoprefixer: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.css': 'dist/<%= pkg.name %>.css'
                }
            }
        },
        cssmin: {
            dist: {
                files: [{
                    src: ['dist/<%= pkg.name %>.css'],
                    dest: 'dist/<%= pkg.name %>.min.css'
                }]
            }
        },
        uglify: {
            dist: {
                files: [{
                    src: ['dist/<%= pkg.name %>.js'],
                    dest: 'dist/<%= pkg.name %>.min.js'
                }]
            }
        },
        watch: {
            script: {
                files: ['src/js/plugins/*.js'],
                tasks: ['concat:dist']
            },
            css: {
                files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
                tasks: ['compass:dist']
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