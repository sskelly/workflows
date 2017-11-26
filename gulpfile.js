var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

gulp.task('log', function(){
  gutil.log('Workflows are awesome');
});

gulp.task('coffee', function(){
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

// this combines all the javascript files together into a single file
gulp.task('js', function(){
  gulp.src(jsSources) // uses the array of files above to combine everything
    .pipe(concat('script.js'))//makes a new file with this name
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
});