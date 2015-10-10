/* gulpfile.js */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Defining input and output location
var input = {
  'sass': 'css/*.scss',
  'javascript': 'scripts/*.js'
},

output = {
  'html': 'public',
  'stylesheets': 'public/css',
  'javascript': 'public/js'
};

// Gulp tasks
gulp.task('jshint', function() {
  return gulp.src( input.javascript )
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('buildcss', function() {
  return gulp.src( input.sass )
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest( output.stylesheets ));
});

gulp.task('buildjs', function() {
  return gulp.src( input.javascript )
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write())
  .pipe(gulp.dest( output.javascript ));
});

// Gulp watch tasks
gulp.task('watch', function() {
  gulp.watch(input.javascript, ['jshint']);
  gulp.watch(input.sass, ['buildcss']);
  gulp.watch(input.javascript, ['buildjs']);
});

//gulp.default task
gulp.task('default', ['watch', 'buildjs', 'buildcss']);





