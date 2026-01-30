'use client';

import DOMPurify from 'dompurify';

/**
 * Sanitize user-generated or AI-generated text content
 * Removes potentially malicious HTML/script content
 */
export function sanitizeText(text: string): string {
  if (typeof window === 'undefined') {
    // Server-side: escape HTML entities
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Client-side: use DOMPurify
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });
}

/**
 * Sanitize HTML content (for rich text display)
 * Only allows safe formatting tags
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: escape everything
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Client-side: use DOMPurify with limited safe tags
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}
