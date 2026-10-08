import { describe, it, expect } from 'vitest';
import { normalizeUrl } from '@/lib/url/normalize';

describe('URL Normalization Engine', () => {
  it('adds default http protocol if missing', () => {
    const result = normalizeUrl('example.com/login');
    expect(result.isValid).toBe(true);
    expect(result.normalized).toBe('http://example.com/login');
  });

  it('preserves existing https protocol and normalizes casing', () => {
    const result = normalizeUrl('HTTPS://EXAMPLE.COM/PATH');
    expect(result.isValid).toBe(true);
    expect(result.normalized).toBe('https://example.com/PATH');
  });

  it('strips default port 80 for http and 443 for https', () => {
    const resHttp = normalizeUrl('http://example.com:80/path');
    const resHttps = normalizeUrl('https://example.com:443/path');
    expect(resHttp.normalized).toBe('http://example.com/path');
    expect(resHttps.normalized).toBe('https://example.com/path');
  });

  it('decodes unreserved percent-encoded characters according to RFC 3986', () => {
    const result = normalizeUrl('https://example.com/%7Euser/%41%42%43');
    expect(result.isValid).toBe(true);
    expect(result.normalized).toBe('https://example.com/~user/ABC');
  });

  it('normalizes redundant duplicate slashes in pathname', () => {
    const result = normalizeUrl('https://example.com//foo///bar');
    expect(result.isValid).toBe(true);
    expect(result.normalized).toBe('https://example.com/foo/bar');
  });

  it('rejects unsupported protocols like javascript: or file:', () => {
    const resJs = normalizeUrl('javascript:alert(1)');
    const resFile = normalizeUrl('file:///etc/passwd');
    expect(resJs.isValid).toBe(false);
    expect(resFile.isValid).toBe(false);
  });
});
