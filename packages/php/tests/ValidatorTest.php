<?php

declare(strict_types=1);

namespace SchemaResume\Tests;

use PHPUnit\Framework\TestCase;
use SchemaResume\Validator;

/**
 * Tests for {@see Validator}.
 */
final class ValidatorTest extends TestCase
{
    private const MINIMAL = ['basics' => ['name' => 'Jane Doe', 'email' => 'jane@example.com']];

    public function testLoadsEmbeddedDocuments(): void
    {
        $validator = new Validator();
        self::assertObjectHasProperty('properties', $validator->getSchema());
        self::assertObjectHasProperty('title', $validator->getMetaSchema());
        self::assertObjectHasProperty('@context', $validator->getContext());
    }

    public function testAcceptsNestedPhpArray(): void
    {
        $resume = self::MINIMAL + [
            'work' => [['name' => 'Acme', 'position' => 'Engineer', 'startDate' => '2020-01-01']],
        ];
        $result = (new Validator())->validate($resume);
        self::assertTrue($result['valid'], json_encode($result['errors']) ?: '');
        self::assertSame([], $result['errors']);
    }

    public function testAcceptsJsonStringAndObject(): void
    {
        $validator = new Validator();
        $json = json_encode(self::MINIMAL) ?: '';
        self::assertTrue($validator->validate($json)['valid']);
        self::assertTrue($validator->validate(json_decode($json))['valid']);
    }

    public function testEmptyArrayIsAnEmptyObject(): void
    {
        self::assertTrue((new Validator())->validate([])['valid']);
    }

    public function testValidatesRepositoryExample(): void
    {
        $json = file_get_contents(__DIR__ . '/../../../example.json') ?: '';
        $result = (new Validator())->validate($json);
        self::assertTrue($result['valid'], json_encode($result['errors']) ?: '');
    }

    public function testReportsInvalidResume(): void
    {
        $result = (new Validator())->validate(['basics' => 'not an object']);
        self::assertFalse($result['valid']);
        self::assertSame('basics', $result['errors'][0]['path']);
        // json-schema 5.x reports the constraint as a string, 6.x as ['name' => …, 'params' => …].
        $constraint = $result['errors'][0]['constraint'];
        self::assertSame('type', is_array($constraint) ? $constraint['name'] : $constraint);
        self::assertNotEmpty($result['errors'][0]['message']);
    }

    public function testRejectsMalformedJson(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid JSON');
        (new Validator())->validate('{');
    }

    public function testRejectsJsonThatIsNotAnObject(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        (new Validator())->validate('[1]');
    }

    public function testRejectsList(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        (new Validator())->validate([1, 2]);
    }

    public function testCustomSchemaPath(): void
    {
        $path = $this->tempFile('{"type":"object","required":["x"]}');
        $result = (new Validator($path))->validate(['y' => 1]);
        self::assertFalse($result['valid']);
    }

    public function testMissingSchemaFile(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Schema file not found');
        new Validator('/nonexistent/schema.json');
    }

    public function testUnreadableSchemaFile(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Failed to read schema file');
        $path = $this->tempFile('{}');
        chmod($path, 0);
        if (is_readable($path)) {
            self::markTestSkipped('running as root: permissions are not enforced');
        }
        @new Validator($path);
    }

    public function testInvalidSchemaJson(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Invalid JSON in schema file');
        new Validator($this->tempFile('{'));
    }

    private function tempFile(string $content): string
    {
        $path = tempnam(sys_get_temp_dir(), 'sr') ?: '';
        file_put_contents($path, $content);
        return $path;
    }
}
