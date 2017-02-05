var path = require("path"),
    del = require("del"),
    gulp = require("gulp"),
    minifyHtml = require("gulp-minify-html"),
    uglify = require("gulp-uglify"),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    sass = require("gulp-sass"),
    uglifycss = require("gulp-uglifycss"),
    gulpSequence = require("gulp-sequence"),
    concat = require("gulp-concat"),
    webpack = require("gulp-webpack");



// for console resources
var consoleSrc = {
    root: "static",
    script: "static/index.js",
    style: "static/**/*.scss",
    html: "static/*.html",

    resources: "static/resources/**/*",
};
var consoleDist = {
    root: "dist/",
};

var webpackConfig = {
    output: {
        filename: "index.js",
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "html?attrs=false&minimize=true&conservativeCollapse=false",
        }]
    },
    resolve: {
        alias: {
            "common": path.resolve(consoleSrc.root, "./common"),
            "components": path.resolve(consoleSrc.root, "./components"),
            "services": path.resolve(consoleSrc.root, "./services"),
        }
    }
};

gulp.task("console.script", function() {
    return gulp.src(consoleSrc.script)
        .pipe(webpack(webpackConfig))
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest(consoleDist.root))
        .pipe(rev.manifest("rev-manifest-js.json"))
        .pipe(gulp.dest(consoleDist.root));
});

gulp.task("console.style", function() {
    return gulp.src(consoleSrc.style)
        .pipe(sass({ includePaths: [path.resolve(consoleSrc.root)] }))
        .pipe(concat("index.css"))
        .pipe(rev())
        .pipe(uglifycss())
        .pipe(gulp.dest(consoleDist.root))
        .pipe(rev.manifest("rev-manifest-css.json"))
        .pipe(gulp.dest(consoleDist.root));
});

gulp.task("console.html", function() {
    return gulp.src([path.join(consoleDist.root, "*.json"), consoleSrc.html])
        .pipe(revCollector())
        .pipe(minifyHtml())
        .pipe(gulp.dest(consoleDist.root));
});

gulp.task("console.resources", function() {
    return gulp.src(consoleSrc.resources, { base: "static/resources" })
        .pipe(gulp.dest(consoleDist.root));
});


gulp.task("console.build", gulpSequence(["console.script", "console.style"], ["console.html", "console.resources"]));
// console end



gulp.task("clean", function() {
    return del(["dist/*"]);
});

gulp.task("build", gulpSequence("clean", "console.build"));


gulp.task("watch", function() {

    var browserSync = require("browser-sync");

    browserSync.init({
        proxy: "localhost:4000",
        port: 3000,
        notify: false,
        open: false,
    });

    function update(task) {
        return function(event) {
            console.log("update file : " + event.path);
            gulpSequence(task, browserSync.reload)
        }
    }

    gulp.watch(consoleSrc.html, update("console.html"));
    gulp.watch(consoleSrc.style, update("console.style"));
    gulp.watch(["static/**/*.js", "static/**/*.html"], update("console.script"));
});

gulp.task("dev", gulpSequence("build", "watch"));
