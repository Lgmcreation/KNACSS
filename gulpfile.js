// Requires
var gulp = require('gulp');

// Include plugins
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

var cssnano = require('cssnano'); // minifies CSS
var autoprefixer = require('autoprefixer');

var unprefix = require('postcss-unprefix'); // deletes old prefixes
var flexbugs = require('postcss-flexbugs-fixes'); // flexbox fixes for IE
var gaps = require('postcss-gap-properties'); // gaps polyfill

var browsersList = [
  '> 1%',
  'last 2 versions',
  'IE >= 10', 'Edge >= 16',
  'Chrome >= 60',
  'Firefox >= 50', 'Firefox ESR',
  'Safari >= 10',
  'ios_saf >= 10',
  'Android >= 5'
];

var plugins = [
  unprefix(),
    autoprefixer({
      grid: true,
      browsers: browsersList
    }),
    flexbugs(),
    gaps()
];

var pluginsProd = [
  unprefix(),
    autoprefixer({
      grid: true,
      browsers: browsersList
    }),
    flexbugs(),
    gaps(),
    cssnano()
];

// tâche cssDev = compile vers knacss-unminified.css
gulp.task('cssDev', () => {
  return gulp.src('./sass/knacss.scss')
    .pipe(sass({
      outputStyle: 'expanded' // CSS non minifiée plus lisible ('}' à la ligne)
    }))
    .pipe(postcss(plugins))
    .pipe(rename('knacss-unminified.css'))
    .pipe(gulp.dest('./css/'));
});

// tâche cssProd = compile vers knacss.css minifié
gulp.task('cssProd', () => {
  return gulp.src('./sass/knacss.scss')
    .pipe(sass())
    .pipe(postcss(pluginsProd))
    .pipe(gulp.dest('./css/'));
});

gulp.task('grillade', () => {
  return gulp.src('./sass/_library/grillade-grid.scss')
    .pipe(sass())
    .pipe(postcss(pluginsProd))
    .pipe(gulp.dest('./css/'));
});

gulp.task('grillade-flex', () => {
  return gulp.src('./sass/_library/grillade-flex.scss')
    .pipe(sass())
    .pipe(postcss(pluginsProd))
    .pipe(gulp.dest('./css/'));
});

// Watcher
gulp.task('watch', () => {
  gulp.watch(['./sass/*.scss'], gulp.series('cssDev'));
});

// Tâche par défaut
gulp.task('default', gulp.series('cssDev', 'cssProd', 'grillade', 'grillade-flex'));
