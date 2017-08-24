# Default-Target
all: bundle


# Cleans previous installations
clean-dependencies:
	if [ -d 'node_modules' ]; then	\
		rm -rf 'node_modules';		\
	fi


# Resolves all dependencies
install-dependencies: clean-dependencies
	npm install


# Removes build artifacts
clean:
	if [ -d 'target' ]; then	\
		rm -rf 'target';		\
	fi
	mkdir 'target'


# Converts TypeScript sources to JavaScript
build: clean
	./node_modules/.bin/webpack

	# Files references by package.json/bin must start with shebang
	echo '#!/usr/bin/env node' > target/cli.js
	cat target/main.js >> target/cli.js


# Execute test cases
test: build
	nodejs target/JsYamlTest.js


# Do everything from scratch
bundle: install-dependencies build test
	npm pack
	mv parent-project-*.tgz target/
