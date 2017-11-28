var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;
    
//env = process.env.NODE_ENV || 'development'; // this creates and environment variable
env = 'production';


if (env==='development'){
  outputDir = "builds/development/";
  sassStyle = 'expanded';
}else{
  outputDir = "builds/production/";
  sassStyle = 'compressed'
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function(){
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function(){ // this will run everytime the file changes
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('_components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['js']);
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function(){
  gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json', function(){
  gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('default',['html','json','coffee','js','compass', 'connect', 'watch']); //this is the default task run by simply 'gulp' in cmd