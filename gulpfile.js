let gulp = require("gulp"),
    del = require("del"),
    minifyHtml = require("gulp-minify-html"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    uglifycss = require("gulp-uglifycss"),
    concat = require("gulp-concat"),
    gulpSequence = require("gulp-sequence"),
    webpack = require("webpack-stream");


// for console resources
let srcPath = {
    script: "static/src/index.js",
    html: "static/src/*.html",
    style: "static/src/**/*.scss",
    resource: "static/src/resources/*",
};
let distPath = {
    root: "static/dist"
};

let webpackConfig = {
    output: {
        filename: "index.js",
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "html?attrs=false&minimize=true&conservativeCollapse=false",
        }]
    },

}

gulp.task("script", function() {
    return gulp.src(srcPath.script)
        .pipe(webpack(webpackConfig))
        // .pipe(uglify())
        .pipe(gulp.dest(distPath.root));
});

gulp.task("style", function() {
    return gulp.src(srcPath.style)
        .pipe(sass())
        .pipe(uglifycss())
        .pipe(concat("index.css"))
        .pipe(gulp.dest(distPath.root))
});

gulp.task("html", function() {
    return gulp.src(srcPath.html)
        .pipe(minifyHtml())
        .pipe(gulp.dest(distPath.root));
});

gulp.task("resource", function() {
    return gulp.src(srcPath.resource, { base: "static/src/resources" })
        .pipe(gulp.dest(distPath.root));
});

// clean
gulp.task("clean", function() {
    return del(["static/dist/*"]);
});

// build
gulp.task("build", gulpSequence("clean", ["script", "style", "html", "resource"]));

// for debug
gulp.task("watch", function() {

    let browserSync = require("browser-sync");

    browserSync.init({
        proxy: "localhost:4000",
        port: 3000,
        notify: false,
        open: false,
    });

    gulp.watch(srcPath.html, ["html"]);
    gulp.watch(srcPath.style, ["style"]);
    gulp.watch(["static/src/**/*.js", "static/src/*/**/*.html"], ["script"]);

    gulp.watch([distPath.root + "/*"], browserSync.reload);
});

gulp.task("dev", gulpSequence("build", "watch"));
