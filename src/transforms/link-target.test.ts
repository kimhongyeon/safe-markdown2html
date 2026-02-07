import { addTargetBlankToAnchors } from './link-target';

describe('addTargetBlankToAnchors', () => {
  test('should add target="_blank" to anchor', () => {
    expect(
      addTargetBlankToAnchors('<a href="https://example.com">link</a>'),
    ).toBe('<a href="https://example.com" target="_blank">link</a>');
  });

  test('should add target="_blank" to multiple anchors', () => {
    const html = '<a href="https://a.com">a</a> <a href="https://b.com">b</a>';
    const result = addTargetBlankToAnchors(html);

    expect(result.match(/target="_blank"/g)).toHaveLength(2);
  });

  test('should not modify HTML without anchors', () => {
    expect(addTargetBlankToAnchors('<p>text</p>')).toBe('<p>text</p>');
  });
});
