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
	./scripts/build
dist: clean
	@NODE_ENV=production ./scripts/build
watch:
	./scripts/watch
fmt:
	@npx prettier . --write
install:
	@npm install
test:
	@npx jest
clean:
	rm -rf dist/

ci: install fmt build test
