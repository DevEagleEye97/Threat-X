import { describe, it, expect } from 'vitest';
import { validateUrlAgainstSsrf } from '@/lib/security/ssrf';

describe('SSRF Defense Engine', () => {
  it('blocks localhost and 127.0.0.1 loopback', async () => {
    const res1 = await validateUrlAgainstSsrf('http://localhost:3000/api');
    const res2 = await validateUrlAgainstSsrf('http://127.0.0.1:8080/admin');
    expect(res1.isSafe).toBe(false);
    expect(res2.isSafe).toBe(false);
  });

  it('blocks AWS/GCP/Azure link-local metadata endpoints', async () => {
    const resMeta = await validateUrlAgainstSsrf('http://169.254.169.254/latest/meta-data/');
    expect(resMeta.isSafe).toBe(false);
  });

  it('blocks RFC 1918 private subnets', async () => {
    const res10 = await validateUrlAgainstSsrf('http://10.0.0.5/');
    const res172 = await validateUrlAgainstSsrf('http://172.16.50.1/');
    const res192 = await validateUrlAgainstSsrf('http://192.168.1.254/');
    expect(res10.isSafe).toBe(false);
    expect(res172.isSafe).toBe(false);
    expect(res192.isSafe).toBe(false);
  });

  it('blocks non-HTTP protocols', async () => {
    const resFile = await validateUrlAgainstSsrf('file:///etc/shadow');
    const resGopher = await validateUrlAgainstSsrf('gopher://127.0.0.1:6379/_flushall');
    expect(resFile.isSafe).toBe(false);
    expect(resGopher.isSafe).toBe(false);
  });
});
