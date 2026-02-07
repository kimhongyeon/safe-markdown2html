export function addTargetBlankToAnchors(htmlString: string): string {
  return htmlString.replace(/<a\s+([^>]*)>/gi, (_match, attributes) => {
    return `<a ${attributes} target="_blank">`;
  });
}
