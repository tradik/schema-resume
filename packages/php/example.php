<?php

require 'vendor/autoload.php';

use SchemaResume\Validator;

echo "Schema Resume Validator - PHP Example\n";
echo str_repeat("=", 60) . "\n\n";

try {
    // Create validator
    $validator = new Validator();
    
    // Example resume
    $resume = [
        '$schema' => 'https://schema-resume.org/schema.json',
        'basics' => [
            'name' => 'John Doe',
            'label' => 'Software Engineer',
            'email' => 'john.doe@example.com',
            'phone' => '+1-555-123-4567',
            'url' => 'https://johndoe.dev',
            'summary' => 'Experienced software engineer with 10+ years in full-stack development.',
            'location' => [
                'city' => 'San Francisco',
                'countryCode' => 'US',
                'region' => 'California',
            ],
        ],
        'work' => [
            [
                'name' => 'Tech Corp',
                'industry' => 'Information Technology',
                'position' => 'Senior Software Engineer',
                'startDate' => '2020-03',
                'summary' => 'Lead development of microservices architecture',
                'highlights' => [
                    'Reduced API response time by 40%',
                    'Mentored team of 5 junior developers',
                ],
            ],
        ],
        'education' => [
            [
                'institution' => 'University of Technology',
                'area' => 'Computer Science',
                'studyType' => 'Bachelor of Science',
                'startDate' => '2008',
                'endDate' => '2012',
                'score' => '3.8 GPA',
            ],
        ],
        'skills' => [
            [
                'name' => 'Backend Development',
                'level' => 'Expert',
                'keywords' => ['Node.js', 'Python', 'PostgreSQL'],
            ],
            [
                'name' => 'Frontend Development',
                'level' => 'Advanced',
                'keywords' => ['React', 'TypeScript', 'CSS'],
            ],
        ],
    ];
    
    // Validate
    echo "Validating resume...\n\n";
    $result = $validator->validate($resume);
    
    if ($result['valid']) {
        echo "✓ Resume is valid!\n\n";
        echo "Resume Summary:\n";
        echo "  Name: {$resume['basics']['name']}\n";
        echo "  Title: {$resume['basics']['label']}\n";
        echo "  Email: {$resume['basics']['email']}\n";
        echo "  Work Experience: " . count($resume['work']) . " position(s)\n";
        echo "  Education: " . count($resume['education']) . " degree(s)\n";
        echo "  Skills: " . count($resume['skills']) . " skill area(s)\n";
    } else {
        echo "✗ Validation failed with errors:\n\n";
        foreach ($result['errors'] as $i => $error) {
            echo "Error " . ($i + 1) . ":\n";
            echo "  Path: " . ($error['path'] ?: '(root)') . "\n";
            echo "  Message: {$error['message']}\n";
            echo "\n";
        }
    }
    
    // Example 2: Invalid resume
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "Testing invalid resume:\n";
    echo str_repeat("-", 60) . "\n\n";
    
    $invalidResume = [
        'basics' => [
            'email' => 'not-an-email', // Invalid email format
        ],
    ];
    
    $result = $validator->validate($invalidResume);
    
    if (!$result['valid']) {
        echo "Expected validation errors found:\n";
        foreach ($result['errors'] as $error) {
            echo "  • {$error['path']}: {$error['message']}\n";
        }
    }
    
    // Example 3: Schema information
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "Schema Information:\n";
    echo str_repeat("-", 60) . "\n\n";
    
    $schema = $validator->getSchema();
    echo "Schema version: {$schema->version}\n";
    echo "Schema title: {$schema->title}\n";
    
    $metaSchema = $validator->getMetaSchema();
    echo "Meta-schema title: {$metaSchema->title}\n";
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "Examples completed successfully!\n";
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
