#!/usr/bin/env python3
"""Setup script for schema-resume-validator package."""

from setuptools import setup, find_packages
from pathlib import Path

# Read the README file
readme_file = Path(__file__).parent / "README.md"
long_description = readme_file.read_text(encoding="utf-8") if readme_file.exists() else ""

setup(
    name="schema-resume-validator",
    version="1.1.0",
    description="JSON Schema validator for Schema Resume - comprehensive CV/Resume validation with JSON-LD support",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Schema Resume",
    author_email="info@schema-resume.org",
    maintainer="Tradik",
    maintainer_email="support@tradik.com",
    url="https://schema-resume.org/",
    project_urls={
        "Documentation": "https://github.com/tradik/schema-resume",
        "Source": "https://github.com/tradik/schema-resume",
        "Tracker": "https://github.com/tradik/schema-resume/issues",
    },
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    package_data={
        "schema_resume": [
            "schemas/*.json",
            "schemas/*.jsonld",
            "schemas/*.xsd",
        ],
    },
    include_package_data=True,
    python_requires=">=3.8",
    install_requires=[
        "jsonschema>=4.17.0",
        "requests>=2.28.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ],
        "xml": [
            "lxml>=4.9.0",
        ],
    },
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Text Processing",
        "Topic :: Utilities",
    ],
    keywords="json-schema resume cv curriculum-vitae validation json-ld parser",
    license="MIT",
    zip_safe=False,
)
