import {
  correctUnconvertedBoldSyntax,
  preprocessBoldSyntax,
} from './bold-syntax';

describe('preprocessBoldSyntax', () => {
  test('should convert **text** to <strong>text</strong>', () => {
    expect(preprocessBoldSyntax('**bold**')).toBe('<strong>bold</strong>');
  });

  test('should handle multiple bold segments', () => {
    expect(preprocessBoldSyntax('**a** and **b**')).toBe(
      '<strong>a</strong> and <strong>b</strong>',
    );
  });

  test('should handle bold with parentheses', () => {
    expect(preprocessBoldSyntax('**text(내용)**')).toBe(
      '<strong>text(내용)</strong>',
    );
  });

  test('should not modify text without bold syntax', () => {
    expect(preprocessBoldSyntax('plain text')).toBe('plain text');
  });
});

describe('correctUnconvertedBoldSyntax', () => {
  test('should convert remaining **text** to <b>text</b>', () => {
    expect(correctUnconvertedBoldSyntax('**leftover**')).toBe(
      '<b>leftover</b>',
    );
  });

  test('should not modify text without bold syntax', () => {
    expect(correctUnconvertedBoldSyntax('plain text')).toBe('plain text');
  });
});
