'use strict';
var gulp = require("gulp");
var gulpSync = require("gulp-sync")(gulp);
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var rimraf = require("gulp-rimraf");
var htmlToJs = require("gulp-html-to-js");
var minify = require("gulp-minify");
var async = require("async");

gulp.task("clean", function(){
  return gulp.src("html/*.js", {read:false})
    .pipe(rimraf({force:true}));
})
gulp.task("html", function(){
  return gulp.src("html/src/*")
    .pipe(htmlToJs({concat: 'html.js'}))
    .pipe(minify())
    .pipe(gulp.dest("./html/"));
})
gulp.task("browserify", function(){
  return browserify("src/index.js")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("build"));
})
gulp.task("cleanPostBuild", function(){
  return gulp.src("html/html.js", {read:false})
    .pipe(rimraf({force:true}));
})

var tasks = ["clean", "html", "browserify", "cleanPostBuild"];
gulp.task("default", gulpSync.sync(tasks));


