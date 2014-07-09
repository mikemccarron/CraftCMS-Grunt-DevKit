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
			},
			public:{
				assets: [
					{ folder: 'css' },
					{ folder: 'js' },
					{ folder: 'js/libs' },
					{ folder: 'js/plugins' },
					{ folder: 'fonts' },
					{ folder: 'img' },
				]
			}
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
			}
		},

		clean:{
			bowerFiles: ['development/js/libs/normalize-scss/']
		},

		compass: {
			dist:{
				options: {
					sassDir: './development/sass',
					cssDir: './public/css',
					outputStyle: 'compressed',
					environment: 'production',
					clean: true
				}
			},
			dev:{
				options: {
					sassDir: './development/sass',
					cssDir: './public/css',
					outputStyle: 'expanded',
					environment: 'development'
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'js/plugins.min.js': ['<%= concat.dist.dest %>']
				}
			},
			src:{
				files: {
					'js/scripts.min.js': ['js/_src/scripts.js']
				}
			}
		},

		jshint:{
			files: ['js/**/*.js']
		},

		concat: {
			options: {
				 separator: ';'
			},
			dist: {
				src: 'js/plugins/**/*.js',
				dest: '../public/js/plugins/plugins.js'
			}
		},

		imagemin:{
			dynamic:{
				files: [{
					expand: true,
					cwd: 'img/prod/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'img/'
				}]
			}
		},

		watch: {
			grunt: {
				files: ['Gruntfile.js'],
				options: {
					reload: true
				}
			},
			imagemin:{
				files: ['img/prod/**/**'],
				tasks: ['imagemin'],
			},
			compass: {
				files: 'sass/**/*.scss',
				tasks: ['compass'],
				options:{
					livereload: true
				}
			},
			uglify:{
				files: ['js/_src/scripts.js'],
				tasks: ['uglify:src'],
				options:{
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-concurrent');
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

	// grunt.registerTask('install', ['setup', 'bower', 'copy:copyFiles', 'clean:bowerFiles', 'compass:dev']);
	grunt.registerTask('renderCSS', ['compass:dev']);
	// grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'watch']);
}