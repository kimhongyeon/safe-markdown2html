import type { SafeMarkdown2HtmlOptions } from './types';

import { marked } from 'marked';

import { getWindow, sanitize } from './sanitizer';
import {
  correctUnconvertedBoldSyntax,
  preprocessBoldSyntax,
} from './transforms/bold-syntax';
import { addTargetBlankToAnchors } from './transforms/link-target';
import { correctMalformedUrls } from './transforms/malformed-url';
import { replaceDelTagsWithTilde } from './transforms/strikethrough';

const defaults: Required<Omit<SafeMarkdown2HtmlOptions, 'window'>> = {
  linkTargetBlank: true,
  fixMalformedUrls: true,
  fixBoldSyntax: true,
  convertStrikethrough: false,
};

export default function safeMarkdown2Html(
  markdown: string,
  options?: SafeMarkdown2HtmlOptions,
): string {
  const opts = { ...defaults, ...options };
  const window = getWindow(opts);

  let result = markdown;

  if (opts.fixBoldSyntax) {
    result = preprocessBoldSyntax(result);
  }

  result = marked.parse(result) as string;
  result = sanitize(result, window);

  if (opts.fixMalformedUrls) {
    result = correctMalformedUrls(result);
  }

  if (opts.linkTargetBlank) {
    result = addTargetBlankToAnchors(result);
  }

  if (opts.convertStrikethrough) {
    result = replaceDelTagsWithTilde(result);
  }

  if (opts.fixBoldSyntax) {
    result = correctUnconvertedBoldSyntax(result);
  }

  return result;
}
