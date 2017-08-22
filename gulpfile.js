var gulp = require('gulp');

var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

gulp.task('image', function () {
    gulp.src('./images/*')
      .pipe(gulp.dest('./dest/images'));
});
gulp.task('css', function () {
    var processors = [px2rem({
        remUnit: 151.9
    })];
    return gulp.src('./css/*.css').pipe(postcss(processors)).pipe(gulp.dest('./dest/css'));
});
gulp.task('default',['image','css']);