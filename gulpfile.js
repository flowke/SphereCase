const gulp = require('gulp');

const browserSync = require('browser-sync').create();

gulp.task('bs', ()=>{
    browserSync.init({
        server:{
            baseDir: "./dist"
        },
        files: ['dist/*.html','dist/assets/**']
    });
})
