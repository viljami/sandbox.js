var gulp = require('gulp');
var serve = require('gulp-serve');
var ginject = require('gulp-inject');

var scripts = [
  './public/lab/bird/scripts/**/*.js',
  './public/lab/lib/**/*.js'
];

var names = {
  'lessons/lesson-1-basics.html': 'Basics',
  'lessons/lesson-2-colors.html': 'Colors',
  'lessons/lesson-3-rotation.html': 'Rotation',
  'lessons/lesson-4-3d.html': '3D',
  'lessons/lesson-5-textures.html': 'Textures 1',
  'lessons/lesson-6-advanced-textures.html': 'Textures 2',
  'lessons/lesson-7-light.html': 'Light',
  'lab/bird/index.html': 'Bird',
  'vertices/scarf.html': '!',
  'vertices/split-polygon-animated-2d.html': '2D Split 2',
  'vertices/split-polygon-animated-3d.html': '!',
  'vertices/split-polygons-2d.html': '2D Split 1',
  'vertices/split-polygons-3d.html': '!',
  'vertices/triangle-split-order-2d.html': '2D Split run',
  'vertices/elastic-net.html': '!',
  'index.html': '!'
};

function getName (filepath){
  var name = filepath.split('/');
  name = name[name.length - 1];
  return name.replace('.html', '').replace('-', ' ');
}

gulp.task('inject', function(){
  return gulp.src('./public/index.html')
  .pipe(ginject(
    gulp.src('./public/**/*.html', {read: false}), {
      name: 'links',

      transform: function(filepath){
        filepath = filepath.replace('/public/', '');
        var name = names[filepath] || getName(filepath);

        if (name === '!') return '';

        return [
          '<li>',
          '<a href="',
          filepath,
          '" target="show">',
          name,
          '</a>',
          '</li>'
        ].join('');
      }
    })
  )
  .pipe(gulp.dest('./public'));
});

// gulp.task('inject', function () {
//   return gulp.src('./public/lab/bird/index.html')
//   .pipe(ginject(
//     gulp.src(scripts, {read: false}), {
//       transform: function(filepath){
//         return [
//           '<script src="',
//           filepath.replace('/public', ''),
//           '"></script>'
//         ].join('');
//       }
//     })
//   )
//   .pipe(gulp.dest('./public/lab/bird'));
// });

gulp.task('default', serve({
  root: ['public', 'bower_components'],
  port: 3000
}));
gulp.task('serve', ['default', 'inject']);
