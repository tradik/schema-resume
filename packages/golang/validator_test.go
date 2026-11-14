package validator

import (
	"os"
	"strings"
	"testing"
)

// modulePath is the only import path the Go toolchain accepts for this
// directory: repository path + subdirectory. v1.1.0–v1.3.0 declared
// github.com/tradik/schema-resume/validator, so `go get` rejected every tag.
const modulePath = "github.com/tradik/schema-resume/packages/golang"

func validResume() map[string]interface{} {
	return map[string]interface{}{
		"$schema": "https://schema-resume.org/schema.json",
		"basics": map[string]interface{}{
			"name":  "John Doe",
			"email": "john.doe@example.com",
		},
	}
}

// swap replaces an embedded document for the duration of one test.
func swap(t *testing.T, target *[]byte, value string) {
	t.Helper()
	saved := *target
	*target = []byte(value)
	t.Cleanup(func() { *target = saved })
}

func TestModulePathMatchesDirectory(t *testing.T) {
	data, err := os.ReadFile("go.mod")
	if err != nil {
		t.Fatalf("read go.mod: %v", err)
	}
	firstLine := strings.SplitN(string(data), "\n", 2)[0]
	if want := "module " + modulePath; strings.TrimSpace(firstLine) != want {
		t.Fatalf("go.mod declares %q, want %q", firstLine, want)
	}
}

func TestNewValidatorLoadsEmbeddedDocuments(t *testing.T) {
	v, err := NewValidator()
	if err != nil {
		t.Fatalf("NewValidator: %v", err)
	}
	if v.GetSchema()["title"] == nil {
		t.Error("schema has no title")
	}
	if v.GetMetaSchema()["title"] == nil {
		t.Error("meta-schema has no title")
	}
	if v.GetContext()["@context"] == nil {
		t.Error("context has no @context")
	}
}

func TestNewValidatorRejectsBrokenEmbeds(t *testing.T) {
	cases := map[string]struct {
		target *[]byte
		value  string
		want   string
	}{
		"schema":            {&schemaJSON, "{", "failed to parse schema"},
		"meta-schema":       {&metaSchemaJSON, "{", "failed to parse meta-schema"},
		"context":           {&contextJSON, "{", "failed to parse context"},
		"uncompilable type": {&schemaJSON, `{"type": 42}`, "failed to create schema"},
	}
	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			swap(t, tc.target, tc.value)
			if _, err := NewValidator(); err == nil || !strings.Contains(err.Error(), tc.want) {
				t.Fatalf("err = %v, want it to contain %q", err, tc.want)
			}
		})
	}
}

func TestValidate(t *testing.T) {
	v, err := NewValidator()
	if err != nil {
		t.Fatal(err)
	}

	result, err := v.Validate(validResume())
	if err != nil || !result.Valid || len(result.Errors) != 0 {
		t.Fatalf("valid resume: result=%+v err=%v", result, err)
	}

	invalid := map[string]interface{}{"basics": map[string]interface{}{"email": "not-an-email"}}
	result, err = v.Validate(invalid)
	if err != nil || result.Valid || len(result.Errors) == 0 {
		t.Fatalf("invalid resume: result=%+v err=%v", result, err)
	}
	if result.Errors[0].Field == "" || result.Errors[0].Description == "" {
		t.Errorf("error lacks detail: %+v", result.Errors[0])
	}

	// A Go value the loader cannot serialise is an error, not a result.
	if _, err = v.Validate(map[string]interface{}{"basics": make(chan int)}); err == nil {
		t.Fatal("unserialisable document: want error")
	}
}

func TestValidateJSON(t *testing.T) {
	v, err := NewValidator()
	if err != nil {
		t.Fatal(err)
	}
	result, err := v.ValidateJSON([]byte(`{"basics":{"name":"John Doe","email":"john@example.com"}}`))
	if err != nil || !result.Valid {
		t.Fatalf("result=%+v err=%v", result, err)
	}
	if _, err = v.ValidateJSON([]byte("{")); err == nil {
		t.Fatal("malformed JSON: want error")
	}
}

func TestConvenienceFunctions(t *testing.T) {
	if result, err := ValidateResume(validResume()); err != nil || !result.Valid {
		t.Fatalf("ValidateResume: result=%+v err=%v", result, err)
	}
	if result, err := ValidateResumeJSON([]byte(`{"basics":{"name":"Jane"}}`)); err != nil || !result.Valid {
		t.Fatalf("ValidateResumeJSON: result=%+v err=%v", result, err)
	}
}

func TestConvenienceFunctionsReportBrokenEmbeds(t *testing.T) {
	swap(t, &schemaJSON, "{")
	if _, err := ValidateResume(validResume()); err == nil {
		t.Error("ValidateResume: want error")
	}
	if _, err := ValidateResumeJSON([]byte(`{}`)); err == nil {
		t.Error("ValidateResumeJSON: want error")
	}
}
