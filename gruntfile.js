var mainFile = "src/*.ts";
var outFile = "bin/extension.js";
var libDefinitionDir = "src/lib/*.d.ts";
var libSourceDir = "src/lib/*.js";
var mainDir = "src/extension/*.ts";

var fs = require('fs');
module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			game: {
				src: [libDefinitionDir, mainDir, mainFile],
				out: outFile,
				options: {
					target: 'es5',
					comments: true,
					sourcemap: false
				}
			}
		},
		uglify: {
			app: {
				files: {
					"bin/lib.js": [libSourceDir]
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['ts']);
	grunt.registerTask('publish', ['ts', 'uglify']);
	// if (!fs) fs = require('fs');
	// var pkg = require("./"+pkgFile);
	// if (!pkg.build) pkg.build = 0;
	// pkg.build ++;
	// fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, "\t"));
	// console.log("HorribleGame build"+pkg.build);
};