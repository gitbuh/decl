all: decl

decl:
	@echo Compressing decl...
	@java -jar ~/Projects/closure-compiler/compiler.jar src/decl.js  > dist/decl.min.js
