#!/usr/bin/env python3
"""Example usage of schema-resume-validator."""

from schema_resume import validate_resume, ResumeValidator

# Example resume data
resume = {
    "$schema": "https://schema-resume.org/schema.json",
    "basics": {
        "name": "John Doe",
        "label": "Software Engineer",
        "email": "john.doe@example.com",
        "phone": "+1-555-123-4567",
        "url": "https://johndoe.dev",
        "summary": "Experienced software engineer with 10+ years in full-stack development.",
        "location": {
            "city": "San Francisco",
            "countryCode": "US",
            "region": "California"
        },
        "profiles": [
            {
                "network": "LinkedIn",
                "username": "johndoe",
                "url": "https://linkedin.com/in/johndoe"
            },
            {
                "network": "GitHub",
                "username": "johndoe",
                "url": "https://github.com/johndoe"
            }
        ]
    },
    "work": [
        {
            "name": "Tech Corp",
            "industry": "Information Technology",
            "position": "Senior Software Engineer",
            "startDate": "2020-03",
            "summary": "Lead development of microservices architecture",
            "highlights": [
                "Reduced API response time by 40%",
                "Mentored team of 5 junior developers"
            ]
        }
    ],
    "education": [
        {
            "institution": "University of Technology",
            "area": "Computer Science",
            "studyType": "Bachelor of Science",
            "startDate": "2008",
            "endDate": "2012",
            "score": "3.8 GPA"
        }
    ],
    "skills": [
        {
            "name": "Backend Development",
            "level": "Expert",
            "keywords": ["Node.js", "Python", "PostgreSQL"]
        },
        {
            "name": "Frontend Development",
            "level": "Advanced",
            "keywords": ["React", "TypeScript", "CSS"]
        }
    ]
}


def main():
    """Run validation examples."""
    print("Schema Resume Validator - Python Example\n")
    print("=" * 60)
    
    # Example 1: Using convenience function
    print("\n1. Using validate_resume() function:")
    print("-" * 60)
    result = validate_resume(resume)
    
    if result["valid"]:
        print("✓ Resume is valid!")
        print(f"\nResume Summary:")
        print(f"  Name: {resume['basics']['name']}")
        print(f"  Title: {resume['basics']['label']}")
        print(f"  Email: {resume['basics']['email']}")
        print(f"  Work Experience: {len(resume['work'])} position(s)")
        print(f"  Education: {len(resume['education'])} degree(s)")
        print(f"  Skills: {len(resume['skills'])} skill area(s)")
    else:
        print("✗ Validation failed with errors:\n")
        for i, error in enumerate(result["errors"], 1):
            print(f"Error {i}:")
            print(f"  Path: {error['path'] or '(root)'}")
            print(f"  Message: {error['message']}")
            print()
    
    # Example 2: Using validator class
    print("\n2. Using ResumeValidator class:")
    print("-" * 60)
    validator = ResumeValidator()
    
    # Get schema information
    schema = validator.get_schema()
    print(f"Schema version: {schema.get('version', 'N/A')}")
    print(f"Schema title: {schema.get('title', 'N/A')}")
    
    # Validate
    result = validator.validate(resume)
    print(f"Validation result: {'✓ Valid' if result['valid'] else '✗ Invalid'}")
    
    # Example 3: Invalid resume
    print("\n3. Validating invalid resume:")
    print("-" * 60)
    invalid_resume = {
        "basics": {
            "email": "not-an-email"  # Invalid email format
        }
    }
    
    result = validate_resume(invalid_resume)
    if not result["valid"]:
        print("Expected validation errors found:")
        for error in result["errors"]:
            print(f"  • {error['path']}: {error['message']}")
    
    print("\n" + "=" * 60)
    print("Examples completed successfully!")


if __name__ == "__main__":
    main()
