const path = require("path");
const del = require("del");
const gulp = require("gulp");
const minifyHtml = require("gulp-htmlmin");
const butternut = require("gulp-butternut");
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const sass = require("gulp-sass");
const uglifycss = require("gulp-uglifycss");
const concat = require("gulp-concat");
const webpack = require("webpack-stream");

// for static resources
const staticSrc = {
    "entryjs": "static/index.js",
    "entryhtml": "static/*.html",
    "root": "static",
    "script": "static/**/*.js",
    "style": "static/**/*.scss",
    "html": "static/**/*.html",

    "resources": "static/resources/**/*",
};
const staticDist = {
    "root": "dist/",
};

const webpackConfig = {
    "mode": "none",
    "output": {
        "filename": "index.js",
    },
    "module": {
        "rules": [{
            "test": /\.html$/,
            "loader": "html-loader?attrs=false&minimize=true&conservativeCollapse=false",
        }],
    },
    "resolve": {
        "alias": {
            "common": path.resolve(staticSrc.root, "./common"),
            "components": path.resolve(staticSrc.root, "./components"),
            "services": path.resolve(staticSrc.root, "./services"),
        },
    },
};

gulp.task("static.script", function () {
    return gulp.src(staticSrc.entryjs)
        .pipe(webpack(webpackConfig))
        .pipe(rev())
        .pipe(butternut())
        .pipe(gulp.dest(staticDist.root))
        .pipe(rev.manifest("rev-manifest-js.json"))
        .pipe(gulp.dest(staticDist.root));
});

gulp.task("static.style", function () {
    return gulp.src(staticSrc.style)
        .pipe(sass({"includePaths": [path.resolve(staticSrc.root)]}))
        .pipe(concat("index.css"))
        .pipe(rev())
        .pipe(uglifycss())
        .pipe(gulp.dest(staticDist.root))
        .pipe(rev.manifest("rev-manifest-css.json"))
        .pipe(gulp.dest(staticDist.root));
});

gulp.task("static.html", function () {
    return gulp.src([path.join(staticDist.root, "*.json"), staticSrc.entryhtml])
        .pipe(revCollector())
        .pipe(minifyHtml({collapseWhitespace: true}))
        .pipe(gulp.dest(staticDist.root));
});

gulp.task("static.resources", function () {
    return gulp.src(staticSrc.resources, {"base": "static/resources"})
        .pipe(gulp.dest(staticDist.root));
});

gulp.task("static.build", gulp.series(
    gulp.parallel("static.script", "static.style"),
    gulp.parallel("static.html", "static.resources")
));
// static end

gulp.task("clean", function () {
    return del(["dist/*"]);
});

gulp.task("build", gulp.series("clean", "static.build"));

gulp.task("watch", function () {
    const browserSync = require("browser-sync");
    browserSync.init({"proxy": "localhost:4000", "port": 3000, "notify": false, "open": false});
    function reload(done) {
        browserSync.reload();
        done();
    }
    function watchlog(event, file) {
        console.log(event + " file: " + file);
    }
    function update(...task) {
        return gulp.series(...task, reload);
    }

    gulp.watch([staticSrc.entryhtml, staticSrc.html], update("static.html")).on("all", watchlog);
    gulp.watch(staticSrc.style, update("static.style", "static.html")).on("all", watchlog);
    gulp.watch([staticSrc.entryjs, staticSrc.script], update("static.script", "static.html")).on("all", watchlog);
});

gulp.task("dev", gulp.series("build", "watch"));
