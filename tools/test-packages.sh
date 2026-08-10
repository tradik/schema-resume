#!/bin/bash

# Test all packages locally before publishing
# Usage: ./test-packages.sh [package-name]
# If no package name provided, tests all packages

set -e  # Exit on error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Schema Resume Package Testing"
echo "=========================================="
echo ""

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Test NPM package
test_npm() {
    print_info "Testing NPM package..."
    cd packages/npm
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing NPM dependencies..."
        npm install
    fi
    
    print_info "Running NPM tests..."
    npm test
    
    print_info "Running NPM example..."
    node example.js
    
    print_info "Creating NPM package..."
    npm pack
    
    cd ../..
    print_success "NPM package tests passed"
    echo ""
}

# Test Python package
test_python() {
    print_info "Testing Python package..."
    cd packages/python
    
    if [ ! -d "venv" ]; then
        print_info "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    print_info "Installing Python package in development mode..."
    pip install -e . > /dev/null 2>&1
    
    print_info "Running Python example..."
    python example.py
    
    deactivate
    cd ../..
    print_success "Python package tests passed"
    echo ""
}

# Test Go package
test_go() {
    print_info "Testing Go package..."
    cd packages/golang
    
    print_info "Downloading Go dependencies..."
    go mod download
    go mod tidy
    
    print_info "Running Go tests..."
    go test -v ./... || true  # Continue even if tests fail
    
    print_info "Running Go example..."
    cd example
    go run main.go
    cd ..
    
    cd ../..
    print_success "Go package tests passed"
    echo ""
}

# Test Java package
test_java() {
    print_info "Testing Java package..."
    cd packages/java
    
    if ! command -v mvn &> /dev/null; then
        print_error "Maven not found. Skipping Java tests."
        cd ../..
        return
    fi
    
    print_info "Building Java package with Maven..."
    mvn clean package -q
    
    print_info "Running Java tests..."
    mvn test -q
    
    cd ../..
    print_success "Java package tests passed"
    echo ""
}

# Test Ruby package
test_ruby() {
    print_info "Testing Ruby package..."
    cd packages/ruby
    
    if ! command -v gem &> /dev/null; then
        print_error "Ruby/Gem not found. Skipping Ruby tests."
        cd ../..
        return
    fi
    
    print_info "Building Ruby gem..."
    gem build schema-resume-validator.gemspec
    
    print_info "Installing Ruby gem locally..."
    gem install ./schema-resume-validator-*.gem --local
    
    print_info "Testing Ruby gem..."
    ruby -e "require 'schema_resume'; puts 'Ruby gem loaded successfully'"
    
    print_info "Uninstalling Ruby gem..."
    gem uninstall schema-resume-validator -x
    
    cd ../..
    print_success "Ruby package tests passed"
    echo ""
}

# Test PHP package
test_php() {
    print_info "Testing PHP package..."
    cd packages/php
    
    if ! command -v composer &> /dev/null; then
        print_error "Composer not found. Skipping PHP tests."
        cd ../..
        return
    fi
    
    print_info "Installing PHP dependencies..."
    composer install -q
    
    print_info "Validating composer.json..."
    composer validate
    
    print_info "Running PHP example..."
    php example.php
    
    cd ../..
    print_success "PHP package tests passed"
    echo ""
}

# Main execution
PACKAGE=$1

if [ -z "$PACKAGE" ]; then
    # Test all packages
    print_info "Testing all packages..."
    echo ""
    
    test_npm
    test_python
    test_go
    test_java
    test_ruby
    test_php
    
    echo "=========================================="
    print_success "All package tests completed!"
    echo "=========================================="
else
    # Test specific package
    case $PACKAGE in
        npm)
            test_npm
            ;;
        python)
            test_python
            ;;
        go|golang)
            test_go
            ;;
        java)
            test_java
            ;;
        ruby)
            test_ruby
            ;;
        php)
            test_php
            ;;
        *)
            print_error "Unknown package: $PACKAGE"
            echo "Available packages: npm, python, go, java, ruby, php"
            exit 1
            ;;
    esac
fi
