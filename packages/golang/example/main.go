package main

import (
	"fmt"
	"log"
	"strings"

	validator "github.com/tradik/schema-resume/validator"
)

func main() {
	fmt.Println("Schema Resume Validator - Go Example")
	fmt.Println(strings.Repeat("=", 60))

	// Create validator
	v, err := validator.NewValidator()
	if err != nil {
		log.Fatal(err)
	}

	// Example resume
	resume := map[string]interface{}{
		"$schema": "https://schema-resume.org/schema.json",
		"basics": map[string]interface{}{
			"name":    "John Doe",
			"label":   "Software Engineer",
			"email":   "john.doe@example.com",
			"phone":   "+1-555-123-4567",
			"url":     "https://johndoe.dev",
			"summary": "Experienced software engineer with 10+ years in full-stack development.",
			"location": map[string]interface{}{
				"city":        "San Francisco",
				"countryCode": "US",
				"region":      "California",
			},
			"profiles": []map[string]interface{}{
				{
					"network":  "LinkedIn",
					"username": "johndoe",
					"url":      "https://linkedin.com/in/johndoe",
				},
				{
					"network":  "GitHub",
					"username": "johndoe",
					"url":      "https://github.com/johndoe",
				},
			},
		},
		"work": []map[string]interface{}{
			{
				"name":      "Tech Corp",
				"industry":  "Information Technology",
				"position":  "Senior Software Engineer",
				"startDate": "2020-03",
				"summary":   "Lead development of microservices architecture",
				"highlights": []string{
					"Reduced API response time by 40%",
					"Mentored team of 5 junior developers",
				},
			},
		},
		"education": []map[string]interface{}{
			{
				"institution": "University of Technology",
				"area":        "Computer Science",
				"studyType":   "Bachelor of Science",
				"startDate":   "2008",
				"endDate":     "2012",
				"score":       "3.8 GPA",
			},
		},
		"skills": []map[string]interface{}{
			{
				"name":     "Backend Development",
				"level":    "Expert",
				"keywords": []string{"Node.js", "Python", "PostgreSQL"},
			},
			{
				"name":     "Frontend Development",
				"level":    "Advanced",
				"keywords": []string{"React", "TypeScript", "CSS"},
			},
		},
	}

	// Validate
	fmt.Println("\nValidating resume...")
	result, err := v.Validate(resume)
	if err != nil {
		log.Fatal(err)
	}

	if result.Valid {
		fmt.Println("✓ Resume is valid!")
		
		basics := resume["basics"].(map[string]interface{})
		work := resume["work"].([]map[string]interface{})
		education := resume["education"].([]map[string]interface{})
		skills := resume["skills"].([]map[string]interface{})
		
		fmt.Println("\nResume Summary:")
		fmt.Printf("  Name: %s\n", basics["name"])
		fmt.Printf("  Title: %s\n", basics["label"])
		fmt.Printf("  Email: %s\n", basics["email"])
		fmt.Printf("  Work Experience: %d position(s)\n", len(work))
		fmt.Printf("  Education: %d degree(s)\n", len(education))
		fmt.Printf("  Skills: %d skill area(s)\n", len(skills))
	} else {
		fmt.Println("✗ Validation failed with errors:\n")
		for i, e := range result.Errors {
			fmt.Printf("Error %d:\n", i+1)
			fmt.Printf("  Field: %s\n", e.Field)
			fmt.Printf("  Type: %s\n", e.Type)
			fmt.Printf("  Description: %s\n", e.Description)
			fmt.Println()
		}
	}

	// Example 2: Invalid resume
	fmt.Println("\n" + strings.Repeat("=", 60))
	fmt.Println("Testing invalid resume:")
	fmt.Println(strings.Repeat("-", 60))
	
	invalidResume := map[string]interface{}{
		"basics": map[string]interface{}{
			"email": "not-an-email", // Invalid email format
		},
	}

	result, err = v.Validate(invalidResume)
	if err != nil {
		log.Fatal(err)
	}

	if !result.Valid {
		fmt.Println("Expected validation errors found:")
		for _, e := range result.Errors {
			fmt.Printf("  • %s: %s\n", e.Field, e.Description)
		}
	}

	// Example 3: Schema information
	fmt.Println("\n" + strings.Repeat("=", 60))
	fmt.Println("Schema Information:")
	fmt.Println(strings.Repeat("-", 60))
	
	schema := v.GetSchema()
	fmt.Printf("Schema version: %v\n", schema["version"])
	fmt.Printf("Schema title: %v\n", schema["title"])
	
	metaSchema := v.GetMetaSchema()
	fmt.Printf("Meta-schema title: %v\n", metaSchema["title"])

	fmt.Println("\n" + strings.Repeat("=", 60))
	fmt.Println("Examples completed successfully!")
}
