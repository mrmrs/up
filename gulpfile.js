// Gulp tasks for Tachyons
// Load plugins 
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    prefix = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    csslint = require('gulp-csslint'),
    fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload,
    stylestats = require('gulp-stylestats'),
    imagemin = require('gulp-imagemin');

// Use csslint without box-sizing or compatible vendor prefixes (these
// don't seem to be kept up to date on what to yell about)
gulp.task('uncss', function() {
    return gulp.src('css/tachyons.css')
        .pipe(uncss({ html: ['index.html'] }))
        .pipe(minifyCSS())
        .pipe(rename('tachyons.min.css'))
        .pipe(gulp.dest('./css'));
});
// Task that compiles scss files down to good old css
gulp.task('pre-process', function(){
  gulp.src('./css/tachyons.css')
      .pipe(watch(function(files) {
        return files.pipe(sass())
          .pipe(size({gzip: false, showFiles: true, title:'un-prefixed css'}))
          .pipe(size({gzip: true, showFiles: true, title:'un-prefixed gzipped css'}))
          .pipe(prefix())
          .pipe(size({gzip: false, showFiles: true, title:'prefixed css'}))
          .pipe(size({gzip: true, showFiles: true, title:'prefixed css'}))
          .pipe(gulp.dest('css'))
          .pipe(browserSync.reload({stream:true}));
      }));
});

// Minify all css files in the css directory
// Run this in the root directory of the project with `gulp minify-css `
gulp.task('minify-css', function(){
  gulp.src('./css/tachyons.css')
    .pipe(minifyCSS())
    .pipe(rename('tachyons.min.css'))
    .pipe(gulp.dest('./css/'))
    .pipe(size({gzip: true, showFiles: true, title:'minified css'}));
});

// Initialize browser-sync which starts a static server also allows for 
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./"
        }
    });
});



gulp.task('stylestats', function () {
  gulp.src('./css/tachyons.css')
    .pipe(stylestats());
});


// Function to call for reloading browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/*
   DEFAULT TASK

 • Process sass then auto-prefixes and lints outputted css
 • Starts a server on port 3000
 • Reloads browsers when you change html or sass files

*/
gulp.task('default', ['pre-process', 'minify-css', 'bs-reload', 'browser-sync'], function(){
  gulp.start('pre-process', 'minify-css', 'csslint');
  gulp.watch('sass/*.scss', ['pre-process', 'minify-css']);
  gulp.watch('css/tachyons.css', ['bs-reload']);
  gulp.watch('*.html', ['bs-reload']);
});

gulp.task('minify-images', function () {
    return gulp.src('dist/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
        .pipe(gulp.dest('images'));
});
