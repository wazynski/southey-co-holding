module.exports = {
  // Style options.
  styleSRC: "./src/assets/scss/style.scss", // Path to main .scss file.
  // styleDestination: `./dist/${passwordHash}/css/`, // Path to place the compiled CSS file. Default set to root folder.
  styleDestination: `./dist/css/`, // Path to place the compiled CSS file. Default set to root folder.
  outputStyle: "compressed", // Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
  errLogToConsole: true,
  precision: 10,

  // JS Custom options.
  jsCustomSRC: "./src/assets/js/*.js", // Path to JS custom scripts folder.
  // jsCustomDestination: `./dist/${passwordHash}/js/`, // Path to place the compiled JS custom scripts file.
  jsCustomDestination: `./dist/js/`, // Path to place the compiled JS custom scripts file.
  jsCustomFile: "script", // Compiled JS custom file name. Default set to custom i.e. custom.js.

  // Images options.
  imgSRC: "./src/assets/images/raw/**/*", // Source folder of images which should be optimized and watched. You can also specify types e.g. raw/**.{png,jpg,gif} in the glob.
  // imgDST: `./dist/${passwordHash}/images/`, // Destination folder of optimized images. Must be different from the imagesSRC folder.
  imgDST: `./dist/images/`, // Destination folder of optimized images. Must be different from the imagesSRC folder.

  // fontsDST: `./dist/${passwordHash}/fonts/`, // Destination folder of general files
  fontsDST: `./dist/fonts/`, // Destination folder of general files
  // videosDST: `./dist/${passwordHash}/videos/`, // Destination folder of general files
  videosDST: `./dist/videos/`, // Destination folder of general files
  // generalDST: `./dist/${passwordHash}/`, // Destination folder of general files
  generalDST: `./dist/`, // Destination folder of general files

  htmlPages: "./src/pages/**/*.hbs",
  htmlPartials: "./src/partials",
  htmlDestination: "./dist",

  // Watch files paths.
  watchStyles: "./src/assets/scss/**/*.scss", // Path to all *.scss files inside css folder and inside them.
  watchJsVendor: "./src/assets/js/vendor/*.js", // Path to all vendor JS files.
  watchJsCustom: "./src/assets/js/*.js", // Path to all custom JS files.
  watchPhp: "./**/*.php", // Path to all PHP files.
  watchTwig: "./**/*.twig", // Path to all PHP files.
  watchHTML: "./**/*.html", // Path to all PHP files.
  watchHBS: "./**/*.hbs", // Path to all PHP files.

  // Browsers you care about for autoprefixing. Browserlist https://github.com/ai/browserslist
  BROWSERS_LIST: [
    "last 2 version",
    "> 1%",
    "ie >= 11",
    "last 1 Android versions",
    "last 1 ChromeAndroid versions",
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions",
    "last 2 iOS versions",
    "last 2 Edge versions",
    "last 2 Opera versions",
  ],
};
