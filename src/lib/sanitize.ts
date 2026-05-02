/**
 * Security utilities for input sanitization
 */

/**
 * Sanitize HTML string - removes dangerous tags and attributes
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
}

/**
 * Validate URL is from allowed domain
 */
export function isValidDomain(url: string, allowedDomains: string[]): boolean {
  try {
    const { hostname } = new URL(url);
    return allowedDomains.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * Sanitize URL parameters to prevent injection
 */
export function sanitizeQueryParams(params: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    sanitized[key] = String(value)
      .replace(/[<>]/g, '')
      .substring(0, 500);
  }
  return sanitized;
}

/**
 * Escape HTML entities
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}