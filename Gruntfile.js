/* Gruntfile */
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // grunt-env //
    env: {
      options: {
        /* shared options */
      },
      development: {
        BUILD_MODE: 'DEVELOPMENT',
      },
      production: {
        BUILD_MODE: 'PRODUCTION'
      },
    },

    // grunt-preprocess //
    preprocess: {
      options: {
        context: {
          title      : '<%= pkg.name %>',
          author     : '<%= pkg.author %>',
          version    : '<%= pkg.version %>',
          keywords   : '<%= pkg.keywords %>',
          description: '<%= pkg.description %>',
        },        
      },
      development: {
        src: 'src/app.html',
        dest: 'release/app.html',
      },
      production: {
        src: 'src/app.html',
        dest: 'release/app.html',
      },
    },

    // grunt-contrib-compass //
    compass: {
      development: {
        options: {
          outputStyle: 'expanded',
          sassDir    : 'src/styles',
          cssDir     : 'release/static/css',
          environment: 'development',
        },
      },
      production: {
        options: {
          outputStyle: 'compressed',
          sassDir    : 'src/styles',
          cssDir     : 'release/static/css',
          environment: 'production',
        },
      },
    },

    // grunt-contrib-watch //
    watch: {
      options: {
        interrupt : true,
        livereload: true,
      },
      sass: {
        files: ['src/styles/*.scss'],
        tasks: ['env:development', 'compass:development'],
      },
      html: {
        files: ['src/app.html'],
        tasks: ['env:development', 'preprocess:development'],
      },
      scripts: {
        files: ['src/scripts/**/*'],
        tasks: ['env:development', 'copy:scripts'],
      },
    },

    // grunt-contrib-copy //
    copy: {
      scripts: {
        expand: true,
        cwd: 'src/scripts',
        src: ['**'],
        dest: 'release/static/scripts/',
      },
      development: {
        files: [
          {expand: true, cwd: 'src/static/',  src: ['**'], dest: 'release/static/'},
          {expand: true, cwd: 'src/scripts/', src: ['**'], dest: 'release/static/scripts/'},
        ],
      },
      production: {
        files: [
          {expand: true, cwd: 'src/static/', src: ['**'], dest: 'release/static/'},
        ],
      },
    },

    // grunt-contrib-clean //
    clean: {
      development: ['release/**/*'],
      release    : ['release/**/*'],
      postrelease: ['release/static/css/app.css'],
    },

    // grunt-contrib-htmlmin //
    htmlmin: {
      production: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          'release/app.html': 'release/app.html',
        }
      }
    },

    // grunt-contrib-cssmin //
    cssmin: {
      release: {
        options: {
          banner             : '/* <%= pkg.name %>\n   Copyright 2013 <%= pkg.author %> */\n',
          report             : 'min',
          keepSpecialComments: 0,
        },
        files: {
          'release/static/css/app.min.css': ['release/static/css/app.css'],
        }
      }
    },

    // grunt-contrib-uglify //
    uglify: {
      options: {
        mangle: true
      },
      release: {
        files: {
          'release/static/scripts/app.min.js': [
            'src/scripts/app.js',
          ],
          'release/static/scripts/vendor.min.js': [
            'src/scripts/vendor/jquery-2.0.3.min.js',
            'src/scripts/vendor/lodash.min.js',
            'src/scripts/vendor/angular.min.js',
            'src/scripts/vendor/angular-touch.min.js',
            'src/scripts/vendor/angular-sanitize.min.js',
            'src/scripts/vendor/angular-resource.min.js',
            'src/scripts/vendor/angular-route.min.js',
            'src/scripts/vendor/angular-animate.min.js',
            'src/scripts/vendor/angular-cookies.min.js',
          ],
        },
      },
    },

    // grunt-contrib-connect //
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'release',
          keepalive: true,
          hostname: '*',
          livereload: true,
        }
      }
    },
    
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  
  /* tasks */
  grunt.registerTask('release', [
    'env:production',         /* setup environments */
    'clean:release',          /* cleanup release directory */
    'copy:production',        /* copy static files */
    'preprocess:production',  /* process HTML file */
    'htmlmin:production',     /* compress HTML file */
    'compass:production',     /* sass compile */
    'cssmin:release',         /* minify app.css -> app.min.css */
    'uglify:release',         /* minify scripts -> app.min.js, vendor.min.js */
    'clean:postrelease',      /* remove app.css and other unused files */
  ]);
  grunt.registerTask('build', [
    'env:development',
    'clean:release',
    'copy:development',
    'compass:development',
    'preprocess:development',
  ]);

  grunt.registerTask('default', ['build']);
};