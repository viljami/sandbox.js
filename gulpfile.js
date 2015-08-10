var gulp = require('gulp');
var serve = require('gulp-serve');
var ginject = require('gulp-inject');

var scripts = [
  './public/lab/bird/scripts/**/*.js',
  './public/lab/lib/**/*.js'
];

gulp.task('inject', function () {
  return gulp.src('./public/lab/bird/index.html')
  .pipe(ginject(
    gulp.src(scripts, {read: false}), {
      transform: function(filepath){
        return [
          '<script src="',
          filepath.replace('/public', ''),
          '"></script>'
        ].join('');
      }
    })
  )
  .pipe(gulp.dest('./public/lab/bird'));
});

gulp.task('default', serve({
  root: ['public', 'bower_components'],
  port: 3000
}));
gulp.task('serve', ['default', 'inject']);
