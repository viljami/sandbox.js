var gulp = require('gulp');
var serve = require('gulp-serve');
var ginject = require('gulp-inject');

var scripts = [
  './lab/bird/scripts/**/*.js',
  './lab/lib/**/*.js'
];

gulp.task('inject', function () {
  return gulp.src('./lab/bird/index.html')
  .pipe(ginject(
    gulp.src(scripts, {read: false}), {
      transform: function(filepath){
        return [
          '<script src="',
          filepath.replace('lab/', ''),
          '"></script>'
        ].join('');
      }
    })
  )
  .pipe(gulp.dest('./lab/bird'));
});

gulp.task('default', serve({
  root: ['lessons', 'bower_components', 'lab'],
  port: 3000
}));
gulp.task('serve', ['default', 'inject']);


