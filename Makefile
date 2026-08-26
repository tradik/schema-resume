# Schema Resume — specification, validator packages and the site that documents them.
#
# The site is built by spagu/ssg (https://github.com/spagu/ssg), a Go static
# site generator installed separately:
#
#     brew install spagu/tap/ssg     # or: see docs/SETUP.md
#
# Node is needed only to vendor the browser libraries (Ajv, Chart.js, Mermaid,
# the XSLT processor and the icon set) so nothing is fetched from a CDN at
# runtime. `make site` does all of it.

SHELL := /bin/bash
.DEFAULT_GOAL := help

SSG        ?= ssg
SSG_CONFIG ?= .ssg.yaml
OUTPUT_DIR ?= output
PORT       ?= 8888

# Production builds minify and fingerprint; local builds stay readable so the
# generated HTML can be diffed and inspected.
RELEASE_FLAGS := --minify-all --fingerprint

.PHONY: help
help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

# ─── Site ───────────────────────────────────────────────────────────────────

.PHONY: install
install: ## Install the Node build dependencies
	npm ci

.PHONY: assets
assets: ## Vendor the browser libraries and inline the icon set
	npm run build:assets

.PHONY: site
site: assets ## Build the site into output/
	$(SSG) --config $(SSG_CONFIG) --clean

.PHONY: site-release
site-release: assets ## Build the site minified and fingerprinted, as CI does
	$(SSG) --config $(SSG_CONFIG) --clean $(RELEASE_FLAGS)

.PHONY: serve
serve: assets ## Build and serve on http://127.0.0.1:$(PORT), rebuilding on change
	$(SSG) --config $(SSG_CONFIG) --clean --http --port=$(PORT) --watch

.PHONY: check-links
check-links: assets ## Fail the build on a dead internal link
	$(SSG) --config $(SSG_CONFIG) --clean --check-links=strict

.PHONY: freeze-version
freeze-version: ## Snapshot the current specification into versions/<MAJOR.MINOR>/
	@v=$$(node -p "require('./package.json').version.split('.').slice(0,2).join('.')"); \
	mkdir -p versions/$$v; \
	cp schema.json meta-schema.json context.jsonld example.json \
	   example-minimal.json example-with-local-context.json versions/$$v/; \
	cp xml/1.0/schema-resume.xsd versions/$$v/; \
	echo "frozen versions/$$v/ — add it to static_sources in .ssg.yaml"

.PHONY: og-image
og-image: ## Re-render the social card PNG from its SVG source
	rsvg-convert -w 1200 -h 630 \
		templates/schema-resume/images/og-image.svg \
		-o templates/schema-resume/images/og-image.png

# ─── Specification ──────────────────────────────────────────────────────────

.PHONY: validate
validate: ## Lint and cross-check every schema file
	./tools/validate-all.sh

.PHONY: lint
lint: ## Lint the schema files only
	./tools/run-lint.sh

.PHONY: compare
compare: ## Compare fields across schema.json, the context, meta-schema and XSD
	./tools/run-comparison.sh

.PHONY: sync
sync: ## Copy the schema files into every language package
	./tools/sync-schema-files.sh

.PHONY: test
test: ## Run the schema tests and the package test suites
	npm test
	./tools/test-packages.sh

# ─── Housekeeping ───────────────────────────────────────────────────────────

.PHONY: clean
clean: ## Remove generated output, staged files and vendored libraries
	rm -rf $(OUTPUT_DIR) .ssg-cache
	rm -rf templates/schema-resume/js/vendor templates/schema-resume/partials/icons.html editor/vendor

.PHONY: distclean
distclean: clean ## Also remove installed dependencies
	rm -rf node_modules
