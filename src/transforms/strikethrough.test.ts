import { replaceDelTagsWithTilde } from './strikethrough';

describe('replaceDelTagsWithTilde', () => {
  test('should replace del tags with tilde', () => {
    expect(replaceDelTagsWithTilde('<del>text</del>')).toBe('~text~');
  });

  test('should replace multiple del tags', () => {
    expect(replaceDelTagsWithTilde('<del>a</del> and <del>b</del>')).toBe(
      '~a~ and ~b~',
    );
  });

  test('should not modify HTML without del tags', () => {
    expect(replaceDelTagsWithTilde('<p>text</p>')).toBe('<p>text</p>');
  });
});
