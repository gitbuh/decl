all: decl

decl:
	@echo Compressing decl...
	@java -jar ~/Projects/closure-compiler/compiler.jar --externs src/externs.js --compilation_level ADVANCED_OPTIMIZATIONS src/decl.js  > dist/decl.min.js
