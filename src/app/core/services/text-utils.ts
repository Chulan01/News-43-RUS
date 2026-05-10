/**
 * Utility functions for text processing
 */

/**
 * Decodes HTML entities to regular characters
 */
export function decodeHtmlEntities(text: string): string {
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.textContent || div.innerText || '';
}

/**
 * Removes HTML tags and entities from text
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';

  let text = decodeHtmlEntities(html);
  text = fixRussianEncoding(text);
  text = text.replace(/<[^>]*>/g, '');

  text = text.replace(/©\s*\d{4}\s*/g, '');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&mdash;/g, '—');
  text = text.replace(/&ndash;/g, '–');
  text = text.replace(/&hellip;/g, '...');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&apos;/g, "'");
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&[a-zA-Z0-9#]+;/g, '');

  return normalizeNewsText(text);
}

export function normalizeNewsText(text: string): string {
  if (!text) return '';

  let normalized = text.replace(/(?:\r\n|\r|\n)/g, ' ');
  normalized = normalized.replace(/\[\+\d+\s*chars\]$/i, '');
  normalized = normalized.replace(/\s*([,.;:!?])\s*/g, '$1 ');
  normalized = normalized.replace(/([,.;:!?]){2,}/g, '$1');
  normalized = normalized.replace(/^[\s,.;:!?«»"'\-]+/, '');
  normalized = normalized.replace(/\s+/g, ' ').trim();

  if (normalized.length < 10 || /^[^\wА-Яа-яЁё]*$/i.test(normalized)) {
    return '';
  }

  return normalized;
}

export function hasEnoughRussianText(text: string): boolean {
  const cleaned = normalizeNewsText(text).replace(/[\s\W_]+/g, '');
  const russianLetters = (cleaned.match(/[А-Яа-яЁё]/g) || []).length;
  return russianLetters >= 10 && russianLetters / Math.max(cleaned.length, 1) >= 0.35;
}

/**
 * Truncates text to a specific length with ellipsis
 */
export function truncateText(text: string, length: number = 100): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Fixes encoding issues for Russian text
 */
export function fixRussianEncoding(text: string): string {
  if (!text) return '';

  let fixed = text;

  const mojibakePattern = /[ÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/;
  if (mojibakePattern.test(fixed)) {
    try {
      const bytes = new Uint8Array(Array.from(fixed, char => char.charCodeAt(0) & 0xff));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      if (/[-Яа-яё]/.test(decoded)) {
        fixed = decoded;
      }
    } catch {
      // Ignore if decoding fails and continue with other fixes.
    }
  }

  const encodingMap: { [key: string]: string } = {
    'Ð': 'Р', 'Ñ': 'С', 'Ò': 'Т', 'Ó': 'У', 'Ô': 'Ф', 'Õ': 'Х', 'Ö': 'Ц',
    '×': 'Ч', 'Ø': 'Ш', 'Ù': 'Щ', 'Ú': 'Ъ', 'Û': 'Ы', 'Ü': 'Ь', 'Ý': 'Э',
    'Þ': 'Ю', 'ß': 'Я', 'à': 'а', 'á': 'б', 'â': 'в', 'ã': 'г', 'ä': 'д',
    'å': 'е', 'æ': 'ж', 'ç': 'з', 'è': 'и', 'é': 'й', 'ê': 'к', 'ë': 'л',
    'ì': 'м', 'í': 'н', 'î': 'о', 'ï': 'п', 'ð': 'р', 'ñ': 'с', 'ò': 'т',
    'ó': 'у', 'ô': 'ф', 'õ': 'х', 'ö': 'ц', '÷': 'ч', 'ø': 'ш', 'ù': 'щ',
  };

  for (const [wrong, correct] of Object.entries(encodingMap)) {
    fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
  }

  return fixed;
}

/**
 * Safely parses JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
