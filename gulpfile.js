var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];

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
    .pipe(connect.reload())
});

gulp.task('compass', function(){
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload())
});

gulp.task('watch', function(){ // this will run everytime the file changes
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('_components/sass/*.scss', ['compass']);
});

gulp.task('connect', function(){
  connect.server({
    root: 'builds/development/',
    livereload: true
  });
});

gulp.task('default',['coffee','js','compass', 'connect', 'watch']); //this is the default task run by simply 'gulp' in cmd