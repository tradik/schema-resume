import { ErrorObject } from 'ajv';

export interface ValidationResult {
  valid: boolean;
  errors: ErrorObject[];
}

export interface Validator {
  validate(resume: any): ValidationResult;
  getSchema(): object;
  getMetaSchema(): object;
  getContext(): object;
  getAjv(): any;
}

export interface ValidatorOptions {
  strict?: boolean;
  allErrors?: boolean;
  verbose?: boolean;
  [key: string]: any;
}

export function createValidator(options?: ValidatorOptions): Validator;

export const schema: object;
export const metaSchema: object;
export const context: object;
