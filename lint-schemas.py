#!/usr/bin/env python3
"""
Schema Linting Tool
Validates all schema files for syntax errors, structure issues, and compliance.
Checks: schema.json, context.jsonld, meta-schema.json, schema-resume.xsd
"""

import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Tuple
import re

class SchemaLinter:
    def __init__(self, base_path: str = "."):
        self.base_path = Path(base_path)
        self.errors = []
        self.warnings = []
        self.info = []
        
    def lint_all(self):
        """Run all linting checks"""
        print("=" * 80)
        print("SCHEMA LINTING REPORT")
        print("=" * 80)
        print()
        
        # Lint each file
        self.lint_schema_json()
        self.lint_context_jsonld()
        self.lint_meta_schema()
        self.lint_xsd()
        
        # Print results
        self.print_results()
        
        return len(self.errors) == 0
    
    def lint_schema_json(self):
        """Lint schema.json"""
        print("Linting schema.json...")
        file_path = self.base_path / "schema.json"
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.info.append(("schema.json", "✅ Valid JSON syntax"))
            
            # Check required top-level fields
            required_fields = ['$schema', '$id', 'properties']
            for field in required_fields:
                if field not in data:
                    self.errors.append(("schema.json", f"Missing required field: {field}"))
                else:
                    self.info.append(("schema.json", f"✅ Has required field: {field}"))
            
            # Check if properties exist
            if 'properties' in data:
                prop_count = len(data['properties'])
                self.info.append(("schema.json", f"✅ Contains {prop_count} top-level properties"))
                
                # Check for basics section
                if 'basics' not in data['properties']:
                    self.warnings.append(("schema.json", "Missing 'basics' section"))
                else:
                    basics = data['properties']['basics']
                    if 'properties' in basics:
                        basics_fields = len(basics['properties'])
                        self.info.append(("schema.json", f"✅ Basics section has {basics_fields} fields"))
                        
                        # Check critical basics fields
                        critical_fields = ['name', 'email', 'phone']
                        for field in critical_fields:
                            if field not in basics['properties']:
                                self.warnings.append(("schema.json", f"Basics missing recommended field: {field}"))
            
            # Check definitions
            if 'definitions' in data:
                def_count = len(data['definitions'])
                self.info.append(("schema.json", f"✅ Contains {def_count} definitions"))
            else:
                self.warnings.append(("schema.json", "No definitions section found"))
            
            # Validate ISO8601 pattern if exists
            if 'definitions' in data and 'iso8601' in data['definitions']:
                iso_def = data['definitions']['iso8601']
                if 'pattern' in iso_def:
                    try:
                        re.compile(iso_def['pattern'])
                        self.info.append(("schema.json", "✅ ISO8601 pattern is valid regex"))
                    except re.error as e:
                        self.errors.append(("schema.json", f"Invalid ISO8601 regex pattern: {e}"))
            
        except json.JSONDecodeError as e:
            self.errors.append(("schema.json", f"❌ JSON syntax error: {e}"))
        except FileNotFoundError:
            self.errors.append(("schema.json", "❌ File not found"))
        except Exception as e:
            self.errors.append(("schema.json", f"❌ Unexpected error: {e}"))
    
    def lint_context_jsonld(self):
        """Lint context.jsonld"""
        print("Linting context.jsonld...")
        file_path = self.base_path / "context.jsonld"
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.info.append(("context.jsonld", "✅ Valid JSON syntax"))
            
            # Check for @context
            if '@context' not in data:
                self.errors.append(("context.jsonld", "Missing required '@context' field"))
            else:
                context = data['@context']
                self.info.append(("context.jsonld", "✅ Has '@context' field"))
                
                # Check for required namespaces
                required_ns = ['schema', 'xsd']
                for ns in required_ns:
                    if ns not in context:
                        self.warnings.append(("context.jsonld", f"Missing namespace: {ns}"))
                    else:
                        self.info.append(("context.jsonld", f"✅ Has namespace: {ns}"))
                
                # Check @vocab
                if '@vocab' in context:
                    vocab = context['@vocab']
                    if not vocab.startswith('http'):
                        self.warnings.append(("context.jsonld", f"@vocab should be a URL: {vocab}"))
                    else:
                        self.info.append(("context.jsonld", f"✅ @vocab is valid URL"))
                
                # Count mapped fields
                field_count = sum(1 for k in context.keys() if not k.startswith('@') and k not in ['schema', 'xsd', 'rdf', 'rdfs'])
                self.info.append(("context.jsonld", f"✅ Contains {field_count} field mappings"))
                
                # Check for proper @id mappings
                invalid_mappings = []
                for key, value in context.items():
                    if isinstance(value, dict) and '@id' in value:
                        if not value['@id'].startswith(('schema:', 'xsd:', 'rdf:', 'rdfs:')):
                            invalid_mappings.append(key)
                
                if invalid_mappings:
                    self.warnings.append(("context.jsonld", f"Fields with non-standard @id: {', '.join(invalid_mappings[:5])}"))
            
        except json.JSONDecodeError as e:
            self.errors.append(("context.jsonld", f"❌ JSON syntax error: {e}"))
        except FileNotFoundError:
            self.errors.append(("context.jsonld", "❌ File not found"))
        except Exception as e:
            self.errors.append(("context.jsonld", f"❌ Unexpected error: {e}"))
    
    def lint_meta_schema(self):
        """Lint meta-schema.json"""
        print("Linting meta-schema.json...")
        file_path = self.base_path / "meta-schema.json"
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.info.append(("meta-schema.json", "✅ Valid JSON syntax"))
            
            # Check required fields for a meta-schema
            required_fields = ['$schema', '$id', 'properties']
            for field in required_fields:
                if field not in data:
                    self.errors.append(("meta-schema.json", f"Missing required field: {field}"))
                else:
                    self.info.append(("meta-schema.json", f"✅ Has required field: {field}"))
            
            # Check if it's self-referential
            if '$schema' in data and '$id' in data:
                if data['$schema'] == data['$id']:
                    self.info.append(("meta-schema.json", "✅ Self-referential meta-schema"))
                else:
                    self.warnings.append(("meta-schema.json", "$schema and $id don't match (not self-referential)"))
            
            # Check definitions
            if 'definitions' in data:
                def_count = len(data['definitions'])
                self.info.append(("meta-schema.json", f"✅ Contains {def_count} definitions"))
                
                # Check for standard meta-schema definitions
                standard_defs = ['schemaArray', 'nonNegativeInteger', 'simpleTypes', 'stringArray']
                for def_name in standard_defs:
                    if def_name not in data['definitions']:
                        self.warnings.append(("meta-schema.json", f"Missing standard definition: {def_name}"))
            
            # Check properties
            if 'properties' in data:
                prop_count = len(data['properties'])
                self.info.append(("meta-schema.json", f"✅ Contains {prop_count} property definitions"))
                
                # Check for JSON Schema keywords
                schema_keywords = ['type', 'properties', 'items', 'required', 'enum', 'pattern']
                for keyword in schema_keywords:
                    if keyword not in data['properties']:
                        self.warnings.append(("meta-schema.json", f"Missing JSON Schema keyword: {keyword}"))
            
        except json.JSONDecodeError as e:
            self.errors.append(("meta-schema.json", f"❌ JSON syntax error: {e}"))
        except FileNotFoundError:
            self.errors.append(("meta-schema.json", "❌ File not found"))
        except Exception as e:
            self.errors.append(("meta-schema.json", f"❌ Unexpected error: {e}"))
    
    def lint_xsd(self):
        """Lint schema-resume.xsd"""
        print("Linting schema-resume.xsd...")
        file_path = self.base_path / "xml" / "1.0" / "schema-resume.xsd"
        
        try:
            tree = ET.parse(file_path)
            root = tree.getroot()
            
            self.info.append(("schema-resume.xsd", "✅ Valid XML syntax"))
            
            # Check namespace
            ns = {'xs': 'http://www.w3.org/2001/XMLSchema'}
            
            # Check root element
            if root.tag != '{http://www.w3.org/2001/XMLSchema}schema':
                self.errors.append(("schema-resume.xsd", f"Root element should be xs:schema, got {root.tag}"))
            else:
                self.info.append(("schema-resume.xsd", "✅ Root element is xs:schema"))
            
            # Check targetNamespace
            target_ns = root.get('targetNamespace')
            if target_ns:
                self.info.append(("schema-resume.xsd", f"✅ Has targetNamespace: {target_ns}"))
            else:
                self.warnings.append(("schema-resume.xsd", "Missing targetNamespace"))
            
            # Count complex types
            complex_types = root.findall('.//xs:complexType', ns)
            self.info.append(("schema-resume.xsd", f"✅ Contains {len(complex_types)} complexType definitions"))
            
            # Count simple types
            simple_types = root.findall('.//xs:simpleType', ns)
            if simple_types:
                self.info.append(("schema-resume.xsd", f"✅ Contains {len(simple_types)} simpleType definitions"))
            
            # Check for root element definition
            root_elements = root.findall('./xs:element', ns)
            if root_elements:
                self.info.append(("schema-resume.xsd", f"✅ Contains {len(root_elements)} root element(s)"))
            else:
                self.warnings.append(("schema-resume.xsd", "No root element defined"))
            
            # Check for BasicsType
            basics_type = root.find(".//xs:complexType[@name='BasicsType']", ns)
            if basics_type is not None:
                elements = basics_type.findall('.//xs:element', ns)
                self.info.append(("schema-resume.xsd", f"✅ BasicsType has {len(elements)} elements"))
            else:
                self.warnings.append(("schema-resume.xsd", "BasicsType not found"))
            
            # Validate element references
            all_elements = root.findall('.//xs:element', ns)
            for elem in all_elements:
                elem_type = elem.get('type')
                if elem_type and ':' in elem_type:
                    prefix = elem_type.split(':')[0]
                    if prefix not in ['xs', 'sr']:
                        self.warnings.append(("schema-resume.xsd", f"Unknown type prefix: {elem_type}"))
            
        except ET.ParseError as e:
            self.errors.append(("schema-resume.xsd", f"❌ XML syntax error: {e}"))
        except FileNotFoundError:
            self.errors.append(("schema-resume.xsd", "❌ File not found"))
        except Exception as e:
            self.errors.append(("schema-resume.xsd", f"❌ Unexpected error: {e}"))
    
    def print_results(self):
        """Print linting results"""
        print()
        print("=" * 80)
        print("LINTING RESULTS")
        print("=" * 80)
        print()
        
        # Print errors
        if self.errors:
            print("❌ ERRORS:")
            print("-" * 80)
            for file, msg in self.errors:
                print(f"  [{file}] {msg}")
            print()
        
        # Print warnings
        if self.warnings:
            print("⚠️  WARNINGS:")
            print("-" * 80)
            for file, msg in self.warnings:
                print(f"  [{file}] {msg}")
            print()
        
        # Print info
        if self.info:
            print("ℹ️  INFORMATION:")
            print("-" * 80)
            for file, msg in self.info:
                print(f"  [{file}] {msg}")
            print()
        
        # Summary
        print("=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print(f"Errors:   {len(self.errors)}")
        print(f"Warnings: {len(self.warnings)}")
        print(f"Info:     {len(self.info)}")
        print()
        
        if len(self.errors) == 0:
            print("✅ All schema files passed linting!")
        else:
            print("❌ Linting failed with errors")
        
        return len(self.errors) == 0

if __name__ == "__main__":
    linter = SchemaLinter()
    success = linter.lint_all()
    exit(0 if success else 1)
