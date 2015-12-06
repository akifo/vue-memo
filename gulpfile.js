var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var plumber = require('gulp-plumber');
var sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var config = require('./config');

gulp.task('webpack', function () {
  gulp.src(config.webpack.entry.app)
    .pipe(plumber())
    .pipe(webpack(config.webpack))
    .pipe(gulpif(false, uglify()))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('scss',function(){
  gulp.src(config.scss.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.scss.dest));
});

gulp.task('watch', function () {

  // js
  gulp.watch(config.js.src, function () {
      gulp.start(['webpack']);
  });

  // scss
  gulp.watch(config.scss.src, function () {
    gulp.start(['scss']);
  });

});

gulp.task('default', ['webpack', 'scss', 'watch']);
