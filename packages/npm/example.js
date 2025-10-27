const { createValidator } = require('./index');

// Create validator instance
const validator = createValidator();

// Example resume data
const resume = {
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
};

// Validate the resume
console.log('Validating resume...\n');
const result = validator.validate(resume);

if (result.valid) {
  console.log('✓ Resume is valid!');
  console.log('\nResume Summary:');
  console.log(`  Name: ${resume.basics.name}`);
  console.log(`  Title: ${resume.basics.label}`);
  console.log(`  Email: ${resume.basics.email}`);
  console.log(`  Work Experience: ${resume.work.length} position(s)`);
  console.log(`  Education: ${resume.education.length} degree(s)`);
  console.log(`  Skills: ${resume.skills.length} skill area(s)`);
} else {
  console.log('✗ Validation failed with errors:\n');
  result.errors.forEach((error, index) => {
    console.log(`Error ${index + 1}:`);
    console.log(`  Path: ${error.instancePath || '(root)'}`);
    console.log(`  Message: ${error.message}`);
    if (error.params) {
      console.log(`  Details: ${JSON.stringify(error.params)}`);
    }
    console.log('');
  });
}
