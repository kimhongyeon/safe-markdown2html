export interface SafeMarkdown2HtmlOptions {
  /** Window object for DOMPurify (browser: auto-detected, server: JSDOM window) */
  window?: object;
  /** Add target="_blank" to all anchor tags (default: true) */
  linkTargetBlank?: boolean;
  /** Fix malformed URLs broken by parentheses (default: true) */
  fixMalformedUrls?: boolean;
  /** Fix bold syntax with parentheses that marked fails to parse (default: true) */
  fixBoldSyntax?: boolean;
  /** Convert ~~strikethrough~~ del tags to tilde notation (default: false) */
  convertStrikethrough?: boolean;
}
