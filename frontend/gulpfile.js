require('es6-promise').polyfill();

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    haml = require('gulp-haml'),
    prettify = require('gulp-prettify'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    webpack = require('webpack-stream'),
    ngAnnotate = require('gulp-ng-annotate');

// Copy Libs (Call this task after a npm install command)
gulp.task('copy-libs', function() {
    gulp.src('./bower_components/angular/angular.min.js')
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./bower_components/angular-oauth2/dist/angular-oauth2.min.js')
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./bower_components/angular-cookies/angular-cookies.min.js')
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./bower_components/query-string/query-string.js')
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min' 
    }))
    .pipe(gulp.dest('./dist/libs/query-string'));

    gulp.src('./bower_components/angular-ui-router/release/angular-ui-router.min.js')
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./bower_components/ng-letter-avatar/ngletteravatar.js')
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min' 
    }))
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./dist/libs/jquery'));

    gulp.src('./bower_components/components-font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('./dist/fonts/font-awesome/css'));

    gulp.src(['./bower_components/angular-animate/angular-animate.min.js', 
        './bower_components/angular-aria/angular-aria.min.js', 
        './bower_components/angular-material/angular-material.min.js',
        './bower_components/angular-messages/angular-messages.min.js'])
    .pipe(gulp.dest('./dist/libs/angular-material/js'));

    gulp.src('./bower_components/angular-material/angular-material.min.css')
    .pipe(gulp.dest('./dist/libs/angular-material/css'));

    gulp.src('./bower_components/angular-google-maps/dist/angular-google-maps.min.js')
    .pipe(gulp.dest('./dist/libs/angular-google-maps'));

    gulp.src('./bower_components/angular-simple-logger/dist/angular-simple-logger.min.js')
    .pipe(gulp.dest('./dist/libs/angular-google-maps'));

    gulp.src('./bower_components/lodash/dist/lodash.min.js')
    .pipe(gulp.dest('./dist/libs/angular-google-maps'));

    gulp.src('./bower_components/angular-animate/angular-animate.min.js')
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./bower_components/ng-file-upload/ng-file-upload.min.js')
    .pipe(gulp.dest('./dist/libs/ng-file-upload'));

    gulp.src('./bower_components/angular-resource/angular-resource.min.js')
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./node_modules/meanie-angular-http-buffer/release/meanie-angular-http-buffer.min.js')
    .pipe(gulp.dest('./dist/libs/angular'));

    gulp.src('./node_modules/particlesjs/dist/particles.min.js')
    .pipe(gulp.dest('./dist/libs/particlesjs'));

});

// Styles
gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded'})
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({ 
        basename: 'app'
    }))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({
        suffix: '.min' 
    }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('')
      .pipe(webpack(require('./webpack.config.js')))
      .pipe(ngAnnotate())
      .pipe(gulp.dest('dist/scripts'));

});

// Haml
gulp.task('haml', function () {
  gulp.src('./src/views/**/*.haml')
    .pipe(haml({
      compiler: 'visionmedia'
    }))
    .pipe(prettify())
    .pipe(gulp.dest('./dist/views'))
    .pipe(livereload(server));
});

gulp.task('haml-directives', function () {
  gulp.src('./src/app/directives/**/*.haml')
    .pipe(haml({
      compiler: 'visionmedia'
    }))
    .pipe(prettify())
    .pipe(gulp.dest('./dist/views/templates'))
    .pipe(livereload(server));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['styles', 'scripts', 'haml', 'haml-directives'], function() {
    gulp.start('watch');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
    gulp.watch('src/styles/**/*.scss', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.start('styles');
    });

    // Watch script files
    gulp.watch(['src/scripts/**/*.js', 'src/app/**/*.js', 'src/app/**/**/*.js'], function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.start('scripts');
    });

    // Watch .haml files
    gulp.watch('src/views/**/*.haml', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.start('haml');
    });

    gulp.watch('src/app/directives/**/*.haml', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.start('haml-directives');
    });
});