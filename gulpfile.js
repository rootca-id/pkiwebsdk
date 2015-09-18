'use strict';
var gulp = require("gulp");
var rimraf = require("gulp-rimraf");
var htmlToJs = require("gulp-html-to-js");

gulp.task("clean", function(){
  return gulp.src("html/*.js", {read:false})
    .pipe(rimraf({force:true}));
})
gulp.task("html", function(){
  return gulp.src("html/src/*")
    .pipe(htmlToJs({concat: 'html.js'}))
    .pipe(gulp.dest("html"));
})

var tasks = ["clean", "html"];
gulp.task("default", tasks);


