var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');

gulp.task('mocha', function(){
  return gulp.src('server/**/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch-mocha', function(){
  gulp.watch(['server/**/*.js'], ['mocha']);
});

gulp.task('server-test', function(){
  gulp.start('mocha', 'watch-mocha');
});

gulp.task('serve', function(){
  nodemon({script: 'server/server.js'});
});
