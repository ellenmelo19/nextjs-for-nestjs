import { ZodError, type ZodFormattedError } from 'zod';

export function getZodErrorMessages<T>(
  error: ZodError<T> | ZodFormattedError<T, string>,
): string[] {
  const formatted = error instanceof ZodError ? error.format() : error;

  return Object.values(formatted)
    .map(field => {
      if (typeof field === 'function') return [];
      if (Array.isArray(field)) return field;
      if (field && typeof field === 'object' && '_errors' in field) {
        return field._errors as string[];
      }
      return [];
    })
    .flat()
    .filter(Boolean);
}
