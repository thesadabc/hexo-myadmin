const path = require("path");
const del = require("del");
const gulp = require("gulp");
const minifyHtml = require("gulp-minify-html");
const butternut = require("gulp-butternut");
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const sass = require("gulp-sass");
const uglifycss = require("gulp-uglifycss");
const concat = require("gulp-concat");
const webpack = require("gulp-webpack");

// for console resources
const consoleSrc = {
    "root": "static",
    "script": "static/index.js",
    "style": "static/**/*.scss",
    "html": "static/*.html",

    "resources": "static/resources/**/*",
};
const consoleDist = {
    "root": "dist/",
};

const webpackConfig = {
    "output": {
        "filename": "index.js",
    },
    "module": {
        "loaders": [{
            "test": /\.html$/,
            "loader": "html?attrs=false&minimize=true&conservativeCollapse=false",
        }],
    },
    "resolve": {
        "alias": {
            "common": path.resolve(consoleSrc.root, "./common"),
            "components": path.resolve(consoleSrc.root, "./components"),
            "services": path.resolve(consoleSrc.root, "./services"),
        },
    },
};

gulp.task("console.script", function () {
    return gulp.src(consoleSrc.script)
        .pipe(webpack(webpackConfig))
        .pipe(rev())
        .pipe(butternut())
        .pipe(gulp.dest(consoleDist.root))
        .pipe(rev.manifest("rev-manifest-js.json"))
        .pipe(gulp.dest(consoleDist.root));
});

gulp.task("console.style", function () {
    return gulp.src(consoleSrc.style)
        .pipe(sass({"includePaths": [path.resolve(consoleSrc.root)]}))
        .pipe(concat("index.css"))
        .pipe(rev())
        .pipe(uglifycss())
        .pipe(gulp.dest(consoleDist.root))
        .pipe(rev.manifest("rev-manifest-css.json"))
        .pipe(gulp.dest(consoleDist.root));
});

gulp.task("console.html", function () {
    return gulp.src([path.join(consoleDist.root, "*.json"), consoleSrc.html])
        .pipe(revCollector())
        .pipe(minifyHtml())
        .pipe(gulp.dest(consoleDist.root));
});

gulp.task("console.resources", function () {
    return gulp.src(consoleSrc.resources, {"base": "static/resources"})
        .pipe(gulp.dest(consoleDist.root));
});

gulp.task("console.build", gulp.series(
    gulp.parallel("console.script", "console.style"),
    gulp.parallel("console.html", "console.resources")
));
// console end

gulp.task("clean", function () {
    return del(["dist/*"]);
});

gulp.task("build", gulp.series("clean", "console.build"));

gulp.task("watch", function () {
    const browserSync = require("browser-sync");
    browserSync.init({"proxy": "localhost:4000", "port": 3000, "notify": false, "open": false});

    function watchlog(event, file) {
        console.log(event + " file: " + file);
    }

    function update(task) {
        return function () {
            return gulp.series(task, browserSync.reload);
        };
    }

    gulp.watch(consoleSrc.html, update("console.html")).on("all", watchlog);
    gulp.watch(consoleSrc.style, update("console.style")).on("all", watchlog);
    gulp.watch(["static/**/*.js", "static/**/*.html"], update("console.script")).on("all", watchlog);
});

gulp.task("dev", gulp.series("build", "watch"));
