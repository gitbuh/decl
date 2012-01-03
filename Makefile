all: decl

decl:
	@echo Compressing decl...
	@yui-compressor src/decl.js > dist/decl.min.js
