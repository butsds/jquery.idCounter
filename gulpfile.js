'use strict'

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');
const gulpIf      = require('gulp-if');
const uglify      = require('gulp-uglify'); // для js
const cleanCss    = require('gulp-clean-css');
const rename      = require("gulp-rename");

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task('default', ['sass', 'js', 'watch'], function(){
    
});

gulp.task('css', function(){
    return gulp.src("sass/*.{sass,scss}")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'));
});


gulp.task('sass', ['css'], function() {
    return gulp.src("sass/*.{sass,scss}")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename('jquery.idcounter.theme.min.css'))
        .pipe(gulp.dest('../css'));
});

gulp.task('js', function() {
    return gulp.src("js/jquery.idcounter.js")
        .pipe(uglify())
        .pipe(rename('jquery.idcounter.min.js'))
        .pipe(gulp.dest('js'))
});

gulp.task('watch', function() {
    gulp.watch('sass/*.{sass,scss}', ['sass']);
    gulp.watch('js/jquery.idcounter.js', ['js']);
});