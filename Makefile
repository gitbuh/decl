all: decl

decl:
	@echo Compressing decl...
	@yui-compressor src/decl.js > decl.min.js
