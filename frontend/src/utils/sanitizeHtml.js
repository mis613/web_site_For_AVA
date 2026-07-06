import DOMPurify from 'dompurify';

export function sanitizeRichHtml(value = '') {
  return DOMPurify.sanitize(String(value || ''), {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'class', 'style']
  });
}
