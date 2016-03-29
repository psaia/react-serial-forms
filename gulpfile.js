var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var babel = require('gulp-babel');
var del = require('del');

process.env.NODE_ENV === 'production';

gulp.task('transpile-lib', ['clean-lib'], function() {
  gulp.src(['./src/**/*.js', '!./src/commonjs.js'])
    .pipe(plumber())
    .pipe(babel({
      presets: ["react", "es2015"]
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('bundle', ['clean-browser'], function() {
  var browserifyBundle = function() {
    return browserify({
      entries: ['./src/index.js'],
      transform: [
        'browserify-shim',
        [
          'babelify', {
            "presets": [
              "react",
              "es2015"
            ],
            "sourceMaps": false
          }
        ]
      ],
      standalone: 'SerialForms',
      debug: true
    })
    .bundle();
  };

  browserifyBundle() // Unminified.
    .pipe(source('react-serial-forms.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('browser'));

  browserifyBundle() // Minified.
    .pipe(source('react-serial-forms.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('browser'));
});

gulp.task('clean-lib', function(cb) {
  del(['./lib/**/*'], cb);
});

gulp.task('clean-browser', function(cb) {
  del(['./browser/*'], cb);
});

gulp.task('default', ['transpile-lib', 'bundle']);
