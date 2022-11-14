const config = require("./gulp.config.js");

/**
 * Load Plugins.
 *
 * Load gulp plugins and passing them semantic names.
 */
const gulp = require("gulp"); // Gulp of-course.

// CSS related plugins.
const sass = require("gulp-sass")(require("sass")); // Gulp plugin for Sass compilation.
const autoprefixer = require("gulp-autoprefixer"); // Autoprefixing magic.
const sassIncl = require("sass-include-paths");
const nodeSassGlobbing = require("node-sass-globbing");
const cleanCSS = require("gulp-clean-css");

// JS related plugins.
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");

// Image related plugins.
const imagemin = require("gulp-imagemin"); // Minify PNG, JPEG, GIF and SVG images with imagemin.

//Handle Bars
const fs = require("fs");
const handlebars = require("gulp-compile-handlebars");

// Utility related plugins.
const rename = require("gulp-rename"); // Renames files E.g. style.css -> style.min.css.
const lineec = require("gulp-line-ending-corrector"); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings).
const filter = require("gulp-filter"); // Enables you to work on a subset of the original files by filtering them using a glob.
const sourcemaps = require("gulp-sourcemaps"); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css).
const notify = require("gulp-notify"); // Sends message notification to you.
const browserSync = require("browser-sync").create(); // Reloads browser and injects CSS. Time-saving synchronized browser testing.
const cache = require("gulp-cache"); // Cache files in stream for later use.
const plumber = require("gulp-plumber"); // Prevent pipe breaking caused by errors from gulp plugins.
const beep = require("beepbeep");
const copy = require("gulp-copy");

const scssIncludePaths = [] // additional include paths
  .concat(sassIncl.nodeModulesSync());

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 * @link http://www.browsersync.io/docs/options/
 *
 * @param {Mixed} done Done.
 */
const browsersync = (done) => {
  browserSync.init({
    server: {
      baseDir: "./dist/",
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
    open: false,
    injectChanges: true,
    watchEvents: ["change", "add", "unlink", "addDir", "unlinkDir"],
  });
  done();
};

/**
 * Custom Error Handler.
 *
 * @param Mixed err
 */
const errorHandler = (r) => {
  notify.onError("\n\n❌  ===> ERROR: <%= error.message %>\n")(r);
  beep();

  // this.emit('end');
};

// Helper function to allow browser reload with Gulp 4.
const reload = (done) => {
  browserSync.reload();
  done();
};

/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
gulp.task("styles", () => {
  return gulp
    .src(config.styleSRC, { allowEmpty: true })
    .pipe(plumber(errorHandler))
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        importer: nodeSassGlobbing,
        includePaths: scssIncludePaths,
        errLogToConsole: config.errLogToConsole,
        outputStyle: config.outputStyle,
        precision: config.precision,
      })
    )
    .on("error", sass.logError)
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(autoprefixer(config.BROWSERS_LIST))
    .pipe(sourcemaps.write("./"))
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.styleDestination))
    .pipe(filter("**/*.css")) // Filtering stream to only css files.
    .pipe(browserSync.stream()) // Reloads style.css if that is enqueued.
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.styleDestination))
    .pipe(filter("**/*.css")) // Filtering stream to only css files.
    .pipe(browserSync.stream()) // Reloads style.min.css if that is enqueued.
    .pipe(
      notify({
        message: "\n\n✅  ===> STYLES — completed!\n",
        onLast: true,
      })
    );
});

/**
 * Task: `customJS`.
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates custom.min.js
 */
gulp.task("customJS", () => {
  return gulp
    .src(config.jsCustomSRC, { since: gulp.lastRun("customJS") })
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(config.jsCustomDestination))
    .pipe(
      notify({
        message: "\n\n✅  ===> CUSTOM JS — completed!\n",
        onLast: true,
      })
    );
});

/**
 * Task: `images`.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task does the following:
 *     1. Gets the source of images raw folder
 *     2. Minifies PNG, JPEG, GIF and SVG images
 *     3. Generates and saves the optimized images
 *
 * This task will run only once, if you want to run it
 * again, do it with the command `gulp images`.
 *
 * Read the following to change these options.
 * @link https://github.com/sindresorhus/gulp-imagemin
 */
gulp.task("images", () => {
  return gulp
    .src(config.imgSRC)
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }), // 0-7 low-high.
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
    )
    .pipe(gulp.dest(config.imgDST))
    .pipe(
      notify({
        message: "\n\n✅  ===> IMAGES — completed!\n",
        onLast: true,
      })
    );
});

/**
 * Task: `clear-images-cache`.
 *
 * Deletes the images cache. By running the next "images" task,
 * each image will be regenerated.
 */
gulp.task("clearCache", function (done) {
  return cache.clearAll(done);
});

/**
 * Task: `html`.
 *
 * Compiles Handlebars HTML
 */
gulp.task("html", () => {
  return gulp
    .src(config.htmlPages)
    .pipe(
      handlebars(
        {},
        {
          ignorePartials: true,
          batch: [config.htmlPartials],
          helpers: {
            inline: function (file) {
              return fs.readFileSync(file, "utf8");
            },
          },
        }
      )
    )
    .pipe(
      rename({
        extname: ".html",
      })
    )
    .pipe(gulp.dest(config.htmlDestination, { dirMode: true }));
});

gulp.task("copy-videos", () =>
  gulp.src("./src/videos/*").pipe(gulp.dest(config.videosDST))
);
gulp.task("copy-fonts", () =>
  gulp.src("./src/fonts/*").pipe(gulp.dest(config.fontsDST))
);

gulp.task("copy-sw", () =>
  gulp.src("./src/service-worker.js").pipe(gulp.dest(config.generalDST))
);

gulp.task("copy-manifest", () =>
  gulp.src("./src/manifest.json").pipe(gulp.dest(config.generalDST))
);

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
gulp.task(
  "default",
  gulp.parallel(
    "styles",
    "customJS",
    "images",
    "html",
    // "copy-videos",
    // "copy-sw",
    // "copy-manifest",
    "copy-fonts",
    browsersync,
    () => {
      gulp.watch(config.watchHTML, reload); // Reload on PHP file changes.
      gulp.watch(config.watchTwig, reload); // Reload on PHP file changes.
      gulp.watch(config.watchHBS, gulp.series("html", reload)); // Reload on PHP file changes.
      gulp.watch(config.watchPhp, reload); // Reload on PHP file changes.
      gulp.watch(config.watchStyles, gulp.parallel("styles")); // Reload on SCSS file changes.
      gulp.watch(config.watchJsCustom, gulp.series("customJS", reload)); // Reload on customJS file changes.
      gulp.watch(config.imgSRC, gulp.series("images", reload)); // Reload on customJS file changes.
      // gulp.watch("./src/service-worker.js", gulp.series("copy-sw")); // Reload on customJS file changes.
      // gulp.watch("./src/manifest.json", gulp.series("copy-manifest")); // Reload on customJS file changes.
    }
  )
);
