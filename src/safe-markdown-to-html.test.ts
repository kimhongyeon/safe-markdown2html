import safeMarkdown2Html from './safe-markdown-to-html';

describe('safeMarkdown2Html', () => {
  test('should convert markdown to HTML and add target="_blank" to anchors', () => {
    const result = safeMarkdown2Html('[example](https://example.com)');

    expect(result).toBe(
      '<p><a href="https://example.com" target="_blank">example</a></p>\n',
    );
  });

  test('should handle empty markdown string', () => {
    expect(safeMarkdown2Html('')).toBe('');
  });

  test('should sanitize potentially malicious HTML', () => {
    const result = safeMarkdown2Html('<script>alert("xss")</script>');

    expect(result).not.toContain('<script>');
  });

  test('should add target="_blank" to multiple anchors', () => {
    const result = safeMarkdown2Html(
      '[link1](https://example1.com) [link2](https://example2.com)',
    );

    expect(result).toContain('target="_blank"');
    expect(result.match(/target="_blank"/g)).toHaveLength(2);
  });

  test('should handle anchors with multiple attributes', () => {
    const result = safeMarkdown2Html('[link](https://example.com)');

    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('target="_blank"');
  });

  test('should handle HTML without anchors', () => {
    const result = safeMarkdown2Html('# Heading\n\nParagraph text');

    expect(result).toContain('<h1>Heading</h1>');
    expect(result).toContain('<p>Paragraph text</p>');
  });

  test('should keep del tags by default (convertStrikethrough defaults to false)', () => {
    const result = safeMarkdown2Html('~~strikethrough text~~');

    expect(result).toBe('<p><del>strikethrough text</del></p>\n');
  });

  test('should keep multiple del tags by default', () => {
    const result = safeMarkdown2Html('~~first~~ and ~~second~~');

    expect(result).toBe('<p><del>first</del> and <del>second</del></p>\n');
  });

  test('should handle mixed content with del tags and anchors by default', () => {
    const result = safeMarkdown2Html(
      '[link](https://example.com) with ~~strikethrough~~',
    );

    expect(result).toContain('target="_blank"');
    expect(result).toContain('<del>strikethrough</del>');
  });

  test('should convert bold markdown syntax', () => {
    const result = safeMarkdown2Html('**bold text**');

    expect(result).toContain('bold text');
  });

  test('should handle mixed bold and other elements', () => {
    const result = safeMarkdown2Html(
      '**bold** [link](https://example.com) ~~strike~~',
    );

    expect(result).toContain('target="_blank"');
    expect(result).toContain('<del>strike</del>');
  });

  test('should handle bold syntax with parentheses', () => {
    const result = safeMarkdown2Html(
      '동일 사업에 대해 **사업자 공모(민간위탁)**와 **제안서 평가위원(후보자) 모집**이 함께 진행되고 있습니다.',
    );

    expect(result).toContain('<strong>사업자 공모(민간위탁)</strong>');
    expect(result).toContain('<strong>제안서 평가위원(후보자) 모집</strong>');
    expect(result).not.toContain('**');
  });

  describe('correctMalformedUrls', () => {
    test('should fix URL with closing parenthesis and Korean text', () => {
      const result = safeMarkdown2Html(
        "'무형유산지식새김'(https://iha.go.kr)으로 새 단장했습니다.",
      );

      expect(result).toBe(
        '<p>\'무형유산지식새김\'(<a href="https://iha.go.kr" target="_blank">https://iha.go.kr</a>)으로 새 단장했습니다.</p>\n',
      );
    });

    test('should fix multiple malformed URLs in same text', () => {
      const result = safeMarkdown2Html(
        '(https://a.com)가 and (https://b.com)나',
      );

      expect(result).toContain(
        '<a href="https://a.com" target="_blank">https://a.com</a>)가',
      );
      expect(result).toContain(
        '<a href="https://b.com" target="_blank">https://b.com</a>)나',
      );
    });

    test('should not affect correctly formed URLs', () => {
      const result = safeMarkdown2Html('text (https://example.com) more text');

      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('target="_blank"');
    });

    test('should handle URL with path followed by ) and non-ASCII text', () => {
      const result = safeMarkdown2Html('(https://example.com/path)텍스트');

      expect(result).toContain(
        '<a href="https://example.com/path" target="_blank">https://example.com/path</a>)텍스트',
      );
    });

    test('should fix URL with closing parenthesis, bold markup and Korean text', () => {
      const result = safeMarkdown2Html(
        '범부처통합연구지원시스템 **IRIS(http://www.iris.go.kr)**를 통해 접수·관리 시행',
      );

      expect(result).toBe(
        '<p>범부처통합연구지원시스템 <strong>IRIS(<a href="http://www.iris.go.kr" target="_blank">http://www.iris.go.kr</a>)</strong>를 통해 접수·관리 시행</p>\n',
      );
    });
  });

  describe('options', () => {
    test('linkTargetBlank: false should not add target="_blank"', () => {
      const result = safeMarkdown2Html('[link](https://example.com)', {
        linkTargetBlank: false,
      });

      expect(result).toContain('href="https://example.com"');
      expect(result).not.toContain('target="_blank"');
    });

    test('fixMalformedUrls: false should not correct malformed URLs', () => {
      const result = safeMarkdown2Html(
        "'무형유산지식새김'(https://iha.go.kr)으로 새 단장했습니다.",
        { fixMalformedUrls: false },
      );

      expect(result).not.toBe(
        '<p>\'무형유산지식새김\'(<a href="https://iha.go.kr" target="_blank">https://iha.go.kr</a>)으로 새 단장했습니다.</p>\n',
      );
    });

    test('fixBoldSyntax: false should not preprocess bold syntax', () => {
      const result = safeMarkdown2Html(
        '**사업자 공모(민간위탁)**와 **제안서 평가위원(후보자) 모집**',
        { fixBoldSyntax: false },
      );

      expect(result).toBeDefined();
    });

    test('convertStrikethrough: true should replace del tags with tilde', () => {
      const result = safeMarkdown2Html('~~strikethrough text~~', {
        convertStrikethrough: true,
      });

      expect(result).toBe('<p>~strikethrough text~</p>\n');
    });

    test('convertStrikethrough: true should handle multiple del tags', () => {
      const result = safeMarkdown2Html('~~first~~ and ~~second~~', {
        convertStrikethrough: true,
      });

      expect(result).toBe('<p>~first~ and ~second~</p>\n');
    });

    test('window option should use provided window', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { JSDOM } = require('jsdom');
      const customWindow = new JSDOM('').window;
      const result = safeMarkdown2Html('**hello**', { window: customWindow });

      expect(result).toContain('hello');
    });
  });
});
