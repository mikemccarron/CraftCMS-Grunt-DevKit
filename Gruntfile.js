module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bower:{
			install: {
				options: {
					cleanup: true,
					targetDir: './development/js/libs'
				}
			}
		},

		setup:{
			development:{
				assets: [
					{
						folder: 'sass',
						files: [
							'styles.scss',
							'_colors.scss',
							'_typography.scss',
							'_functions.scss',
							'_mixins.scss',
							'_settings.scss',
							'_ie.scss'
						]
					},
					{
						folder: 'js',
						files: [
							'scripts.js'
						]
					},
					{
						folder: 'js/plugins'
					},
					{
						folder: 'fonts'
					},
					{
						folder: 'img'
					}
				]
			}
			// ,
			// public:{
			// 	assets: [
			// 		{ folder: 'css' },
			// 		{ folder: 'js' },
			// 		{ folder: 'js/libs' },
			// 		{ folder: 'js/plugins' },
			// 		{ folder: 'fonts' },
			// 		{ folder: 'img' },
			// 	]
			// }
		},

		copy:{
			copyFiles: {
				files: [
					 {
						expand: true,
						flatten: true,
						src: ['development/js/libs/normalize-scss/*.scss'],
						dest: 'development/sass',
						filter: 'isFile'
					 }
				]
			},
			public: {
				files: [
					 {
						expand: true,
						flatten: false,
						cwd: './development/',
						src: ['**', '!sass/**', '!**/scripts.js'],
						dest: 'public/'
					 }
				]
			},
			images:{
				files: [
					 {
						expand: true,
						flatten: false,
						cwd: './development/',
						src: ['img/**'],
						dest: 'public/'
					 }
				]
			}
		},

		clean:{
			bowerFiles: ['development/js/libs/normalize-scss/']
		},

		concurrent: {
			dev: {
				options: {
					logConcurrentOutput: true
				},
				tasks: ['compass:dev']
			}
		},

		compass: {
			dist:{
				options: {
					sassDir: './development/sass',
					cssDir: './public/css',
					outputStyle: 'compressed',
					environment: 'production'
				}
			},
			dev:{
				options: {
					sassDir: './development/sass',
					cssDir: './public/css',
					outputStyle: 'expanded',
					environment: 'development',
					watch: true
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				compress: {
					drop_console: true
				},
				sourceMap: true,
				preserveComments: false
			},
			js:{
				options: {
					mangle: {
						except: ['jQuery', 'Backbone']
					}
				},
				files: [{
					expand: true,
					cwd: 'development/js',
					src: '*.js',
					dest: 'public/js'
				}]
			}
		},

		// jshint:{
		// 	files: ['js/**/*.js']
		// },

		concat: {
			options: {
				 separator: ';'
			},
			dist: {
				src: './development/js/plugins/**/*.js',
				dest: './public/js/plugins/plugins.js'
			}
		},

		imagemin:{
			png:{
				options: {
					optimizationLevel: 3
				},
				files: [
					{
						expand: true,
						cwd: './development/img/',
						src: ['**/*.png'],
						dest: 'public/img/',
						ext: '.png'
					}
				]
			},

			jpg:{
				options: {
					 progressive: true
				},
				files: [
					{
						expand: true,
						cwd: './development/img/',
						src: ['**/*.jpg'],
						dest: 'public/img/',
						ext: '.jpg'
					}
				]
			},

			gif:{
				options: {
					interlaced: true
				},
				files: [
					{
						expand: true,
						cwd: './development/img/',
						src: ['**/*.gif'],
						dest: 'public/img/',
						ext: '.gif'
					}
				]
			},

			svg:{
				files: [
					{
						expand: true,
						cwd: './development/img/',
						src: ['**/*.svg'],
						dest: 'public/img/',
						ext: '.svg'
					}
				]
			}
		},

		watch: {
			// concat:{
			// 	files: ['./development/js/plugins/**'],
			// 	tasks: ['newer:concat:dist']
			// },
			imagemin:{
				files: ['development/img/**'],
				tasks: ['newer:imagemin'],
			},
			uglify:{
				files: ['development/js/*.js'],
				tasks: ['uglify:js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerMultiTask('setup', 'Setup project structure', function() {

		var basePath 	= './'+ this.target +'/';
		var assets 		= this.data.assets;

		assets.forEach(function( asset ){
			var folder 	= asset.folder;
			var files 	= asset.files;
			var path 	= basePath + folder + '/';

			grunt.log.writeln('Created folder: ' + path);
			grunt.file.mkdir( path );

			if(files){
				files.forEach(function( file ){
					var contents = '';

					if(file=='styles.scss'){
						contents += '@import "compass/css3";\n';
						contents += '@import "settings";\n';
						contents += '@import "functions";\n';
						contents += '@import "mixins";\n';
						contents += '@import "colors";\n';
						contents += '@import "typography";\n';
					}

					grunt.log.writeln('Added file: ' + file);
					grunt.file.write( path + file, contents );
				})
			}
		});
	});

	grunt.registerTask('install', ['setup', 'bower', 'copy:copyFiles', 'clean:bowerFiles', 'copy:public', 'compass:dist']);
	grunt.registerTask('default', ['watch']);
}