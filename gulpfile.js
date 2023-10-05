//initialize modules - all npm packages 
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();


// Sass task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true }) 
    // Pipe is a gulp function and runs them one after the other
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist',  { sourcemap: '.' }));
}

function jsTask() {
    return src('app/js/script.js', { sourcemaps: true }) 
    .pipe(babel({ presets: ['@babel/preset-env'] })) // Correct preset name
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}


// Browsersync
function browsersyncServe(cb) { //Spins up the browser sync server
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: { 
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb(); // Callback function to indicate that it's finished running
}

function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browserSyncReload)
    );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);