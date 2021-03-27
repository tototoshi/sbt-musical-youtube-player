.PHONY:\
	all \
	build \
	dist \
	clean \
	fmt \
	install \
	run \
	watch

.DEFAULT_GOAL := build

all: install fmt build run

run:
	./bin/sbt-musical-youtube-player
build:
	@npx tsc --project tsconfig.main.json
	@npx webpack --config webpack.preload.config.js
	@npx webpack --config webpack.renderer.config.js
dist: clean
	@NODE_ENV=production npx tsc --project tsconfig.main.json
	@NODE_ENV=production npx webpack --config webpack.preload.config.js
	@NODE_ENV=production npx webpack --config webpack.renderer.config.js
	#npm publish --access public
watch:
	(npx tsc --project tsconfig.main.json -w &) &&\
	(npx webpack --config webpack.preload.config.js -w &) &&\
	(npx webpack --config webpack.renderer.config.js -w &)
fmt:
	@npx prettier . --write
install:
	@npm install

test:
	@npx jest

clean:
	rm -rf dist/

ci: install fmt build test
