# SETUP

1. Navigate to this folder in a terminal.
2. Run `npm install`
3. After `npm install` has completed run `npm start`. This will start the gulp process that compresses the images, compiles the SCSS, HTML Handlebars and JS files and provides livereload on `http://localhost:3000`

The compiled code is compiled to /dist this is your distributable code. Anything edited in dist directly has the possibility of being overwritten by the code in /src when npm start is run. Changes should only be made in /src and then compiled to /dist.

You can also run single commands:

- `npm start styles` to compile just the SCSS
- `npm start images` to compile just the Images
- `npm start customJS` to compile just the JS

# JS

To add additional JS files see `webpack.config.js` and add to the entry section. NPM can be used to include additional libraries.
