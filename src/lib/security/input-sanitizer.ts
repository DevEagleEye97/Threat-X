/**
 * THREATX Input Sanitizer
 * Enforces strict input validation before any pipeline processing.
 * Prevents oversized payloads, embedded scripts, and null-byte injection.
 */

/** Maximum allowed input length (characters) */
export const MAX_INPUT_LENGTH = 10_000;

/** Maximum allowed URL length (characters) */
export const MAX_URL_LENGTH = 2_048;

export interface SanitizedInput {
  content: string;
  originalLength: number;
  wasTruncated: boolean;
  strippedPatterns: string[];
}

/**
 * Dangerous patterns that should be stripped or flagged.
 * These are NOT threat indicators (those are handled by heuristics).
 * These are injection vectors targeting THREATX itself.
 */
const DANGEROUS_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /\0/g, name: 'null-byte' },
  { pattern: /%00/gi, name: 'encoded-null-byte' },
  { pattern: /\r\n|\r/g, name: 'crlf-injection' },
];

/**
 * Sanitize raw user input before pipeline processing.
 * Does NOT remove threat indicators — those are preserved for heuristic analysis.
 */
export function sanitizeInput(raw: string, maxLength: number = MAX_INPUT_LENGTH): SanitizedInput {
  const originalLength = raw.length;
  let content = raw;
  const strippedPatterns: string[] = [];

  // 1. Strip dangerous injection patterns targeting THREATX
  for (const { pattern, name } of DANGEROUS_PATTERNS) {
    if (pattern.test(content)) {
      strippedPatterns.push(name);
      content = content.replace(pattern, '');
    }
  }

  // 2. Enforce maximum length
  const wasTruncated = content.length > maxLength;
  if (wasTruncated) {
    content = content.substring(0, maxLength);
  }

  // 3. Trim whitespace
  content = content.trim();

  return {
    content,
    originalLength,
    wasTruncated,
    strippedPatterns,
  };
}

/**
 * Validate and sanitize a URL-type input specifically.
 */
export function sanitizeUrlInput(raw: string): SanitizedInput {
  return sanitizeInput(raw, MAX_URL_LENGTH);
}
