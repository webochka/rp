const gulp = require('gulp'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    merge = require('merge-stream'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin'),
    minifyHTML = require('gulp-minify-html'),
    autoprefixer = require('gulp-autoprefixer'),
    fileinclude = require('gulp-file-include'),
    styleInject = require("gulp-style-inject");
    inlinesource = require("gulp-inline-source");
    babel = require('gulp-babel');
    browserSync = require('browser-sync').create();

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: "7777"
    });

    gulp.watch(['./pages/**/**/*.html']).on('change', browserSync.reload);
    gulp.watch('./pages/**/**/*.js').on('change', browserSync.reload);
    gulp.watch('./pages/**/**/*', ['sass']).on('change', browserSync.reload);
});

gulp.task('sass', function() {
    gulp.src(['./pages/**/**/*.scss', './pages/**/**/*.sass'])
        .pipe(
            sass({ outputStyle: 'expanded' })
            .on('error', gutil.log)
        )
        .on('error', notify.onError())
        .pipe(gulp.dest('./pages/'))
        .pipe(browserSync.stream());
});

gulp.task('minify:img', function() {
    return gulp.src('./pages/**/**/img/*')
        .pipe(imagemin().on('error', gutil.log))
        .pipe(gulp.dest('./public/'));
});

gulp.task('minify:css', function() {
    gulp.src('./pages/**/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 30 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(fileinclude())
        .pipe(gulp.dest('./pages/'));
});

 gulp.task('babel', function() {
     gulp.src('./pages/**/**/*.js')
         .pipe(babel())
         .pipe(gulp.dest('./pages/**/**/*.js'));
 });

gulp.task('clean', function() {
    return gulp.src('./public', { read: false }).pipe(clean());
});

gulp.task('watch', ['server', 'sass']);
gulp.task('production', ['minify:css', 'babel' ,'minify:img'], function () {  
    return gulp.src(['./pages/**/**/*.html'])
        .pipe(inlinesource())
        .pipe(minifyHTML())
        .pipe(gulp.dest('./public/'));
});