/**
 * Sanitize generated JavaScript code before execution.
 * Prevents code injection from tampered localStorage drafts.
 */
const DANGEROUS_PATTERNS = [
  /\beval\s*\(/i,
  /\bFunction\s*\(/i,
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\b/i,
  /\bdocument\b/i,
  /\bwindow\b/i,
  /\blocalStorage\b/i,
  /\bsessionStorage\b/i,
  /\bimport\s*\(/i,
  /\brequire\s*\(/i,
  /\blocation\s*=/i,
  /\bpostMessage\b/i,
  /\bWorker\b/i,
  /\bWebSocket\b/i,
];

export function sanitizeCode(code: string): string | null {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      console.warn('[Security] Blocked dangerous code pattern:', pattern.source);
      return null;
    }
  }
  // Blockly-generated code uses a limited set of api.* calls.
  // The pattern blacklist above catches the most dangerous injections.
  // For a complete allowlist-based approach, add token validation here.
  return code;
}
