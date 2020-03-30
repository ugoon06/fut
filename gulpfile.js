const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence'); //gulp 순서 동기화 
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const ghPages = require('gulp-gh-pages');
const compileHandlebars = require('gulp-compile-handlebars');
const gulpSort = require('gulp-sort');
const newer = require('gulp-newer'); //새로운 이미지만 선별
const md5Plus = require("gulp-md5-plus");
const rename = require('gulp-rename');
const beautify = require('gulp-beautify');
const clean = require('gulp-clean');
const cleanCss = require('gulp-clean-css');
const spritesmith = require('gulp.spritesmith');
const svgSprite = require('gulp-svg-sprite');
const svg2png = require('gulp-svg2png');
const imagemin = require('gulp-imagemin'); //이미지 최적화 
const imageminJpegRecom = require('imagemin-jpeg-recompress'); // 이미지 progressive 적용
const svgo = require('gulp-svgo');
const pug = require('gulp-pug');
const sassGlob = require('gulp-sass-glob');
const cssnano = require('gulp-cssnano');
const fileinclude = require('gulp-file-include');

const paths = {
    src: 'src/',
    dist: 'dist/',
    scss_src: 'src/scss/',
    css_src: 'src/css/',
    css_dist: 'dist/css',
    img_src: 'src/images/',
    img_dist: 'dist/images/',
    svg_src: 'src/svg/',
    sprite_png_src: 'src/sprites/png',
    sprite_svg_src: 'src/sprites/svg',
    js_src: 'src/js/',
    html_src: 'src/pug/',
    html_dist: 'src/html/',
    gulpconfig: 'gulpconfig/',
    markup_src: 'src/markup/'
};

// gulp task 환경 설정
const config = {
    sprite: {
        png: true, // png sprite 생성 (default: true)
        svg: false // svg sprite 생성 (default: true)
    },
    md5: true // md5 실행 여부 (default: true)
};

// autoprefixer 옵션
const autoprefixerBrowsers = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.3'
];

// dir 하위 디렉토리 목록을 반환
function getFolders(dir) {
    let result = [];
    if (fs.statSync(dir).isDirectory()) {
        result = fs.readdirSync(dir).filter((file) => fs.statSync(path.join(dir, file)).isDirectory());
    }
    return result;
}

// 터미널 커맨드 실행 테스크
// 로컬 개발
// 참고: imagemin, svgmin 개발 중에 필요하지 않은 경우 제외
gulp.task('default', function (cb) {
    return runSequence('sprite', 'spriteSvg', 'sass', 'imagemin', 'svgmin', 'pug', 'fileinclude', ['watch', 'browserSync'], cb);
});

// dist 폴더 생성
gulp.task('build', (cb) => {
    return runSequence('sprite', 'spriteSvg', 'sass', 'imagemin', 'svgmin', 'cleanDist', 'htmlBuild', 'md5', 'minify', 'beautify', cb);
});

// dist 폴더 생성
gulp.task('deploy', (cb) => {
    return runSequence('build', 'ghPages', cb);
});

// 복합 테스크
// sprite image(png) 생성 task 그룹
gulp.task('sprite', (cb) => {
    return config.sprite.png ? runSequence('makeSprite', 'makeSpriteMaps', cb) : cb();
});

// sprite image(svg) 생성 task 그룹
// 참고: 필요에 따라서 svg2png task를 마지막에 추가
gulp.task('spriteSvg', (cb) => {
    return config.sprite.svg ? runSequence('makeSpriteSvg', 'makeSpriteSvgMaps', cb) : cb();
});

// sprite image 생성 (png)
gulp.task('makeSprite', () => {
    const folders = getFolders(paths.sprite_png_src);
    let options = {
        spritesmith: (options) => {
            const {
                folder,
                paths
            } = options;
            return {
                imgPath: path.posix.relative(paths.css_src, path.posix.join(paths.img_src, 'sp_' + folder + '.png')),
                imgName: 'sp_' + folder + '.png',
                cssName: path.posix.relative(paths.img_src, path.posix.join(paths.scss_src, 'sprites', '_' + folder + '.scss')),
                cssFormat: 'scss',
                padding: 4,
                cssTemplate: path.join(paths.gulpconfig, 'sprite_template.hbs'),
                cssSpritesheetName: folder,
                algorithm: 'binary-tree'
            }
        },
    };

    return folders.map((folder) => {
        return new Promise((resolve) => {
            gulp.src(path.join(paths.sprite_png_src, folder, '*@2x.png'))
                .pipe(gulpSort())
                .pipe(spritesmith(options.spritesmith({
                    folder,
                    paths
                })))
                .pipe(gulp.dest(paths.img_src))
                .on('end', resolve);
        });
    });
});

// sprite image map 생성 (png)
gulp.task('makeSpriteMaps', () => {
    const folders = getFolders(paths.sprite_png_src);
    var options = {
        maps: {
            handlebars: {
                path: path.join('.', path.posix.relative(path.join(paths.scss_src, 'sprites'), path.join(paths.scss_src, 'sprites'))),
                import: folders,
            }
        },
    };

    return new Promise(function (resolve) {
        gulp.src(path.join(paths.gulpconfig, 'sprite_maps_template.hbs'))
            .pipe(compileHandlebars(options.maps.handlebars))
            .pipe(rename('_sprite_maps.scss'))
            .pipe(gulp.dest(path.join(paths.scss_src, 'sprites')))
            .on('end', resolve);
    });
});

// sprite image 생성 (svg)
gulp.task('makeSpriteSvg', () => {
    const folders = getFolders(paths.sprite_svg_src);
    let options = {
        spritesmith: (options) => {
            const {
                folder,
                paths
            } = options;
            return {
                shape: {
                    spacing: {
                        padding: 4
                    }
                },
                mode: {
                    css: {
                        dest: './',
                        bust: false,
                        sprite: 'sp_' + folder + '.svg',
                        render: {
                            scss: {
                                template: path.join(paths.gulpconfig, 'sprite_svg_template.hbs'),
                                dest: path.posix.relative(paths.img_src, path.posix.join(paths.scss_src, 'sprites', '_' + folder + '_svg.scss'))
                            }
                        }
                    }
                },
                variables: {
                    spriteName: folder + '-svg',
                    baseName: path.posix.relative(paths.css_src, path.posix.join(paths.img_src, 'sp_' + folder)),
                    svgToPng: ''
                }
            }
        },
    };

    return folders.map((folder) => {
        return new Promise((resolve) => {
            gulp.src(path.join(paths.sprite_svg_src, folder, '*.svg'))
                .pipe(gulpSort())
                .pipe(svgSprite(options.spritesmith({
                    folder,
                    paths
                })))
                .pipe(gulp.dest(paths.img_src))
                .on('end', resolve);
        });
    });
});

// sprite image map 생성 (svg)
gulp.task('makeSpriteSvgMaps', () => {
    const folders = getFolders(paths.sprite_svg_src);
    var options = {
        maps: {
            handlebars: {
                path: path.join('.', path.posix.relative(path.join(paths.scss_src, 'sprites'), path.join(paths.scss_src, 'sprites'))),
                import: folders,
            }
        },
    };

    return new Promise(function (resolve) {
        gulp.src(path.join(paths.gulpconfig, 'sprite_svg_maps_template.hbs'))
            .pipe(compileHandlebars(options.maps.handlebars))
            .pipe(rename('_sprite_svg_maps.scss'))
            .pipe(gulp.dest(path.join(paths.scss_src, 'sprites')))
            .on('end', resolve);
    });
});

// sprite svg image fallback (svg => png)
gulp.task('makeSvg2Png', () => {
    return gulp.src(path.join(paths.img_src + '*.svg'))
        .pipe(svg2png())
        .pipe(gulp.dest(path.join(paths.img_src, '/fallback')));
});

//sprite image name 변경 ()
gulp.task('md5', (cb) => {
    if (!config.md5) return cb();

    function md5Sprite(ext = 'png') {
        let folders;
        folders = getFolders(paths[`sprite_${ext}_src`]);
        folders.map((folder) => {
            imageList.push(path.join(paths.img_dist, `sp_${folder}.${ext}`));
        });
    }

    const cssfiles = path.join(paths.css_dist, '*.css');
    const imageList = [];

    if (config.sprite.png) {
        md5Sprite('png');
    }

    if (config.sprite.svg) {
        md5Sprite('svg');
    }

    return gulp.src(imageList)
        .pipe(md5Plus(10, cssfiles))
        .pipe(gulp.dest(paths.img_dist));
});

// sass 
gulp.task('sass', function () {
    const options = {
        sass: {
            outputStyle: 'expanded',
            indentType: 'tab',
            indentWidth: 1
        },
        postcss: [autoprefixer({
            browsers: autoprefixerBrowsers,
            grid: true
        })]
    };

    return gulp.src([
            path.join(paths.scss_src, '/**/*.scss'), path.join(paths.html_src, '/**/*.scss'), path.join(paths.markup_src, '/**/*.scss')
        ])
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(postcss(options.postcss))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.css_src))
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }));
});

// image 최적화 (png)
gulp.task('imagemin', () => {
    return gulp.src([
            path.join(paths.img_src, '**/*'),
            '!' + path.join(paths.img_src, 'fut/**/*'),
        ])
        .pipe(newer(path.join(paths.img_dist, '**/*')))
        .pipe(imagemin([
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imageminJpegRecom({
                loops: 4,
                min: 50,
                quality: 'high'
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest(paths.img_src));
});

// image 최적화 (svg)
gulp.task('svgmin', () => {
    return gulp.src(path.join(paths.svg_src, '**/*'))
        .pipe(svgo({
            plugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest(paths.img_src));
});

// watch task
gulp.task('watch', () => {
    gulp.watch([path.join(paths.scss_src, '/**/*'), path.join(paths.html_src, '/**/*')], ['sass']);
    gulp.watch(path.join(paths.js_src, '/**/*'), ['concat:js', reload]);
    gulp.watch([path.join(paths.sprite_png_src, '/**/*')], ['sprite']);
    gulp.watch([path.join(paths.sprite_svg_src, '/**/*')], ['spriteSvg']);
    gulp.watch([path.join(paths.markup_src, '/**/*')], ['fileinclude','sass']);
    gulp.watch([path.join(paths.svg_src, '/**/*')], ['svgmin']);
    gulp.watch([path.join(paths.html_src, '/**/*')], ['pug']);
});

// local server
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: paths.src,
            directory: true
        }
    });
    gulp.watch([path.join(paths.src, '/**/*.html')]).on("change", reload);
});

// css 압축
gulp.task('minify', [], () => {
    var cleanCssOption = {
        level: {
            2: {
                mergeSemantically: true
            }
        }
    };
    return gulp.src(path.join(paths.css_src, '*.css'))
        .pipe(cleanCss(cleanCssOption))
        .pipe(gulp.dest(paths.css_dist));
});

// dist 폴더 초기화
gulp.task('cleanDist', () => {
    return gulp.src(paths.dist, {
            read: false
        })
        .pipe(clean());
});

// src 폴더 dist 폴더로 복사
gulp.task('copy', function () {
    return gulp.src([
            path.join(paths.src, '*.html'),
            path.join(paths.img_src, '**/*'),
            path.join(paths.css_src, '*.css'),
            path.join(paths.js_src, '**/*')
        ], {
            base: paths.src
        })
        .pipe(gulp.dest(paths.dist));
});

gulp.task('concat:js', function () {
    return gulp // js 하위 디렉터리 내의 모든 자바스크립트 파일을 가져온다. 
        .src([path.join(paths.js_src, '/**/*.js')]) // 상단에서 참조한 concat 모듈을 호출하고 병합할 파일네이밍을 정의 
        //.pipe( concat('applications.js') ) // 위에서 수행한 task 를 배포지(dist)에 파일을 생성한다. 
        .pipe(gulp.dest(paths.js_src));
});

gulp.task('htmlBuild', ['copy'], () => {
    return gulp.src(path.join(paths.html_dist, '**/*.html'))
        .pipe(gulp.dest(path.join(paths.dist, 'html/')))
});

gulp.task('pug', () => {
    return gulp.src([
            path.join(paths.html_src, '**/*.pug'),
            '!' + path.join(paths.html_src, '_includes/*.pug'),
            '!' + path.join(paths.html_src, '_test/*.pug')
        ])
        .pipe(pug())
        .pipe(gulp.dest(path.join(paths.html_dist, '/')))
});

// dist html 정리
gulp.task('beautify', function (cb) {
    const option = {
        "preserve_newlines": false,
        "indent_size": 4,
        "indent_char": ' '
    };

    return gulp.src(path.join(paths.dist, 'html/pages/*.html'))
        .pipe(beautify.html(option))
        .pipe(gulp.dest(path.join(paths.dist, 'html/pages/')));
});

// ghpages upload
gulp.task('ghPages', function () {
    return gulp.src(path.join(paths.dist, '/**/*'))
        .pipe(ghPages());
});


// file list
gulp.task('ugoon_filelist', () => {
    ugoon_filelist();
});

// file include
gulp.task('fileinclude', function () {
    gulp.src([
            path.join(paths.markup_src, '/**/*.html'),
            '!' + path.join(paths.markup_src, '_includes/*.html')
        ], {
            base: './src/'
        })
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.join(paths.html_dist, '/')))
});