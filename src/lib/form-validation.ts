export type Validator = (value: string) => string | undefined;

export function isBlank(value: string | undefined | null) {
  return !value || value.trim().length === 0;
}

export const v = {
  required:
    (message = 'This field is required'): Validator =>
    (value: string) =>
      isBlank(value) ? message : undefined,

  email:
    (message = 'Please enter a valid email address'): Validator =>
    (value: string) => {
      if (isBlank(value)) return undefined;
      // Simple, pragmatic email check (not RFC exhaustive)
      const normalized = value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
      return ok ? undefined : message;
    },

  minLength:
    (min: number, message?: string): Validator =>
    (value: string) => {
      if (isBlank(value)) return undefined;
      return value.trim().length >= min
        ? undefined
        : (message ?? `Must be at least ${min} characters`);
    },

  phone:
    (message = 'Please enter a valid phone number'): Validator =>
    (value: string) => {
      if (isBlank(value)) return undefined;
      const digits = value.replace(/[^0-9+]/g, '');
      // Accept + and 7-15 digits (basic E.164-ish)
      const ok = /^\+?[0-9]{7,15}$/.test(digits);
      return ok ? undefined : message;
    },
};

export type FieldErrors<Keys extends string = string> = Partial<Record<Keys, string>>;

export function validateValues<
  TValues extends Record<string, string>,
  TKeys extends keyof TValues & string,
>(values: TValues, schema: Partial<Record<TKeys, Validator[]>>): FieldErrors<TKeys> {
  const errors: FieldErrors<TKeys> = {};

  for (const key of Object.keys(schema) as TKeys[]) {
    const validators = schema[key];
    if (!validators || validators.length === 0) continue;

    const value = values[key] ?? '';
    for (const validator of validators) {
      const message = validator(value);
      if (message) {
        errors[key] = message;
        break;
      }
    }
  }

  return errors;
}

export function hasErrors(errors: FieldErrors) {
  return Object.values(errors).some(Boolean);
}
