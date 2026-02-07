export function correctMalformedUrls(htmlString: string): string {
  const regex =
    /<a\s+([^>]*?)href="([^"]*?)\)((?:<\/b>|\*\*)?)(%[0-9A-Fa-f]{2}[^"]*?)"([^>]*?)>([^<]*?)\)((?:\*\*)?[^<]*?)<\/a>/g;

  return htmlString.replace(
    regex,
    (
      _match,
      beforeHref,
      urlBase,
      closingMarkup,
      _encodedPart,
      afterHref,
      textBase,
      textAfterClosingParen,
    ) => {
      const cleanedText = textAfterClosingParen.replace(/^\*\*/, '');
      return `<a ${beforeHref}href="${urlBase}"${afterHref}>${textBase}</a>${closingMarkup})${cleanedText}`;
    },
  );
}
