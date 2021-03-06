var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano'); 
var lazypipe = require('lazypipe');

// // Handlebars Plugins
// var handlebars = require('gulp-handlebars');
// var handlebarsLib = require('handlebars');
// var declare = require('gulp-declare');
// var wrap = require('gulp-wrap');

// File Paths
 var DIST_PATH = 'public/dist';
 var SCRIPTS_PATH = 'public/scripts/**/*.js';
 var CSS_PATH = 'public/stylesheets/**/*.css';
 var SCSS_PATH = 'public/scss/**/*.scss';
 var SERVER_ROOT = 'public';
 var HTML_PATH = '**/*.html';
 var TPL_PATH = 'components/**/*.html'

// Spin up browser-sync server.
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: SERVER_ROOT
    },
  });
});

// // CSS Only Styles
// gulp.task('styles', function(){
//     console.log('Starting Styles Task');
//     return gulp.src(['../public/stylesheets/reset.css', STYLES_PATH])
//         .pipe(plumber(function(err){
//             console.log('Styles Task Error: ');
//             console.log(err);
//             this.emit('end');
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(autoprefixer())
//         .pipe(concat('styles.css'))
//         .pipe(minifyCss())      
//         .pipe(sourcemaps.write())  
//         .pipe(gulp.dest(DIST_PATH))
//         .pipe(livereload());
// });

// Styles for SCSS
gulp.task('scss', function(){
    console.log('Starting Styles Task');
    return gulp.src('./public/scss/styles.scss')
        .pipe(plumber(function(err){
            console.log('Styles Task Error: ');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))      
        .pipe(sourcemaps.write())  
        .pipe(gulp.dest(DIST_PATH))
        // .pipe(livereload());
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Scripts
gulp.task('scripts', function(){
    console.log('Runing Scripts Task');
    return gulp.src(['./public/bower_components/jquery/dist/jquery.min.js', './public/bower_components/angular/angular.js', SCRIPTS_PATH])
        // Plumber prevents breaking changes from crashing the server
        .pipe(plumber(function(err){
            console.log('Scripts Task Error: ');
            console.log(err);
            this.emit('end');
        }))
        // Shows original files to sourcemaps plugin
        .pipe(sourcemaps.init())
        .pipe(babel({
            'presets': ['es2015'],
            compact: true
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        // Shows altered files to sourcemap plugin
        .pipe(sourcemaps.write())
        // Tell gulp where to put files once changed
        .pipe(gulp.dest(DIST_PATH))        
        // Reloads public server resources in browser on changes 
        .pipe(browserSync.reload({
            stream: true
        }));    
});

// Images
gulp.task('images', function(){
    console.log('Runing Images Task');
});

// HTML
gulp.task('templates', function () {
    return gulp.src(TPL_PATH) 
        .pipe(gulp.dest('./public/dist/templates'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Default
gulp.task('default', ['images', 'templates', 'scss', 'scripts'], function(){
    console.log('Runing Default Task');
});

// Watch 
    // Watches for changes and restarts the server and re-runs the tasks
    // Makes sure browserSync server is up before watching file for changes
    // Then Makes sure styles SCSS has compiled before watching as well    
gulp.task('watch', ['browserSync', 'default'], function(){
    console.log('Starting gulp watch task.');    
    // Says which folder to watch and which tasks to run when there are changes
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    // gulp.watch(CSS_PATH, ['styles']);
    gulp.watch(SCSS_PATH, ['scss']);
    gulp.watch(TPL_PATH, ['templates']);
    // gulp.watch(TEMPLATES_PATH, ['templates']);
    gulp.watch(HTML_PATH, browserSync.reload); // runs no task so it just reloads with no task
});