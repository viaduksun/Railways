const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('delete');
const uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const purifycss = require('purifycss-extended');
const cleanCSS = require('gulp-clean-css');
const gulp_rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const browsersync = require('browser-sync').create();
const svgsprite = require('gulp-svg-sprite');

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './dist/'
        },
        port: 3000,
        notify: false
    });
}

function buildCSS() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
        // nimification
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp_rename({ extname: '.min.css' }))
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream());

}
// =================================================================
// Отдельная задача для создания файла-спрайта с иконками
gulp.task('svgsprite', function () {
    return gulp.src('src/img/icons/*.svg')
      .pipe(svgsprite({
        mode: {
          stack: {
            sprite: '../icons/spriteicons.svg',
            example: true,
          }
        }
      }))
      .pipe(gulp.dest('src/img'))
  })
// =================================================================

function buildHTML() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream());
}

function buildJS() {
    // добавлено исключение из массива чтобы в конечную папку приходилb только файлы после обработки fileinclude
    return gulp.src(['src/js/*.js', '!src/js/_*.js'])
        // подключаем работу плагина сборки модулей
        .pipe(fileinclude())
        // .pipe(babel({
        //     "presets": [["@babel/preset-env", { "modules": false }]],
        //     "env": {
        //         "test": {
        //         "plugins": ["istanbul"]
        //         }
        //     }
        // }))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        // переименовываем
        .pipe(gulp_rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream());
}


function buildImages() {
    return gulp.src('src/img/**/*.{jpg,png,gif,svg,ico,webp}')
        .pipe(webp({
            quality: 70
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(gulp.src('src/img/*'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3 //0 to 7
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(browsersync.stream());
}

function clean() {
    return del('dist/**', { force: true });
}
// =================================================================
// =============СЦЕНАРИЙ ВЫПОЛНЕНИЯ==============================
function build() {
    return gulp.series(clean, gulp.parallel(
        buildImages,
        buildCSS,
        buildHTML,
        buildJS
    ))
}


function watchFiles() {
    gulp.watch('src/*.html', buildHTML);
    gulp.watch('src/scss/*.scss', buildCSS);
    gulp.watch('src/js/*.js', buildJS);
    gulp.watch('src/img/**/*.{jpg,png,gif,svg,ico,webp}', buildImages);
}
// function dev() {
//     gulp.parallel(watchFiles, browserSync)
// }
const dev = gulp.parallel(build, watchFiles, browserSync);


exports.watchFiles = watchFiles;
exports.purifycss = purifycss;
exports.buildHTML = buildHTML;
exports.buildCSS = buildCSS;
exports.buildJS = buildJS;
exports.clean = clean;
exports.dev = dev;
exports.build = build();