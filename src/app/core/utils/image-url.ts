import { environment } from '../../../environments/environment';

const PLACEHOLDER_IMAGE = '/product-placeholder.png';

/**
 * Resolves a relative image URL from the backend to a full URL.
 * If the URL is already absolute (http/https/data:), returns it unchanged.
 * If it starts with '/' (relative path from backend), prepends the serverUrl.
 * If empty/null/undefined, returns the placeholder image.
 *
 * Example:
 *   '/images/products/abc.jpg' → 'http://localhost:7117/images/products/abc.jpg'
 *   'data:image/jpeg;base64,...' → unchanged (still base64)
 *   'https://example.com/img.jpg' → unchanged
 *   '' or null → '/product-placeholder.png'
 */
export function resolveImageUrl(url: string | undefined | null): string {
    if (!url || url.trim() === '') return PLACEHOLDER_IMAGE;

    // Already an absolute URL or data URL — return as-is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }

    // Relative path from backend (e.g. /images/products/abc.jpg)
    if (url.startsWith('/')) {
        return `${environment.serverUrl}${url}`;
    }

    return url;
}
