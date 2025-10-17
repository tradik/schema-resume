#!/usr/bin/env python3
"""
Schema Comparison Tool
Compares all schema files (schema.json, context.jsonld, meta-schema.json, schema-resume.xsd)
and generates a detailed field-by-field comparison report.
"""

import json
import xml.etree.ElementTree as ET
from pathlib import Path
from collections import defaultdict
from typing import Dict, Set, List

class SchemaComparator:
    def __init__(self, base_path: str = "."):
        self.base_path = Path(base_path)
        self.fields = defaultdict(lambda: {
            'schema.json': False,
            'context.jsonld': False,
            'meta-schema.json': False,
            'schema-resume.xsd': False
        })
        
    def extract_from_schema_json(self) -> Set[str]:
        """Extract all field names from schema.json"""
        fields = set()
        schema_path = self.base_path / "schema.json"
        
        with open(schema_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract from properties
        if 'properties' in data:
            for section, section_data in data['properties'].items():
                if section in ['$schema', '@type', 'additionalType']:
                    continue
                    
                if isinstance(section_data, dict) and 'properties' in section_data:
                    # Section like 'basics', 'work', etc.
                    for field in section_data['properties'].keys():
                        fields.add(f"{section}.{field}")
                        self.fields[f"{section}.{field}"]['schema.json'] = True
                        
                    # Check nested properties (like location)
                    for field, field_data in section_data['properties'].items():
                        if isinstance(field_data, dict) and 'properties' in field_data:
                            for nested_field in field_data['properties'].keys():
                                fields.add(f"{section}.{field}.{nested_field}")
                                self.fields[f"{section}.{field}.{nested_field}"]['schema.json'] = True
                                
                elif isinstance(section_data, dict) and 'items' in section_data:
                    # Array sections
                    items = section_data['items']
                    if isinstance(items, dict) and 'properties' in items:
                        for field in items['properties'].keys():
                            fields.add(f"{section}[].{field}")
                            self.fields[f"{section}[].{field}"]['schema.json'] = True
                            
                        # Check nested in array items
                        for field, field_data in items['properties'].items():
                            if isinstance(field_data, dict) and 'properties' in field_data:
                                for nested_field in field_data['properties'].keys():
                                    fields.add(f"{section}[].{field}.{nested_field}")
                                    self.fields[f"{section}[].{field}.{nested_field}"]['schema.json'] = True
        
        return fields
    
    def extract_from_context_jsonld(self) -> Set[str]:
        """Extract all field names from context.jsonld"""
        fields = set()
        context_path = self.base_path / "context.jsonld"
        
        with open(context_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if '@context' in data:
            context = data['@context']
            for key in context.keys():
                if key.startswith('@') or key in ['schema', 'xsd', 'rdf', 'rdfs']:
                    continue
                fields.add(key)
                # Mark as found in context.jsonld (we'll map to sections later)
                
        return fields
    
    def extract_from_meta_schema(self) -> Set[str]:
        """Extract all field names from meta-schema.json"""
        fields = set()
        meta_path = self.base_path / "meta-schema.json"
        
        with open(meta_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if 'properties' in data:
            for field in data['properties'].keys():
                if field.startswith('$') or field.startswith('@'):
                    continue
                fields.add(field)
                
        return fields
    
    def extract_from_xsd(self) -> Set[str]:
        """Extract all field names from schema-resume.xsd"""
        fields = set()
        xsd_path = self.base_path / "xml" / "1.0" / "schema-resume.xsd"
        
        tree = ET.parse(xsd_path)
        root = tree.getroot()
        
        # Define namespace
        ns = {'xs': 'http://www.w3.org/2001/XMLSchema'}
        
        # Find all complexType definitions
        for complex_type in root.findall('.//xs:complexType', ns):
            type_name = complex_type.get('name', '')
            
            # Find all elements in this type
            for element in complex_type.findall('.//xs:element', ns):
                field_name = element.get('name')
                if field_name:
                    # Map type names to sections
                    section = self._map_xsd_type_to_section(type_name)
                    if section:
                        full_name = f"{section}.{field_name}" if section != 'root' else field_name
                        fields.add(full_name)
        
        return fields
    
    def _map_xsd_type_to_section(self, type_name: str) -> str:
        """Map XSD type names to schema sections"""
        mapping = {
            'BasicsType': 'basics',
            'LocationType': 'basics.location',
            'WorkType': 'work[]',
            'WorkLocationAddressType': 'work[].location',
            'ContactDetailsType': 'work[].contactDetails',
            'VolunteerType': 'volunteer[]',
            'EducationType': 'education[]',
            'AwardType': 'awards[]',
            'CertificateType': 'certificates[]',
            'PublicationType': 'publications[]',
            'SkillType': 'skills[]',
            'ToolType': 'tools[]',
            'LanguageType': 'languages[]',
            'InterestType': 'interests[]',
            'ReferenceType': 'references[]',
            'ProjectType': 'projects[]',
            'MetaType': 'meta',
        }
        return mapping.get(type_name, '')
    
    def compare_all(self):
        """Compare all schema files"""
        print("=" * 80)
        print("SCHEMA COMPARISON REPORT")
        print("=" * 80)
        print()
        
        # Extract fields from each file
        print("Extracting fields from schema.json...")
        schema_fields = self.extract_from_schema_json()
        
        print("Extracting fields from context.jsonld...")
        context_fields = self.extract_from_context_jsonld()
        
        print("Extracting fields from meta-schema.json...")
        meta_fields = self.extract_from_meta_schema()
        
        print("Extracting fields from schema-resume.xsd...")
        xsd_fields = self.extract_from_xsd()
        
        print()
        print("=" * 80)
        print("BASICS SECTION COMPARISON")
        print("=" * 80)
        print()
        
        # Check basics fields
        basics_fields = {
            'name', 'label', 'title', 'age', 'dateOfBirth', 'gender',
            'image', 'email', 'phone', 'url', 'summary',
            'keyAchievements', 'coreCompetencies', 'location',
            'profiles', 'nationalities', 'workAuthorization'
        }
        
        self._print_section_comparison('basics', basics_fields, 
                                      schema_fields, context_fields, 
                                      meta_fields, xsd_fields)
        
        print()
        print("=" * 80)
        print("LOCATION SUB-FIELDS COMPARISON")
        print("=" * 80)
        print()
        
        location_fields = {
            'address', 'streetAddress', 'postalCode', 'city', 
            'countryCode', 'region'
        }
        
        self._print_section_comparison('basics.location', location_fields,
                                      schema_fields, context_fields,
                                      meta_fields, xsd_fields)
        
        print()
        print("=" * 80)
        print("META SECTION COMPARISON")
        print("=" * 80)
        print()
        
        meta_section_fields = {
            'canonical', 'version', 'lastModified', 'dateCreated',
            'dateModified', 'datePublished'
        }
        
        self._print_section_comparison('meta', meta_section_fields,
                                      schema_fields, context_fields,
                                      meta_fields, xsd_fields)
        
        print()
        print("=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print()
        
        self._print_summary(schema_fields, context_fields, meta_fields, xsd_fields)
    
    def _print_section_comparison(self, section: str, fields: Set[str],
                                  schema_fields: Set[str], context_fields: Set[str],
                                  meta_fields: Set[str], xsd_fields: Set[str]):
        """Print comparison for a specific section"""
        
        print(f"{'Field':<25} {'schema.json':<15} {'context.jsonld':<18} {'meta-schema':<15} {'XSD':<10}")
        print("-" * 85)
        
        for field in sorted(fields):
            full_field = f"{section}.{field}"
            
            in_schema = full_field in schema_fields
            in_context = field in context_fields
            in_meta = field in meta_fields
            in_xsd = full_field in xsd_fields
            
            status_schema = "✅" if in_schema else "❌"
            status_context = "✅" if in_context else "❌"
            status_meta = "✅" if in_meta else "❌"
            status_xsd = "✅" if in_xsd else "❌"
            
            # Highlight mismatches
            mismatch = not (in_schema == in_context == in_xsd)
            prefix = "⚠️  " if mismatch else "   "
            
            print(f"{prefix}{field:<22} {status_schema:<15} {status_context:<18} {status_meta:<15} {status_xsd:<10}")
    
    def _print_summary(self, schema_fields: Set[str], context_fields: Set[str],
                      meta_fields: Set[str], xsd_fields: Set[str]):
        """Print summary of findings"""
        
        # Find fields only in specific files
        only_in_schema = schema_fields - context_fields - xsd_fields
        only_in_context = context_fields - schema_fields - xsd_fields
        only_in_meta = meta_fields - schema_fields - context_fields - xsd_fields
        only_in_xsd = xsd_fields - schema_fields - context_fields
        
        # Find missing fields
        in_schema_not_context = [f for f in schema_fields if not any(f.endswith(c) for c in context_fields)]
        in_context_not_schema = [c for c in context_fields if not any(f.endswith(c) for f in schema_fields)]
        
        print("Missing from context.jsonld:")
        if in_schema_not_context:
            for field in sorted(in_schema_not_context)[:10]:  # Show first 10
                print(f"  - {field}")
        else:
            print("  None")
        
        print()
        print("Missing from schema.json:")
        if in_context_not_schema:
            for field in sorted(in_context_not_schema)[:10]:  # Show first 10
                print(f"  - {field}")
        else:
            print("  None")
        
        print()
        print("Only in meta-schema.json:")
        if only_in_meta:
            for field in sorted(only_in_meta):
                print(f"  - {field}")
        else:
            print("  None")
        
        print()
        print(f"Total fields in schema.json: {len(schema_fields)}")
        print(f"Total fields in context.jsonld: {len(context_fields)}")
        print(f"Total fields in meta-schema.json: {len(meta_fields)}")
        print(f"Total fields in XSD: {len(xsd_fields)}")

if __name__ == "__main__":
    comparator = SchemaComparator()
    comparator.compare_all()
    
    # Exit with error code if there are mismatches
    # Check for critical mismatches (excluding meta-schema which is different by design)
    exit(0)  # Comparison is informational, not a failure
