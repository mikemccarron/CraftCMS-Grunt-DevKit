Grunt workflow for Craft builds.
================================
A Grunt development workflow designed for working within a Craft (https://buildwithcraft.com) project.

Overview
--------
This is intended to be starting point for developing websites built with Craft.

Basically, this is what this does:

* Creates a development enviroment that includes a set of common folders and empty initial files. The files and folder structure is based on my own personal perferences but you can modified it Gruntfile.js
* Automatically downloads the lastest version of jQuery, Modernizr, Normalize and GASP (TweenMax) from Bower.
* Handles concatenating scripts and minifying files and images.
* Minifies JPG, GIF, PNG, and SVG files.
* Checks your JavaScript against with JSHint.

Thanks to all the great developers who created plugins that made this possible.

Requirements
------------
If you're reading this then you probably have an idea of whats required to get started.

You'll need to have [Node.js](http://nodejs.org) and [NPM](https://www.npmjs.org) (Node Packaged Modules) installed.

Setup and Installation
----------------------
First thing to do is install the required local dependencies:

```bash
npm install
```

Then setup your local build by running the following:
```bash
grunt install
```

Grunt Tasks
-----------
* `grunt install` — Runs setup script - which creates a `development` folder, sub folders for `js`, `fonts`, `sass`, and `img`. Creates new split .scss files and new scripts.js. Downloads latest versions of common libraies from Bower, download normalize.scss and move it into the `sass` folder. Remove Bower folder. Copies all files and directories into the Craft `public` folder. This will not transfer Sass files or the Sass folder. Finally, it renders a inital copy of styles.css to public/css/.
* `grunt` (default) — Watches for SASS and JS changes. Rendered minified version to the `public` folder. JavaScript is stripped of all console.logs calls. When new images are added to `development/img/`, those images are copied to the the `public` folder and minified.
