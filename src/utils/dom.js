export function querySelector(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.error(`Error querying selector "${selector}":`, error);
    return null;
  }
}

export function querySelectorAll(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (error) {
    console.error(`Error querying selector "${selector}":`, error);
    return [];
  }
}

export function setTextContent(element, text) {
  if (!element) {
    return false;
  }
  
  try {
    element.textContent = text;
    return true;
  } catch (error) {
    console.error('Error setting text content:', error);
    return false;
  }
}

export function setHTML(element, html) {
  if (!element) {
    return false;
  }
  
  try {
    const sanitized = sanitizeHTML(html);
    element.innerHTML = sanitized;
    return true;
  } catch (error) {
    console.error('Error setting HTML content:', error);
    return false;
  }
}

export function sanitizeHTML(html) {
  if (typeof html !== 'string') return '';
  
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\son\w+\s*=\s*[^\s>]*/gi, '');
  
  return sanitized;
}
