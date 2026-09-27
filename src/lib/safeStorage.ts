/**
 * Safe localStorage accessors.
 *
 * `localStorage.getItem` and `localStorage.setItem` throw when the
 * document is sandboxed without `allow-same-origin` (the iframe's
 * origin is opaque, and `localStorage` access is a hard error in
 * that case). This module wraps both calls so the host SPA never
 * crashes because of storage availability.
 *
 * Behaviour:
 *
 *   - `loadFromCache(key, defaultValue)` returns `defaultValue` if
 *     `localStorage` is unavailable, throws inside `getItem`, or has
 *     no entry for `key`. Malformed JSON also falls back to
 *     `defaultValue` rather than crashing the consumer.
 *   - `saveToCache(key, data)` is a no-op when `localStorage` is
 *     unavailable or throws inside `setItem`. JSON serialization
 *     errors are swallowed.
 *   - `clearCache()` is a no-op under the same conditions.
 *
 * The wrappers deliberately swallow errors: the canonical cache
 * fallback (fresh / default settings) is more important than
 * diagnostic accuracy in the iframe sandbox.
 */
function hasUsableStorage(): boolean {
	try {
		// `localStorage` access can throw a `SecurityError` directly
		// (opaque origin) or a `ReferenceError` (no `localStorage`).
		// `try/catch` covers both, plus `setItem` quota errors.
		const probeKey = "__safeStorageProbe__";
		window.localStorage.setItem(probeKey, probeKey);
		window.localStorage.removeItem(probeKey);
		return true;
	} catch {
		return false;
	}
}

const storageAvailable = hasUsableStorage();

export function loadFromCache<T>(key: string, defaultValue: T): T {
	if (!storageAvailable) return defaultValue;
	try {
		const cachedData = window.localStorage.getItem(key);
		if (cachedData === null) return defaultValue;
		return JSON.parse(cachedData) as T;
	} catch {
		// Malformed JSON or a transient `SecurityError` (e.g. the
		// sandbox was revoked mid-session): fall back rather than
		// throwing through to module top-level code.
		return defaultValue;
	}
}

export function saveToCache(key: string, data: unknown): void {
	if (!storageAvailable) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(data));
	} catch {
		// Quota exceeded or sandbox revoked: drop the write. The
		// in-memory state in `settings` already carries the change.
	}
}

export function clearCache(): void {
	if (!storageAvailable) return;
	try {
		window.localStorage.clear();
	} catch {
		// No-op on failure.
	}
}
