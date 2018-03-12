const fs = require('fs');
const crypto = require('crypto');
const grunt = require('grunt');
const generateSpriteConfig = function (imgDir) {
    imgDir = `s-${imgDir}`;

    function getCollectiveMd5(files) {
        const md5sum = crypto.createHash('md5');
        const expandedFiles = grunt.file.expand(files),
            collectiveContent = expandedFiles.reduce(function (content, file) {
                return content + fs.readFileSync(file, 'binary');
            }, '');
        md5sum.update(collectiveContent);
        return md5sum.digest('hex').slice(0, 10);
    }
    const hash = getCollectiveMd5(`src/img/${imgDir}/*.png`);
    const imgName = `${imgDir}-${hash}`;
    return {
        src: `src/img/${imgDir}/*.png`,
        dest: `public/dist/src/img/autogenerated/${imgName}.png`,
        destCss: `src/scss/base/autogenerated/${imgDir}.scss`,
        imgPath: `img/autogenerated/${imgName}.png`,
        cssVarMap: function (sprite) {
            sprite.name = `${imgDir}-${sprite.name}`;
        },
        cssTemplate: 'src/scss/base/_sprites.scss.handlebars'
    };
};
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sprite: ['img'].reduce((config, k) => Object.assign(config, {
            [k]: generateSpriteConfig(k)
        }), {}),
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'public/index.html': 'public/index.html',
                }
            }
        },
        sass: {
            options: {
                outputStyle: 'expanded'
            },
            dist: {
                files: [{
                    'public/dist/src/cui.css': 'src/scss/cui.scss'
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
                    src: ['img/*.*', 'img/pin/*.*', 'fonts/*.*', 'doc/src/*.*'],
                    dest: 'public/dist/src/'
                }, {
                    expand: true,
                    cwd: '',
                    src: ['favicon.ico','serviceworker.js'],
                    dest: 'public/'
                }]
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
                files: ['src/js/plugins/*.js', 'src/doc/src/*.js','serviceworker.js'],
                tasks: ['concat:dist','copy']
            },
            scss: {
                files: ['src/scss/*.scss', 'src/scss/**/*.scss', 'src/doc/src/*.css'],
                tasks: ['sass','copy']
            },
            css: {
                options: {
                    debounceDelay: 250,
                    livereload: true
                },
                files: ['public/dist/src/*.css'],
                task: ['autoprefixer']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['copy', 'concat', 'sprite', 'sass', 'autoprefixer', 'cssmin', 'uglify']);
    grunt.registerTask('dev', ['copy', 'concat', 'sprite', 'sass', 'autoprefixer', 'cssmin', 'watch']);
};
