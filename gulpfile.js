var gulp = require('gulp');
var serve = require('gulp-serve');

gulp.task('default', serve({
  root: ['lessons', 'bower_components'],
  port: 3000
}));
gulp.task('serve', ['default']);
