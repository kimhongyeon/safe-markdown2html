import { correctMalformedUrls } from './malformed-url';

describe('correctMalformedUrls', () => {
  test('should not modify well-formed anchors', () => {
    const html = '<a href="https://example.com">link</a>';
    expect(correctMalformedUrls(html)).toBe(html);
  });

  test('should fix URL with closing parenthesis and encoded Korean text', () => {
    const malformed =
      '<a href="https://iha.go.kr)%EC%9C%BC%EB%A1%9C">https://iha.go.kr)으로</a>';
    const result = correctMalformedUrls(malformed);

    expect(result).toContain('href="https://iha.go.kr"');
    expect(result).not.toContain('%EC');
  });
});
