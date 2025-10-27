#!/bin/bash

# Sync schema files to all package directories
# This replaces symlinks with actual file copies for better compatibility

set -e

echo "Syncing schema files to all packages..."

# Source files
SCHEMA_JSON="schema.json"
META_SCHEMA_JSON="meta-schema.json"
CONTEXT_JSONLD="context.jsonld"
SCHEMA_XSD="xml/1.0/schema-resume.xsd"
LICENSE="LICENSE"

# Function to copy files to a package
sync_to_package() {
    local package_dir=$1
    local schema_subdir=$2  # Optional subdirectory for schemas
    
    if [ -n "$schema_subdir" ]; then
        local target_dir="${package_dir}/${schema_subdir}"
        mkdir -p "$target_dir"
        
        echo "  → ${package_dir}/${schema_subdir}/"
        cp -f "$SCHEMA_JSON" "${target_dir}/schema.json"
        cp -f "$META_SCHEMA_JSON" "${target_dir}/meta-schema.json"
        cp -f "$CONTEXT_JSONLD" "${target_dir}/context.jsonld"
        cp -f "$SCHEMA_XSD" "${target_dir}/schema-resume.xsd"
    else
        echo "  → ${package_dir}/"
        cp -f "$SCHEMA_JSON" "${package_dir}/schema.json"
        cp -f "$META_SCHEMA_JSON" "${package_dir}/meta-schema.json"
        cp -f "$CONTEXT_JSONLD" "${package_dir}/context.jsonld"
        cp -f "$SCHEMA_XSD" "${package_dir}/schema-resume.xsd"
    fi
    
    # Always copy LICENSE to package root
    cp -f "$LICENSE" "${package_dir}/LICENSE"
}

# Sync to each package
echo ""
echo "NPM package:"
sync_to_package "packages/npm" ""

echo ""
echo "Python package:"
sync_to_package "packages/python" "src/schema_resume/schemas"

echo ""
echo "Go package:"
sync_to_package "packages/golang" "schemas"

echo ""
echo "Java package:"
sync_to_package "packages/java" "src/main/resources/schemas"

echo ""
echo "Ruby package:"
sync_to_package "packages/ruby" "schemas"

echo ""
echo "PHP package:"
sync_to_package "packages/php" "schemas"

echo ""
echo "✓ All schema files synced successfully!"
echo ""
echo "Note: Run this script whenever schema files are updated."
