//gulp
//gulp otf2ttf
//gulp svg_sprite

let project_folder = require("path").basename(__dirname);
let source_folder = "#src";
let fs = require('fs');
let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/"
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf"
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{JPG,jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),// @@-подключает другие файлы (html,js, для scss есть @import)
    del = require("del"),
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),//групировка медиа запросов в css
    clean_css = require("gulp-clean-css"), //мимификация css
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,//мимификация js
    imagemin = require("gulp-imagemin"),
    webp = require("gulp-webp"),
    webp_html = require("gulp-webp-html"), //вставляет html код для webp картинок
    webpcss = require("gulp-webpcss"),//создает css класс для webp картинок
    svg_sprite = require("gulp-svg-sprite"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    fonter = require("gulp-fonter");


function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)           //где и что берем
        .pipe(fileinclude())            //обрабатываем @@
        .pipe(webp_html())              //обрабатываем тэг img в соотв с webp
        .pipe(dest(path.build.html))    //куда пишем
        .pipe(browsersync.stream())     //обновляем браузер
}

function css() {
    return src(path.src.css)            //где и что берем
        .pipe(
            scss({                      // делаем css
                outputStyle: "expanded" // css будет развернут
            })
        )
        .pipe(group_media())            //групировка медиа запросов в css
        .pipe(
            autoprefixer({              //расстановка префиксов
                grid: true,
                overrideBrowserslists: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(webpcss({                 //создает css класс для webp картинок
            webpClass: '.webp',
            noWebpClass: '.no-webp'
        }))
        .pipe(dest(path.build.css))     //куда пишем
        .pipe(clean_css())              //мимификация css
        .pipe(
            rename({                    //переименовываем css
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))     //куда пишем
        .pipe(browsersync.stream())     //обновляем браузер
}

function js() {
    return src(path.src.js)             //где и что берем
        .pipe(fileinclude())            //обрабатываем @@
        .pipe(dest(path.build.js))      //куда пишем
        .pipe(uglify())                 //мимификация js
        .pipe(
            rename({                    //переименовываем js
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))      //куда пишем
        .pipe(browsersync.stream())     //обновляем браузер
}

function images() {
    return src(path.src.img)            //где и что берем
        .pipe(
            webp({                       //конвертируем в webp
                quality: 70              //качество
            })
        )
        .pipe(dest(path.build.img))      //куда пишем
        .pipe(src(path.src.img))         //где и что берем
        .pipe(
            imagemin({                   //оптимизируем изобр
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3    // 0 to 7
            })
        )
        .pipe(dest(path.build.img))     //куда пишем
        .pipe(browsersync.stream())     //обновляем браузер
}

function fonts() {
    src(path.src.fonts)                 //где и что берем
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));  //куда пишем
    return src(path.src.fonts)          //где и что берем
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));  //куда пишем
}


gulp.task('otf2ttf', function () {//отдельная задача для преобразования шрифтов otf в ttf
    return src([source_folder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(source_folder + '/fonts/'));
})

gulp.task('svg_sprite', function () {//отдельная задача для преобразования отдельных спрайтов в один файл
    return gulp.src([source_folder + '/iconsprite/*.svg'])
        .pipe(svg_sprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg", //sprite file name
                    example: true //example for use html code
                }
            }
        }
        ))
        .pipe(dest(path.build.img))
})


function fontsStyle(params) {

    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() { }

function watchFiles(params) {
    gulp.watch([path.watch.html], html,);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    fs.unlink(source_folder + '/scss/fonts.scss', cb);//del old file fonts
    let date = new Date();
    let curDate = null;
    do { curDate = new Date(); }
    while (curDate - date < 50)
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);//create empty file
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.build = build;
exports.watch = watch;
exports.default = watch;