var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var literalify = require('literalify');

gulp.task('bundle', function() {
  return browserify({
    entries: ['./src/index.js'],
    transform: [
      ['babelify']
    ],
    debug: true,
    standalone: 'serialforms'
  })
  .transform(literalify.configure({
    'react': 'window.React'
  }))
  .bundle()
  .pipe(source('react-serial-forms.min.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  // .pipe(uglify()).on('error', gutil.log)
  .pipe(sourcemaps.write('./')).pipe(gulp.dest('dist'));
});

gulp.task('default', ['bundle']);
