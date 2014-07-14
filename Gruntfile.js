module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		meta:{
			dev: 'development',
			dist: 'public'
		},

		setup:{
			structure:{
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
		},

		bower:{
			install: {
				options: {
					cleanup: true,
					targetDir: './<%= meta.dev %>/js/libs'
				}
			}
		},

		copy:{
			copyFiles: {
				files: [
					 {
						expand: true,
						flatten: true,
						src: ['<%= meta.dev %>/js/libs/normalize-scss/*.scss'],
						dest: '<%= meta.dev %>/sass',
						filter: 'isFile'
					 }
				]
			},
			public: {
				files: [
					 {
						expand: true,
						flatten: false,
						cwd: './<%= meta.dev %>/',
						src: ['**', '!sass/**', '!**/scripts.js'],
						dest: '<%= meta.dist %>/'
					 }
				]
			},
			images:{
				files: [
					 {
						expand: true,
						flatten: false,
						cwd: './<%= meta.dev %>/',
						src: ['img/**'],
						dest: '<%= meta.dist %>/'
					 }
				]
			}
		},

		clean:{
			bowerFiles: ['<%= meta.dev %>/js/libs/normalize-scss/']
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
					sassDir: './<%= meta.dev %>/sass',
					cssDir: './<%= meta.dist %>/css',
					outputStyle: 'compressed',
					environment: 'production'
				}
			},
			dev:{
				options: {
					sassDir: './<%= meta.dev %>/sass',
					cssDir: './<%= meta.dist %>/css',
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
					cwd: '<%= meta.dev %>/js',
					src: '*.js',
					dest: '<%= meta.dist %>/js'
				}]
			},
			plugins:{
				options: {
					mangle: {
						except: ['jQuery', 'Backbone']
					}
				},
				files: [{
					expand: true,
					cwd: '<%= meta.dist %>/js/plugins',
					src: 'plugins.min.js',
					dest: './<%= meta.dist %>/js/plugins'
				}]
			}
		},

		jshint:{
			files: ['<%= meta.dev %>/js/*.js']
		},

		concat: {
			options: {
				 separator: ';'
			},
			plugins: {
				src: './<%= meta.dev %>/js/plugins/**/*.js',
				dest: './<%= meta.dist %>/js/plugins/plugins.min.js'
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
						cwd: './<%= meta.dev %>/img/',
						src: ['**/*.png'],
						dest: '<%= meta.dist %>/img/',
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
						cwd: './<%= meta.dev %>/img/',
						src: ['**/*.jpg'],
						dest: '<%= meta.dist %>/img/',
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
						cwd: './<%= meta.dev %>/img/',
						src: ['**/*.gif'],
						dest: '<%= meta.dist %>/img/',
						ext: '.gif'
					}
				]
			},

			svg:{
				files: [
					{
						expand: true,
						cwd: './<%= meta.dev %>/img/',
						src: ['**/*.svg'],
						dest: '<%= meta.dist %>/img/',
						ext: '.svg'
					}
				]
			}
		},

		watch: {
			imagemin:{
				files: ['<%= meta.dev %>/img/**'],
				tasks: ['newer:imagemin'],
			},
			js:{
				files: ['<%= meta.dev %>/js/*.js'],
				tasks: ['jshint', 'uglify:js']
			},
			newPlugins:{
				files: ['<%= meta.dev %>/js/plugins/**'],
				tasks: ['concat:plugins', 'uglify:plugins']
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

	grunt.registerMultiTask('setup', 'Setup project structure', function(dev, dist, structure) {
		var assets 		= this.data.assets;
		var dev 		= grunt.config('meta.dev');
		var dist 		= grunt.config('meta.dist');
		var devFolder;
		var distFolder;

		assets.forEach(function( asset ){
			var folder 		= asset.folder;
			var files 		= asset.files;

			devFolder 	= dev + '/' + folder;
			distFolder	= dist + '/' + folder;

			grunt.log.writeln('Created folder: ' + dev + '/' + folder);
			grunt.file.mkdir( devFolder );

			if(folder!='sass'){
				grunt.log.writeln('Created folder: ' + dist + '/' + folder);
				grunt.file.mkdir( distFolder);
			}

			if(files){
				files.forEach(function( file ){
					var contents = '';
					var path = dev + '/' + folder + '/' + file;

					if(file=='styles.scss'){
						contents += '@import "compass/css3";\n';
						contents += '@import "settings";\n';
						contents += '@import "functions";\n';
						contents += '@import "mixins";\n';
						contents += '@import "colors";\n';
						contents += '@import "typography";\n';
					}

					grunt.log.writeln('\tAdded file: ' + file);
					grunt.file.write( path, contents );
				})
			}
		});
	});

	grunt.registerTask('install', ['setup', 'bower', 'copy:copyFiles', 'clean:bowerFiles', 'copy:public', 'compass:dist', 'uglify:js', 'concat:plugins', 'uglify:plugins']);
	grunt.registerTask('debug', ['watch:newPlugins']);
	grunt.registerTask('default', ['watch']);
}